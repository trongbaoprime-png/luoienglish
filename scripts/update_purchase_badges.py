"""Update HTML dashboard status badges to explicitly display Purchase CAPI status."""

import sys
import json
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

def update_html_purchase_badges():
    # Update fix_dashboard_utf8.py
    utf8_script = Path("scripts/fix_dashboard_utf8.py")
    if utf8_script.exists():
        text = utf8_script.read_text(encoding="utf-8")
        text = text.replace("CAPI Ready (Pixel 902489598915870)", "Purchase (Pixel 902489598915870)")
        text = text.replace("CAPI Ready", "Purchase")
        utf8_script.write_text(text, encoding="utf-8")

    # Update build_enterprise_v9_dashboard.py
    v9_script = Path("scripts/build_enterprise_v9_dashboard.py")
    if v9_script.exists():
        text = v9_script.read_text(encoding="utf-8")
        text = text.replace("CAPI Ready", "Purchase")
        v9_script.write_text(text, encoding="utf-8")

    print("[SUCCESS BADGE UPDATE] Scripts updated to Purchase CAPI status.")

if __name__ == "__main__":
    update_html_purchase_badges()
