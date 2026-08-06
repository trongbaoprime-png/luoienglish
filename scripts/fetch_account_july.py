"""Fetch July 2026 detailed metrics for Meta Ad Account act_1539662916447581."""

import os
import sys
import json
import requests
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

USD_TO_VND = 27000

def load_env():
    env_path = Path(".env")
    if env_path.exists():
        for line in env_path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ[k.strip()] = v.strip()

def fetch_july_metrics():
    load_env()
    token = os.environ.get("META_API_TOKEN")
    acc_id = "act_1539662916447581"

    print(f"==================================================")
    print(f"   JULY 2026 REPORTING: ACCOUNT {acc_id}   ")
    print(f"==================================================")

    headers = {"Accept": "application/json"}
    
    # 1. Account Level Summary for July 2026
    # time_range={'since':'2026-07-01','until':'2026-07-28'}
    time_range = json.dumps({"since": "2026-07-01", "until": "2026-07-28"})
    
    url_acc = f"https://graph.facebook.com/v20.0/{acc_id}?fields=id,name,currency,account_status,amount_spent&access_token={token}"
    res_acc = requests.get(url_acc, headers=headers, timeout=15).json()

    url_insights_acc = f"https://graph.facebook.com/v20.0/{acc_id}/insights?fields=spend,impressions,clicks,ctr,cpc,cpm,reach,frequency,actions,cost_per_action_type&time_range={time_range}&access_token={token}"
    res_insights_acc = requests.get(url_insights_acc, headers=headers, timeout=15).json()

    # 2. Campaign Level Insights for July 2026
    url_campaigns = f"https://graph.facebook.com/v20.0/{acc_id}/insights?level=campaign&fields=campaign_id,campaign_name,objective,spend,impressions,clicks,ctr,cpc,cpm,reach,frequency,actions,cost_per_action_type&time_range={time_range}&limit=100&access_token={token}"
    res_campaigns = requests.get(url_campaigns, headers=headers, timeout=15).json()

    # 3. Ad Level Insights for July 2026
    url_ads = f"https://graph.facebook.com/v20.0/{acc_id}/insights?level=ad&fields=ad_id,ad_name,campaign_name,spend,impressions,clicks,ctr,cpc,actions&time_range={time_range}&limit=50&access_token={token}"
    res_ads = requests.get(url_ads, headers=headers, timeout=15).json()

    output = {
        "account_info": res_acc,
        "account_july_insights": res_insights_acc.get("data", []),
        "campaign_july_insights": res_campaigns.get("data", []),
        "ad_july_insights": res_ads.get("data", [])
    }

    out_file = Path(".claude-ads/runs/live-meta-portfolio/account_1539662916447581_july_report.json")
    out_file.write_text(json.dumps(output, indent=2, ensure_ascii=False), encoding="utf-8")
    
    print(f"[SUCCESS] July metrics fetched successfully!")
    print(f"[SAVE] Output saved to: {out_file}")
    
    return output

if __name__ == "__main__":
    fetch_july_metrics()
