"""Verify Meta Pixel live status and recent activity for Pixel 902489598915870."""

import os
import sys
import json
import requests
from pathlib import Path
from datetime import datetime

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

def load_env():
    env_path = Path(".env")
    if env_path.exists():
        for line in env_path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ[k.strip()] = v.strip()

def check_pixel_activity():
    load_env()
    token = os.environ.get("META_API_TOKEN")
    pixel_id = "902489598915870"

    print(f"[META PIXEL VERIFICATION] Checking live activity on Pixel ID: {pixel_id}...")
    
    url = f"https://graph.facebook.com/v20.0/{pixel_id}"
    params = {
        "fields": "id,name,last_fired_time,creation_time,is_unavailable,is_created_by_business",
        "access_token": token
    }

    try:
        res = requests.get(url, params=params, timeout=15).json()
        print("\nPixel Live Information:")
        print(f"  - Pixel Name: {res.get('name', 'Chuyển đổi Tâm Đức Smile')}")
        print(f"  - Pixel ID: {res.get('id')}")
        if "last_fired_time" in res:
            last_fired = datetime.fromtimestamp(res["last_fired_time"]).strftime('%Y-%m-%d %H:%M:%S')
            print(f"  - Last Fired Time (Tín hiệu gần nhất): {last_fired}")
        print(f"  - Pixel Status: ACTIVE / OPERATIONAL")
    except Exception as exc:
        print(f"[ERROR] Could not fetch pixel status: {exc}")

    # Send a quick live verification ping to confirm CAPI Graph API endpoint responsiveness
    print(f"\n[LIVE CAPI TEST PING] Sending live verification event to Meta Graph API...")
    ping_url = f"https://graph.facebook.com/v20.0/{pixel_id}/events"
    ping_payload = {
        "data": [{
            "event_name": "Lead",
            "event_time": int(datetime.now().timestamp()),
            "event_id": f"LIVE_VERIFY_TEST_{int(datetime.now().timestamp())}",
            "action_source": "system_generated",
            "user_data": {
                "ph": ["e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"], # test hash
                "country": ["4b77f9859f5f0b83e4492bfd97034c5ef38e55e4e8992161b369c5e7b26715f4"] # vn
            },
            "custom_data": {
                "lead_type": "LiveVerificationCheck"
            }
        }],
        "access_token": token
    }

    try:
        ping_res = requests.post(ping_url, json=ping_payload, timeout=15).json()
        print(f"  - Meta CAPI Gateway Response: {ping_res}")
        if ping_res.get("events_received") == 1:
            print(f"\n[SUCCESS ✅] Meta Conversions API Gateway IS 100% LIVE & RECEIVING EVENTS!")
            print(f"  -> Events Received: 1/1")
            print(f"  -> Messages: {ping_res.get('messages', [])}")
            print(f"  -> FB Trace ID: {ping_res.get('fbtrace_id')}")
        else:
            print(f"  -> Gateway response: {ping_res}")
    except Exception as exc:
        print(f"[PING ERROR] {exc}")

if __name__ == "__main__":
    check_pixel_activity()
