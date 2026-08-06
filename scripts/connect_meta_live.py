"""Live Meta Marketing API Multi-Account Connector & Audit System with Precision Currency Conversion."""

import os
import sys
import json
import requests
from pathlib import Path
from datetime import datetime
from claude_ads_core.scoring import score_portfolio

# Set console output encoding to UTF-8 for Windows PowerShell/CMD
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

# Default Exchange Rate USD -> VND
USD_TO_VND_RATE = 27000

def load_env():
    env_path = Path(".env")
    if env_path.exists():
        for line in env_path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ[k.strip()] = v.strip()

def fetch_live_ad_accounts(token: str, business_id: str):
    """Fetch ad accounts directly owned/managed by the Meta User and Business Manager."""
    headers = {"Accept": "application/json"}
    
    # 1. Fetch user's direct ad accounts
    url_my = f"https://graph.facebook.com/v20.0/me/adaccounts?fields=id,name,account_id,account_status,currency,amount_spent,spend_cap&limit=100&access_token={token}"
    res_my = requests.get(url_my, headers=headers, timeout=15).json()
    
    # 2. Fetch Business Manager owned ad accounts
    url_owned = f"https://graph.facebook.com/v20.0/{business_id}/owned_ad_accounts?fields=id,name,account_id,account_status,currency,amount_spent,spend_cap&limit=100&access_token={token}"
    res_owned = requests.get(url_owned, headers=headers, timeout=15).json()

    accounts_map = {}
    
    # Add My Ad Accounts (11 accounts)
    for acc in res_my.get("data", []):
        accounts_map[acc["id"]] = acc
        
    # Add Business Owned Ad Accounts
    for acc in res_owned.get("data", []):
        if acc["id"] not in accounts_map:
            accounts_map[acc["id"]] = acc

    return list(accounts_map.values()), res_my.get("data", [])

def run_live_meta_audit():
    load_env()
    token = os.environ.get("META_API_TOKEN")
    biz_id = os.environ.get("META_BUSINESS_ID", "577697808452822")
    rate = int(os.environ.get("USD_TO_VND_RATE", USD_TO_VND_RATE))

    if not token or token.startswith("EAAG..."):
        print("[ERROR] Valid META_API_TOKEN is required in .env file.")
        return

    print("==========================================================================================================")
    print(f"   LIVE META MARKETING API - MULTI-ACCOUNT AUDIT (VND RATE: {rate:,} VNĐ / USD)            ")
    print("==========================================================================================================")
    print(f"[AUTH] Meta Business ID: {biz_id}")

    all_accounts, direct_user_accounts = fetch_live_ad_accounts(token, biz_id)
    
    print(f"[DISCOVERY] Found {len(direct_user_accounts)} Direct User Ad Accounts.")
    print(f"[DISCOVERY] Found {len(all_accounts)} Total Business Ad Accounts.")

    snapshots_dir = Path(".claude-ads/snapshots/live")
    snapshots_dir.mkdir(parents=True, exist_ok=True)

    portfolio_entries = []
    account_summaries = []
    total_spend_usd_all = 0.0
    total_spend_vnd_all = 0

    print("\n-----------------------------------------------------------------------------------------------------------------------------")
    print(f"{'#':<3} | {'AD ACCOUNT ID':<18} | {'ACCOUNT NAME':<35} | {'SPEND (USD)':<14} | {'SPEND (VNĐ @ 27K)':<20} | {'STATUS'}")
    print("-----------------------------------------------------------------------------------------------------------------------------")

    for idx, acc in enumerate(all_accounts, start=1):
        acc_id = acc.get("id", "N/A")
        acc_name = acc.get("name", "Unnamed Account")
        currency = acc.get("currency", "USD").upper()
        raw_spent = float(acc.get("amount_spent", 0)) / 100.0
        
        if currency == "USD":
            spend_usd = raw_spent
            spend_vnd = int(raw_spent * rate)
        elif currency == "VND":
            spend_vnd = int(raw_spent)
            spend_usd = round(raw_spent / rate, 2)
        else:
            spend_usd = raw_spent
            spend_vnd = int(raw_spent * rate)

        status_code = acc.get("account_status", 1)
        status_str = "ACTIVE" if status_code == 1 else f"STATUS_{status_code}"
        
        total_spend_usd_all += spend_usd
        total_spend_vnd_all += spend_vnd

        # Determine individual health score based on active status & spend
        health_score = 90.0 if status_code == 1 else 65.0
        if spend_usd == 0:
            health_score = 75.0  # Unused or new account

        portfolio_entries.append({
            "account_id": acc_id,
            "health_score": health_score,
            "spend": spend_usd,
            "status": "normal" if health_score >= 80 else "provisional",
            "window": {"start": "2026-07-01", "end": "2026-07-28"}
        })

        account_summaries.append({
            "account_id": acc_id,
            "name": acc_name,
            "native_currency": currency,
            "spend_usd": spend_usd,
            "spend_vnd": spend_vnd,
            "status": status_str,
            "health_score": health_score
        })

        print(f"{idx:<3} | {acc_id:<18} | {acc_name[:35]:<35} | ${spend_usd:>13,.2f} | {spend_vnd:>17,d} VNĐ | {status_str}")

    print("-----------------------------------------------------------------------------------------------------------------------------")

    # Aggregate Portfolio Score using claude_ads_core.scoring
    portfolio_result = score_portfolio(portfolio_entries)

    print("\n=========================================================================================")
    print(f"[LIVE AUDIT SUMMARY]")
    print(f"  - Total Ad Accounts Discovered: {len(all_accounts)}")
    print(f"  - Direct User Accounts: {len(direct_user_accounts)}")
    print(f"  - Total Historical Spend (USD): ${total_spend_usd_all:,.2f} USD")
    print(f"  - Total Historical Spend (VNĐ): {total_spend_vnd_all:,.0f} VNĐ (Quy đổi tỷ giá 1 USD = {rate:,} VNĐ)")
    print(f"  - Spend-Weighted Portfolio Health: {portfolio_result.health_score:.2f} / 100 ({portfolio_result.status.upper()})")
    print("=========================================================================================")

    # Save Live Portfolio Summary JSON
    output_dir = Path(".claude-ads/runs/live-meta-portfolio")
    output_dir.mkdir(parents=True, exist_ok=True)
    summary_file = output_dir / "meta_live_portfolio_summary.json"
    
    summary_payload = {
        "schema_version": "1.0.0",
        "platform": "meta",
        "business_id": biz_id,
        "exchange_rate_usd_vnd": rate,
        "direct_user_accounts_count": len(direct_user_accounts),
        "total_business_accounts_count": len(all_accounts),
        "total_spend_usd": total_spend_usd_all,
        "total_spend_vnd": total_spend_vnd_all,
        "portfolio_health_score": portfolio_result.health_score,
        "portfolio_status": portfolio_result.status,
        "accounts": account_summaries
    }
    
    summary_file.write_text(json.dumps(summary_payload, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"[SAVED] Live Meta Portfolio Summary saved to: {summary_file}")
    
    return summary_payload

if __name__ == "__main__":
    run_live_meta_audit()
