"""Update HTML Dashboards to reflect 19,159 Booked Leads from Sheet DATHEN and 67,463 Total CAPI Events."""

import sys
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

def update_html():
    v9_path = Path("customer_roi_enterprise_v9.html")
    if v9_path.exists():
        content = v9_path.read_text(encoding="utf-8")
        content = content.replace("52,983", "67,463")
        content = content.replace("4,679", "19,159")
        content = content.replace("Google Sheet vừa nạp", "Sheet DATHEN (Google Sheet)")
        v9_path.write_text(content, encoding="utf-8")
        print("[SUCCESS HTML] customer_roi_enterprise_v9.html updated with 67,463 total events!")

    utf8_path = Path("customer_analytics_dashboard.html")
    if utf8_path.exists():
        content = utf8_path.read_text(encoding="utf-8")
        content = content.replace("52,983", "67,463")
        content = content.replace("4,679", "19,159")
        utf8_path.write_text(content, encoding="utf-8")
        print("[SUCCESS HTML] customer_analytics_dashboard.html updated with 67,463 total events!")

if __name__ == "__main__":
    update_html()
