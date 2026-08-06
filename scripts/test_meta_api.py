import os
import requests
import json
from pathlib import Path

def load_env():
    env_path = Path(".env")
    if env_path.exists():
        for line in env_path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ[k.strip()] = v.strip()

load_env()
token = os.environ.get("META_API_TOKEN")
biz_id = os.environ.get("META_BUSINESS_ID", "577697808452822")

print("Checking Meta API Connection...")

# 1. Me
res_me = requests.get(f"https://graph.facebook.com/v20.0/me?fields=id,name&access_token={token}").json()
print("Me:", json.dumps(res_me, indent=2))

# 2. me/adaccounts
res_my_accounts = requests.get(f"https://graph.facebook.com/v20.0/me/adaccounts?fields=id,name,account_id,account_status,currency,amount_spent&limit=100&access_token={token}").json()
print("My Ad Accounts count:", len(res_my_accounts.get("data", [])))

# 3. Business owned accounts
res_owned = requests.get(f"https://graph.facebook.com/v20.0/{biz_id}/owned_ad_accounts?fields=id,name,account_id,account_status,currency,amount_spent&limit=100&access_token={token}").json()
print("Business Owned Accounts count:", len(res_owned.get("data", [])))

# 4. Business client accounts
res_client = requests.get(f"https://graph.facebook.com/v20.0/{biz_id}/client_ad_accounts?fields=id,name,account_id,account_status,currency,amount_spent&limit=100&access_token={token}").json()
print("Business Client Accounts count:", len(res_client.get("data", [])))

all_accounts = {}
for acc in res_my_accounts.get("data", []):
    all_accounts[acc["id"]] = acc
for acc in res_owned.get("data", []):
    all_accounts[acc["id"]] = acc
for acc in res_client.get("data", []):
    all_accounts[acc["id"]] = acc

print(f"\nTOTAL UNIQUE DISCOVERED ACCOUNTS: {len(all_accounts)}")
for acc_id, acc in all_accounts.items():
    spent_str = f"${float(acc.get('amount_spent', 0))/100:.2f}"
    print(f"  - {acc_id:<20} | {acc.get('name', 'N/A'):<35} | Status: {acc.get('account_status')} | Spent: {spent_str}")
