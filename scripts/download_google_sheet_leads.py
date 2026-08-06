"""Download and parse Lead Google Sheet from public export link."""

import sys
import json
import requests
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

SHEET_ID = "1zq0nnHqKgtsZBZnEKknM55qI_wjnm_Z5MzPBDLBD1jc"
CSV_EXPORT_URL = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv"
XLSX_EXPORT_URL = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=xlsx"

def fetch_lead_sheet():
    print(f"[GOOGLE SHEET] Attempting to download Google Sheet ID: {SHEET_ID}...")
    
    # Try downloading CSV format
    try:
        res = requests.get(CSV_EXPORT_URL, timeout=15)
        if res.status_code == 200 and len(res.content) > 50:
            csv_path = Path("data/google_leads.csv")
            csv_path.parent.mkdir(parents=True, exist_ok=True)
            csv_path.write_bytes(res.content)
            print(f"[SUCCESS] Downloaded Lead Sheet as CSV to {csv_path} ({len(res.content):,} bytes).")
            return "csv", csv_path
    except Exception as exc:
        print(f"[WARN] CSV fetch failed: {exc}")

    # Try downloading XLSX format
    try:
        res = requests.get(XLSX_EXPORT_URL, timeout=15)
        if res.status_code == 200 and len(res.content) > 50:
            xlsx_path = Path("data/google_leads.xlsx")
            xlsx_path.parent.mkdir(parents=True, exist_ok=True)
            xlsx_path.write_bytes(res.content)
            print(f"[SUCCESS] Downloaded Lead Sheet as XLSX to {xlsx_path} ({len(res.content):,} bytes).")
            return "xlsx", xlsx_path
    except Exception as exc:
        print(f"[WARN] XLSX fetch failed: {exc}")

    print("[ERROR] Could not download Google Sheet export.")
    return None, None

if __name__ == "__main__":
    fetch_lead_sheet()
