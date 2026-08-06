"""Analyze Meta Ads performance by Service, Staff/Operator, Campaign Quality, and Creative Insights."""

import json
import sys
from pathlib import Path
from collections import defaultdict

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

USD_TO_VND = 27000

def parse_service_and_staff(campaign_name: str):
    name_lower = campaign_name.lower()
    
    # 1. Staff Identification
    staff = "Khác / System"
    if "bảo" in name_lower or "bao" in name_lower:
        staff = "Nhân viên Bảo"
    elif "tiền" in name_lower or "tien" in name_lower:
        staff = "Nhân viên Tiền"
    elif "duyên" in name_lower or "duyen" in name_lower:
        staff = "Nhân viên Duyên"
    elif "hiền" in name_lower or "hien" in name_lower:
        staff = "Nhân viên Hiền"
    elif "trang" in name_lower:
        staff = "Nhân viên Trang"
    elif "nam" in name_lower:
        staff = "Nhân viên Nam"

    # 2. Service Identification
    service = "Dịch vụ Khác / Thương hiệu"
    if "implant" in name_lower or "cấy ghép" in name_lower:
        service = "Trồng Răng Implant"
    elif "sứ" in name_lower or "veneer" in name_lower or "bọc sứ" in name_lower:
        service = "Răng Sứ Thẩm Mỹ & Veneer"
    elif "niềng" in name_lower or "chỉnh hình" in name_lower or "invisalign" in name_lower:
        service = "Niềng Răng Chỉnh Hình"
    elif "tẩy trắng" in name_lower or "nhổ răng" in name_lower or "tổng quát" in name_lower:
        service = "Nha Khoa Tổng Quát"

    return service, staff

def analyze():
    insights_path = Path(".claude-ads/runs/live-meta-portfolio/meta_deep_insights.json")
    if not insights_path.exists():
        print("[ERROR] meta_deep_insights.json not found.")
        return

    data = json.loads(insights_path.read_text(encoding="utf-8"))

    service_stats = defaultdict(lambda: {"spend_usd": 0.0, "campaign_count": 0, "active_count": 0, "clicks": 0, "impressions": 0, "conversions": 0})
    staff_stats = defaultdict(lambda: {"spend_usd": 0.0, "campaign_count": 0, "active_count": 0, "clicks": 0, "impressions": 0, "conversions": 0})
    campaign_quality = []

    total_camps = 0
    total_active = 0
    total_spend_usd = 0.0

    for acc_id, acc_data in data.items():
        campaigns = acc_data.get("campaigns", [])
        insights_map = {item.get("campaign_id"): item for item in acc_data.get("insights", [])}

        for camp in campaigns:
            c_id = camp.get("id")
            c_name = camp.get("name", "")
            status = camp.get("status", "PAUSED")
            
            service, staff = parse_service_and_staff(c_name)
            
            insight = insights_map.get(c_id, {})
            spend = float(insight.get("spend", 0.0))
            clicks = int(insight.get("clicks", 0))
            impressions = int(insight.get("impressions", 0))
            
            # Extract conversions/leads from actions
            actions = insight.get("actions", [])
            conversions = 0
            for act in actions:
                act_type = act.get("action_type", "")
                if act_type in ["lead", "onsite_conversion.messaging_conversation_started_7d", "offsite_conversion.fb_pixel_custom", "purchase"]:
                    conversions += int(act.get("value", 0))

            total_camps += 1
            if status == "ACTIVE":
                total_active += 1
            total_spend_usd += spend

            # Aggregates
            service_stats[service]["spend_usd"] += spend
            service_stats[service]["campaign_count"] += 1
            if status == "ACTIVE": service_stats[service]["active_count"] += 1
            service_stats[service]["clicks"] += clicks
            service_stats[service]["impressions"] += impressions
            service_stats[service]["conversions"] += conversions

            staff_stats[staff]["spend_usd"] += spend
            staff_stats[staff]["campaign_count"] += 1
            if status == "ACTIVE": staff_stats[staff]["active_count"] += 1
            staff_stats[staff]["clicks"] += clicks
            staff_stats[staff]["impressions"] += impressions
            staff_stats[staff]["conversions"] += conversions

            campaign_quality.append({
                "account_id": acc_id,
                "campaign_id": c_id,
                "name": c_name,
                "service": service,
                "staff": staff,
                "status": status,
                "spend_usd": spend,
                "spend_vnd": int(spend * USD_TO_VND),
                "clicks": clicks,
                "impressions": impressions,
                "ctr": (clicks / impressions * 100) if impressions > 0 else 0.0,
                "cpc_usd": (spend / clicks) if clicks > 0 else 0.0,
                "conversions": conversions
            })

    output = {
        "summary": {
            "total_campaigns": total_camps,
            "total_active_campaigns": total_active,
            "total_spend_usd": total_spend_usd,
            "total_spend_vnd": int(total_spend_usd * USD_TO_VND)
        },
        "by_service": service_stats,
        "by_staff": staff_stats,
        "campaigns": campaign_quality
    }

    out_file = Path(".claude-ads/runs/live-meta-portfolio/meta_service_staff_breakdown.json")
    out_file.write_text(json.dumps(output, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"[SUCCESS] Analyzed {total_camps} campaigns across {len(service_stats)} services and {len(staff_stats)} staff operators!")
    print(f"[SAVE] Output written to: {out_file}")

if __name__ == "__main__":
    analyze()
