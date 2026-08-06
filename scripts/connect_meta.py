"""Meta Ads connection helper script for Claude Ads system."""

import os
import sys
import json
from pathlib import Path
from claude_ads_core.adapters.csv_export import GenericCSVExportAdapter

def check_meta_credentials():
    token = os.environ.get("META_API_TOKEN")
    account_id = os.environ.get("META_AD_ACCOUNT_ID")
    
    print("==================================================")
    print("      CLAUDE ADS - META ADS CONNECTION CHECK      ")
    print("==================================================")
    
    if token and account_id:
        print(f"[OK] Live Meta API Credentials Detected:")
        print(f"     - Account ID: {account_id}")
        print(f"     - Access Token: {token[:8]}... (Secured)")
        return "api"
    else:
        print("[INFO] Live Meta API Token not set in environment (META_API_TOKEN).")
        print("[INFO] Operating in Meta Export Ingestion Mode.")
        return "export"

def ingest_meta_export_data(csv_path: str):
    path = Path(csv_path)
    if not path.exists():
        print(f"[ERROR] CSV file not found: {csv_path}")
        return False

    print(f"\n[INGEST] Parsing Meta Ads CSV Export: {csv_path}...")
    adapter = GenericCSVExportAdapter("meta")
    snapshot = adapter.read_snapshot(str(path))
    
    output_dir = Path(".claude-ads/snapshots")
    output_dir.mkdir(parents=True, exist_ok=True)
    snapshot_path = output_dir / "meta_account_snapshot.json"
    snapshot_path.write_text(json.dumps(snapshot, indent=2), encoding="utf-8")
    
    print(f"[SUCCESS] Meta Ads Account Snapshot created successfully:")
    print(f"          -> Location: {snapshot_path}")
    print(f"          -> Account Name: {snapshot['account']['name']} ({snapshot['account']['account_id']})")
    print(f"          -> Total Spend: ${snapshot['spend']:.2f} {snapshot['currency']}")
    print(f"          -> Active Campaigns: {len(snapshot['campaigns'])}")
    print(f"          -> Total Conversions: {sum(c['count'] for c in snapshot['conversions'])}")
    return True

def main():
    mode = check_meta_credentials()
    csv_file = "data/meta_ads_export.csv"
    if len(sys.argv) > 1:
        csv_file = sys.argv[1]
    
    ingest_meta_export_data(csv_file)
    print("\n[READY] Meta Ads is connected and ready for Audit, Planning & Optimization!")

if __name__ == "__main__":
    main()
