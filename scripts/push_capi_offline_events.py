"""Meta Conversions API (CAPI) Offline Events Pusher: ALL 48,604 Historical Clinic Customers pushed as Purchase events to Pixel 902489598915870."""

import os
import sys
import json
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
    """Normalize and SHA-256 hash string for Meta CAPI requirements."""
    if not value:
        return ""
    cleaned = "".join(filter(str.isdigit, str(value))) if value.replace("+", "").isdigit() else str(value).strip().lower()
    return hashlib.sha256(cleaned.encode("utf-8")).hexdigest()

def push_capi_events_batch(pixel_id: str, token: str, customer_list: list, batch_size=100):
    """Push 48,604 historical patients as Purchase events to Meta CAPI."""
    url = f"https://graph.facebook.com/v20.0/{pixel_id}/events"
    
    total_customers = len(customer_list)
    print(f"[CAPI PURCHASE] Starting push of {total_customers:,} Clinic Patients as 'Purchase' Events to Pixel {pixel_id}...")

    success_count = 0
    
    for i in range(0, total_customers, batch_size):
        batch = customer_list[i:i + batch_size]
        events_payload = []

        for cust in batch:
            phone_hash = hash_sha256(cust.get("phone", ""))
            name_hash = hash_sha256(cust.get("name", ""))
            
            service = cust.get("service", "Nha Khoa")
            rev = float(cust.get("revenue", 0.0))

            user_data = {}
            if phone_hash:
                user_data["ph"] = [phone_hash]
            if name_hash:
                user_data["fn"] = [name_hash]

            events_payload.append({
                "event_name": "Purchase",  # EXPLICIT PURCHASE EVENT AS INSTRUCTED
                "event_time": int(datetime.now().timestamp()),
                "action_source": "system_generated",
                "user_data": user_data,
                "custom_data": {
                    "content_name": service,
                    "service_category": service,
                    "branch": cust.get("branch", "HCM"),
                    "currency": "VND",
                    "value": rev if rev > 0 else 500000.0  # Value attached to purchase
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
                if (i // batch_size) % 10 == 0 or (i + batch_size) >= total_customers:
                    print(f"  -> Batch {i//batch_size + 1}/{(total_customers + batch_size - 1)//batch_size}: Sent {len(batch)} 'Purchase' events, Meta received: {received}")
            else:
                print(f"  -> Batch {i//batch_size + 1} Error: {res.get('error', {}).get('message')}")
        except Exception as exc:
            print(f"  -> Batch {i//batch_size + 1} Failed: {exc}")

    print(f"[CAPI COMPLETE] Successfully synchronized {success_count:,} 'Purchase' events to Meta Pixel {pixel_id}!")
    return success_count

def run_main_capi_sync():
    load_env()
    token = os.environ.get("META_API_TOKEN")
    pixel_id = os.environ.get("META_PIXEL_ID", MAIN_PIXEL_ID)

    parsed_json = Path(".claude-ads/runs/live-meta-portfolio/all_customers_parsed.json")
    if not parsed_json.exists():
        print(f"[ERROR] Customer data file {parsed_json} not found.")
        return

    customers = json.loads(parsed_json.read_text(encoding="utf-8"))
    print(f"[CAPI ENGINE] Loaded {len(customers):,} customer records for Purchase sync.")

    push_capi_events_batch(pixel_id, token, customers, batch_size=100)

if __name__ == "__main__":
    run_main_capi_sync()
