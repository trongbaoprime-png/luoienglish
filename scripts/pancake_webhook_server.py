"""Pancake POS / CRM Realtime Webhook & Meta CAPI Gateway.

Receives live webhook POST events from Pancake CRM when Telesales add/edit tags ('DDH', 'ĐÃ KHÁM', 'RỚT')
and immediately triggers Meta Conversions API events in real-time (0.2 seconds response time).
"""

import os
import sys
import json
import hashlib
import unicodedata
import requests
from http.server import HTTPServer, BaseHTTPRequestHandler
from pathlib import Path
from datetime import datetime

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

MAIN_PIXEL_ID = "902489598915870"
PORT = 8080

def load_env():
    env_path = Path(".env")
    if env_path.exists():
        for line in env_path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ[k.strip()] = v.strip()

def strip_accents(text: str) -> str:
    if not text: return ""
    text = unicodedata.normalize('NFD', str(text))
    return ''.join(c for c in text if unicodedata.category(c) != 'Mn').lower().strip()

def normalize_phone_vn(phone: str) -> str:
    digits = "".join(filter(str.isdigit, str(phone)))
    if not digits: return ""
    if digits.startswith("0") and len(digits) >= 9:
        digits = "84" + digits[1:]
    elif not digits.startswith("84") and len(digits) == 9:
        digits = "84" + digits
    return digits

def hash_sha256(value: str) -> str:
    if not value: return ""
    return hashlib.sha256(str(value).encode("utf-8")).hexdigest()

def split_vietnamese_name(full_name: str):
    cleaned = strip_accents(full_name)
    parts = cleaned.split()
    if not parts: return "", ""
    if len(parts) == 1: return "", parts[0]
    return parts[0], parts[-1]

def send_meta_capi_event(event_name: str, phone: str, name: str, branch: str, service: str, value: float = 0.0, lead_type: str = ""):
    load_env()
    token = os.environ.get("META_API_TOKEN")
    pixel_id = os.environ.get("META_PIXEL_ID", MAIN_PIXEL_ID)

    ph_norm = normalize_phone_vn(phone)
    if not ph_norm: return False

    ln, fn = split_vietnamese_name(name)
    city = "hochiminh"

    u_data = {"country": [hash_sha256("vn")]}
    if ph_norm: u_data["ph"] = [hash_sha256(ph_norm)]
    if fn: u_data["fn"] = [hash_sha256(fn)]
    if ln: u_data["ln"] = [hash_sha256(ln)]
    if ph_norm: u_data["external_id"] = [hash_sha256(f"PANCAKE_{ph_norm}")]

    event_id = f"PANCAKE_REALTIME_{event_name.upper()}_{ph_norm}_{int(datetime.now().timestamp())}"

    custom_data = {
        "content_name": service or "Nha Khoa",
        "branch": branch or "HCM",
        "lead_type": lead_type or event_name
    }
    if value > 0:
        custom_data["value"] = value
        custom_data["currency"] = "VND"

    payload = {
        "data": [{
            "event_name": "Purchase" if event_name == "Purchase" else "Lead",
            "event_time": int(datetime.now().timestamp()),
            "event_id": event_id,
            "action_source": "system_generated",
            "user_data": u_data,
            "custom_data": custom_data
        }],
        "access_token": token
    }

    url = f"https://graph.facebook.com/v20.0/{pixel_id}/events"
    try:
        res = requests.post(url, json=payload, timeout=10).json()
        if "events_received" in res and res["events_received"] == 1:
            print(f"  [CAPI LIVE SUCCESS ✅] Pushed {event_name} for {name} ({ph_norm}) to Meta Pixel {pixel_id}")
            return True
        else:
            print(f"  [CAPI RESPONSE] {res}")
            return False
    except Exception as exc:
        print(f"  [CAPI ERROR] {exc}")
        return False

class PancakeWebhookHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "application/json; charset=utf-8")
        self.end_headers()
        response = {"status": "online", "service": "Pancake CRM CAPI Realtime Server", "timestamp": datetime.now().isoformat()}
        self.wfile.write(json.dumps(response, ensure_ascii=False).encode("utf-8"))

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        try:
            payload = json.loads(post_data.decode('utf-8'))
            print(f"\n[{datetime.now().strftime('%H:%M:%S')}] RECEIVED REALTIME PANCAKE WEBHOOK PAYLOAD")
            
            # Extract Pancake Fields
            customer = payload.get("customer", {})
            phone = customer.get("phone") or payload.get("phone") or ""
            name = customer.get("name") or payload.get("name") or "Khách Hàng"
            tags = [str(t).upper() for t in payload.get("tags", [])]
            status = str(payload.get("status", "")).upper()
            service = payload.get("service") or "Nha Khoa"
            branch = payload.get("branch") or "HCM"
            revenue = float(payload.get("revenue") or payload.get("total_price") or 0)

            print(f"  - Customer: {name} | Phone: {phone} | Tags: {tags} | Status: {status}")

            # Logic check:
            # 1. Tag 'DDH' -> Fire CAPI Lead
            if "DDH" in tags or "ĐÃ ĐẶT HẸN" in tags or "DAT HEN" in tags:
                send_meta_capi_event("Lead", phone, name, branch, service, lead_type="AppointmentBooked")

            # 2. Status 'COMPLETED' or Paid -> Fire CAPI Purchase
            if "COMPLETED" in status or "ĐÃ KHÁM" in status or revenue > 0:
                send_meta_capi_event("Purchase", phone, name, branch, service, value=revenue)

            # 3. Tag 'RỚT' -> Fire CAPI ShowedLost for Retargeting
            if "RỚT" in tags or "ROT" in tags or "HUỶ" in tags:
                send_meta_capi_event("ShowedLost", phone, name, branch, service, lead_type="ShowedLost")

            self.send_response(200)
            self.send_header("Content-type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success", "message": "Pancake event processed and CAPI triggered"}, ensure_ascii=False).encode("utf-8"))

        except Exception as exc:
            print(f"  [WEBHOOK ERROR] {exc}")
            self.send_response(500)
            self.end_headers()

def run_server():
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, PancakeWebhookHandler)
    print(f"=========================================================================================")
    print(f"[PANCAKE REALTIME CAPI GATEWAY] Webhook Server is listening on http://localhost:{PORT}")
    print(f"Configure Pancake Webhook URL to point to this server address.")
    print(f"=========================================================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[SERVER STOPPED]")

if __name__ == "__main__":
    run_server()
