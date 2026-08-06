"""Meta Conversions API (CAPI) Lead Events Pusher for Google Sheet Qualified Leads (Pixel 902489598915870)."""

import os
import sys
import json
import csv
import hashlib
import requests
from pathlib import Path
from datetime import datetime

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

MAIN_PIXEL_ID = "902489598915870"

def load_env():
    env_path = Path(".env")
    if env_path.exists():
        for line in env_path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ[k.strip()] = v.strip()

def hash_sha256(value: str) -> str:
    """Normalize and SHA-256 hash string for Meta CAPI privacy rules."""
    if not value:
        return ""
    cleaned = "".join(filter(str.isdigit, str(value))) if str(value).replace("+", "").isdigit() else str(value).strip().lower()
    return hashlib.sha256(cleaned.encode("utf-8")).hexdigest()

def push_lead_events():
    load_env()
    token = os.environ.get("META_API_TOKEN")
    pixel_id = os.environ.get("META_PIXEL_ID", MAIN_PIXEL_ID)

    csv_path = Path("data/google_leads.csv")
    if not csv_path.exists():
        print(f"[ERROR] {csv_path} not found.")
        return

    with open(csv_path, "r", encoding="utf-8-sig", errors="ignore") as f:
        reader = list(csv.reader(f))

    if len(reader) < 2:
        print("[ERROR] Lead Sheet is empty.")
        return

    # Find Header row (Row 1)
    header = [str(c).upper().strip() for c in reader[1]]
    
    col_name = 6
    col_phone = 7
    col_source = 8
    col_branch = 9
    col_service = 10

    for idx, c in enumerate(header):
        if "HỌ TÊN" in c: col_name = idx
        elif "SỐ ĐT" in c or "SĐT" in c: col_phone = idx
        elif "NGUỒN" in c: col_source = idx
        elif "CHI NHÁNH" in c: col_branch = idx
        elif "DVU" in c or "DỊCH VỤ" in c: col_service = idx

    lead_list = []
    for row in reader[2:]:
        if not row or len(row) <= col_phone: continue
        
        name = str(row[col_name]).strip() if col_name < len(row) else ""
        phone = str(row[col_phone]).strip() if col_phone < len(row) else ""

        if not phone or phone.upper() in ["SỐ ĐT", "SĐT", "NONE"]:
            continue

        branch = str(row[col_branch]).strip() if col_branch < len(row) else "HCM"
        service = str(row[col_service]).strip() if col_service < len(row) else "Nha Khoa"
        source = str(row[col_source]).strip() if col_source < len(row) else "FACEBOOK"

        lead_list.append({
            "name": name,
            "phone": phone,
            "branch": branch,
            "service": service,
            "source": source
        })

    total_leads = len(lead_list)
    print(f"[CAPI LEAD ENGINE] Extracted {total_leads:,} Qualified Leads from Google Sheet.")
    print(f"[CAPI LEAD PUSH] Starting push of {total_leads:,} 'Lead' Events to Meta Pixel {pixel_id}...")

    url = f"https://graph.facebook.com/v20.0/{pixel_id}/events"
    batch_size = 100
    success_count = 0

    for i in range(0, total_leads, batch_size):
        batch = lead_list[i:i + batch_size]
        events_payload = []

        for cust in batch:
            phone_hash = hash_sha256(cust.get("phone", ""))
            name_hash = hash_sha256(cust.get("name", ""))
            
            user_data = {}
            if phone_hash:
                user_data["ph"] = [phone_hash]
            if name_hash:
                user_data["fn"] = [name_hash]

            events_payload.append({
                "event_name": "Lead",  # EXPLICIT LEAD EVENT FOR GOOGLE SHEET LEADS
                "event_time": int(datetime.now().timestamp()),
                "action_source": "system_generated",
                "user_data": user_data,
                "custom_data": {
                    "content_name": cust.get("service", "Nha Khoa"),
                    "service_category": cust.get("service", "Nha Khoa"),
                    "branch": cust.get("branch", "HCM"),
                    "lead_type": "QualifiedLead"
                }
            })

        payload = {
            "data": events_payload,
            "access_token": token
        }

        try:
            res = requests.post(url, json=payload, timeout=15).json()
            if "events_received" in res:
                received = res["events_received"]
                success_count += received
                if (i // batch_size) % 10 == 0 or (i + batch_size) >= total_leads:
                    print(f"  -> Batch {i//batch_size + 1}/{(total_leads + batch_size - 1)//batch_size}: Sent {len(batch)} 'Lead' events, Meta received: {received}")
            else:
                print(f"  -> Batch {i//batch_size + 1} Error: {res.get('error', {}).get('message')}")
        except Exception as exc:
            print(f"  -> Batch {i//batch_size + 1} Failed: {exc}")

    print(f"\n=========================================================================================")
    print(f"[CAPI LEAD COMPLETE] Successfully synchronized {success_count:,} 'Lead' events to Meta Pixel {pixel_id}!")
    print(f"=========================================================================================")

if __name__ == "__main__":
    push_lead_events()
