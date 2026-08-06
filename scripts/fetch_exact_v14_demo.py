"""Fetch exact production V14 HTML file from https://luoidonnha.com/wp-content/uploads/tools/ads.html."""

import sys
import requests
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

URL = "https://luoidonnha.com/wp-content/uploads/tools/ads.html"

def fetch_demo():
    print(f"[FETCH] Downloading exact V14 dashboard HTML from {URL}...")
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    try:
        res = requests.get(URL, headers=headers, timeout=30)
        if res.status_code == 200 and len(res.content) > 1000:
            out_file = Path("data/exact_v14_ads_demo.html")
            out_file.parent.mkdir(parents=True, exist_ok=True)
            out_file.write_bytes(res.content)
            print(f"[SUCCESS] Downloaded exact V14 HTML ({len(res.content):,} bytes). Saved to {out_file}")
        else:
            print(f"[ERROR] HTTP status {res.status_code}")
    except Exception as exc:
        print(f"[ERROR] Download failed: {exc}")

if __name__ == "__main__":
    fetch_demo()
