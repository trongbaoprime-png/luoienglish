"""Fetch and report Meta CAPI Dataset Quality Metrics (Event Match Quality - EMQ).

Uses Meta Graph API endpoint /dataset_quality with read_ads_dataset_quality scope.
"""

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

def fetch_dataset_quality():
    load_env()
    token = os.environ.get("META_API_TOKEN")
    dataset_id = "902489598915870"

    if not token:
        print("[ERROR] META_API_TOKEN not found in .env")
        return

    print("=" * 70)
    print(f"📊 META DATASET QUALITY DIAGNOSTICS (EMQ)")
    print(f"Dataset / Pixel ID: {dataset_id}")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 70)

    url = "https://graph.facebook.com/v20.0/dataset_quality"
    params = {
        "dataset_id": dataset_id,
        "fields": "web{event_name,event_match_quality}",
        "access_token": token
    }

    try:
        response = requests.get(url, params=params, timeout=15)
        data = response.json()

        if "error" in data:
            print(f"[API ERROR] {data['error'].get('message')}")
            return

        web_metrics = data.get("web", [])
        if not web_metrics:
            print("[INFO] No dataset quality metrics returned for web events.")
            return

        print(f"\n{'EVENT NAME':<28} | {'EMQ SCORE':<10} | {'MATCH KEY COVERAGE'}")
        print("-" * 70)

        summary_report = []

        for item in web_metrics:
            event_name = item.get("event_name", "Unknown")
            emq = item.get("event_match_quality", {})
            score = emq.get("composite_score", 0.0)
            feedback = emq.get("match_key_feedback", [])

            coverage_parts = []
            for fb in feedback:
                key = fb.get("identifier", "")
                pct = fb.get("coverage", {}).get("percentage", 0)
                coverage_parts.append(f"{key}: {pct}%")

            coverage_str = ", ".join(coverage_parts) if coverage_parts else "N/A"
            print(f"{event_name:<28} | {score:<10.1f} | {coverage_str}")

            summary_report.append({
                "event_name": event_name,
                "emq_score": score,
                "match_keys": feedback
            })

        print("=" * 70)
        
        # Save output JSON report for dashboard consumption
        output_file = Path("data/dataset_quality_report.json")
        output_file.parent.mkdir(parents=True, exist_ok=True)
        output_file.write_text(json.dumps({
            "dataset_id": dataset_id,
            "updated_at": datetime.now().isoformat(),
            "events": summary_report
        }, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"\n✅ Dataset Quality report saved to: {output_file}")

    except Exception as exc:
        print(f"[ERROR] Failed to fetch Dataset Quality metrics: {exc}")

if __name__ == "__main__":
    fetch_dataset_quality()
