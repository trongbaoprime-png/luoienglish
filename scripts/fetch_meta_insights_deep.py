"""Deep Insight & Creative Evaluation Script for Meta Ads Accounts."""

import os
import sys
import json
import requests
from pathlib import Path

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

def fetch_deep_account_insights(token: str, account_ids: list):
    headers = {"Accept": "application/json"}
    results = {}

    for acc_id in account_ids:
        print(f"[FETCH] Querying Meta Graph API for account: {acc_id}...")
        
        # 1. Campaigns
        url_camps = f"https://graph.facebook.com/v20.0/{acc_id}/campaigns?fields=id,name,status,objective,effective_status,daily_budget,lifetime_budget,created_time&limit=25&access_token={token}"
        res_camps = requests.get(url_camps, headers=headers, timeout=15).json()
        campaigns = res_camps.get("data", [])

        # 2. Insights
        url_insights = f"https://graph.facebook.com/v20.0/{acc_id}/insights?level=campaign&fields=campaign_id,campaign_name,spend,impressions,clicks,ctr,cpc,cpm,actions,cost_per_action_type&date_preset=maximum&access_token={token}"
        res_insights = requests.get(url_insights, headers=headers, timeout=15).json()
        insights = res_insights.get("data", [])

        # 3. Ads / Creatives
        url_ads = f"https://graph.facebook.com/v20.0/{acc_id}/ads?fields=id,name,status,creative{{id,name,title,body,thumbnail_url}}&limit=25&access_token={token}"
        res_ads = requests.get(url_ads, headers=headers, timeout=15).json()
        ads = res_ads.get("data", [])

        results[acc_id] = {
            "campaigns": campaigns,
            "insights": insights,
            "ads": ads
        }

    return results

def main():
    load_env()
    token = os.environ.get("META_API_TOKEN")
    if not token or token.startswith("EAAG..."):
        print("[ERROR] Valid META_API_TOKEN is required.")
        return

    # Top target accounts for deep breakdown
    target_ids = [
        "act_2585492908287865", # ZFG | Tâm Đức x Sứ Implant 01
        "act_975004481277452",  # ZFG | Tâm Đức x Niềng Răng 01
        "act_1184116910445702", # ZFG | Tâm Đức Smile 01
        "act_1539662916447581", # Main 01
        "act_516501623839518"   # Main 02
    ]

    deep_data = fetch_deep_account_insights(token, target_ids)
    
    out_file = Path(".claude-ads/runs/live-meta-portfolio/meta_deep_insights.json")
    out_file.write_text(json.dumps(deep_data, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\n[SAVED] Deep insights data saved to: {out_file}")

if __name__ == "__main__":
    main()
