"""Analyze Marketing ROI Executive Dashboard HTML data for 2025-2026."""

import re
import json
import sys
from pathlib import Path
from collections import defaultdict

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

def analyze_dashboard():
    html_path = Path("data/dash.html")
    if not html_path.exists():
        print("[ERROR] data/dash.html not found.")
        return

    content = html_path.read_text(encoding="utf-8")
    
    # Extract RAW array regex
    match = re.search(r'const RAW\s*=\s*(\[.*?\]);', content, re.DOTALL)
    if not match:
        print("[ERROR] Could not extract RAW array from HTML.")
        return

    raw_data = json.loads(match.group(1))
    
    # Aggregate by Branch for 2025 and 2026
    branches = defaultdict(lambda: {
        "rev_2025": 0.0, "bud_2025": 0.0,
        "rev_2026": 0.0, "bud_2026": 0.0,
        "rev_total": 0.0, "bud_total": 0.0
    })

    total_2025_rev = 0.0
    total_2025_bud = 0.0
    total_2026_rev = 0.0
    total_2026_bud = 0.0

    for row in raw_data:
        branch = row.get("branch", "").strip()
        if not branch or branch == "TỔNG":
            continue

        year = row.get("year")
        rev = float(row.get("revenue", 0.0))
        bud = float(row.get("budget", 0.0))

        if year == 2025:
            branches[branch]["rev_2025"] += rev
            branches[branch]["bud_2025"] += bud
            total_2025_rev += rev
            total_2025_bud += bud
        elif year == 2026:
            branches[branch]["rev_2026"] += rev
            branches[branch]["bud_2026"] += bud
            total_2026_rev += rev
            total_2026_bud += bud

        branches[branch]["rev_total"] += rev
        branches[branch]["bud_total"] += bud

    summary_list = []
    for b_name, data in branches.items():
        pct_2025 = (data["bud_2025"] / data["rev_2025"] * 100) if data["rev_2025"] > 0 else 0.0
        pct_2026 = (data["bud_2026"] / data["rev_2026"] * 100) if data["rev_2026"] > 0 else 0.0
        pct_total = (data["bud_total"] / data["rev_total"] * 100) if data["rev_total"] > 0 else 0.0
        over_15 = max(0.0, data["bud_total"] - (data["rev_total"] * 0.15))

        summary_list.append({
            "branch": b_name,
            "rev_2025": data["rev_2025"],
            "bud_2025": data["bud_2025"],
            "pct_2025": pct_2025,
            "rev_2026": data["rev_2026"],
            "bud_2026": data["bud_2026"],
            "pct_2026": pct_2026,
            "rev_total": data["rev_total"],
            "bud_total": data["bud_total"],
            "pct_total": pct_total,
            "over_15_vnd": over_15
        })

    summary_list.sort(key=lambda x: x["rev_total"], reverse=True)

    output = {
        "totals": {
            "rev_2025": total_2025_rev,
            "bud_2025": total_2025_bud,
            "pct_2025": (total_2025_bud / total_2025_rev * 100) if total_2025_rev > 0 else 0,
            "rev_2026": total_2026_rev,
            "bud_2026": total_2026_bud,
            "pct_2026": (total_2026_bud / total_2026_rev * 100) if total_2026_rev > 0 else 0,
            "rev_total": total_2025_rev + total_2026_rev,
            "bud_total": total_2025_bud + total_2026_bud,
            "pct_total": ((total_2025_bud + total_2026_bud) / (total_2025_rev + total_2026_rev) * 100)
        },
        "branches": summary_list
    }

    out_file = Path(".claude-ads/runs/live-meta-portfolio/dashboard_roi_analysis.json")
    out_file.write_text(json.dumps(output, indent=2, ensure_ascii=False), encoding="utf-8")

    print("=========================================================================================")
    print("   MARKETING ROI EXECUTIVE DASHBOARD SUMMARY (2025-2026)                                ")
    print("=========================================================================================")
    print(f"Total Revenue 2025-2026: {output['totals']['rev_total']:,.0f} VNĐ (~{output['totals']['rev_total']/1e9:.2f} Tỷ)")
    print(f"Total MKT Budget 2025-2026: {output['totals']['bud_total']:,.0f} VNĐ (~{output['totals']['bud_total']/1e9:.2f} Tỷ)")
    print(f"Overall %MKT: {output['totals']['pct_total']:.2f}% (Benchmark chuẩn: 15.00%)")
    print("-----------------------------------------------------------------------------------------")
    print(f"{'CHI NHÁNH':<18} | {'DOANH THU (VNĐ)':<20} | {'NGÂN SÁCH (VNĐ)':<18} | {'%MKT':<8} | {'TÌNH TRẠNG'}")
    print("-----------------------------------------------------------------------------------------")

    for item in summary_list:
        b_name = item["branch"]
        rev = item["rev_total"]
        bud = item["bud_total"]
        pct = item["pct_total"]
        
        status = "🟢 Hiệu quả (<15%)" if pct < 15 else ("🟡 Theo dõi (15-20%)" if pct <= 20 else "🔴 Cần lưu ý (>20%)")
        print(f"{b_name:<18} | {rev:>20,.0f} | {bud:>18,.0f} | {pct:>7.2f}% | {status}")

    print("=========================================================================================")
    return output

if __name__ == "__main__":
    analyze_dashboard()
