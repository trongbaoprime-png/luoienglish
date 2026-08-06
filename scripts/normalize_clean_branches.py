"""Clean statistical header rows and normalize unicode accents for perfect branch dropdown."""

import sys
import json
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

BRANCH_MAP = {
    "BA CU": "BA CỪ (VŨNG TÀU)",
    "BÀ RỊA": "BÀ RỊA",
    "BIÊN HÒA": "BIÊN HÒA (ĐỒNG NAI)",
    "BÌNH CHÁNH": "BÌNH CHÁNH (HCM)",
    "BÌNH DƯƠNG": "BÌNH DƯƠNG",
    "BÌNH PHƯỚC": "BÌNH PHƯỚC",
    "BÌNH THẠNH": "BÌNH THẠNH (HCM)",
    "BÌNH THẠNH": "BÌNH THẠNH (HCM)",
    "BẠC LIÊU": "BẠC LIÊU",
    "CÀ MAU": "CÀ MAU",
    "CẦN THƠ 1": "CẦN THƠ 1",
    "CẦN THƠ 2": "CẦN THƠ 2",
    "DĨ AN": "DĨ AN (BÌNH DƯƠNG)",
    "GIA KIỆM": "GIA KIỆM (ĐỒNG NAI)",
    "GÒ VẤP": "GÒ VẤP (HCM)",
    "HCM": "HỒ CHÍ MINH",
    "HÒA BÌNH": "HÒA BÌNH (VŨNG TÀU)",
    "HÒA BÌNH": "HÒA BÌNH (VŨNG TÀU)",
    "HÓC MÔN": "HÓC MÔN (HCM)",
    "HÓC MÔN": "HÓC MÔN (HCM)",
    "LANDMARK": "LANDMARK (HCM)",
    "LBB": "LÊ BẢO BÌNH (HCM)",
    "MINH HÒA": "MINH HÒA (BÌNH DƯƠNG)",
    "PHƯỚC TỈNH": "PHƯỚC TỈNH (VŨNG TÀU)",
    "QUY NHƠN": "QUY NHƠN",
    "QUẬN 1": "QUẬN 1 (HCM)",
    "QUẬN 3": "QUẬN 3 (HCM)",
    "QUẬN 3": "QUẬN 3 (HCM)",
    "QUẬN 7": "QUẬN 7 (HCM)",
    "SÓC TRĂNG": "SÓC TRĂNG",
    "THỐT NỐT": "THỐT NỐT (CẦN THƠ)",
    "THỦ ĐỨC": "THỦ ĐỨC (HCM)",
    "TÂN BÌNH": "TÂN BÌNH (HCM)",
    "TÂN PHÚ": "TÂN PHÚ (HCM)",
    "TÂY NINH": "TÂY NINH",
    "TÊN LỬA": "TÊN LỬA (HCM)",
    "VĨNH LỘC B": "VĨNH LỘC B (HCM)",
    "XUYÊN MỘC": "XUYÊN MỘC (VŨNG TÀU)",
    "ĐÀ LẠT": "ĐÀ LẠT",
    "ĐÀ NẮNG": "ĐÀ NẮNG",
    "ĐÀ NĂNG": "ĐÀ NẮNG",
    "ĐÀ NẴNG": "ĐÀ NẮNG",
    "ĐẠI PHƯỚC": "BIÊN HÒA (ĐỒNG NAI)",
    "ĐỒNG THÁP": "ĐỒNG THÁP"
}

def clean_data():
    json_path = Path(".claude-ads/runs/live-meta-portfolio/all_customers_parsed.json")
    if not json_path.exists():
        return

    customers = json.loads(json_path.read_text(encoding="utf-8"))
    cleaned = []

    for c in customers:
        b_raw = str(c.get("branch", "")).strip().upper()
        
        # Skip statistical summary rows
        if any(stat in b_raw for stat in ["DOANH THU", "TỔNG", "HOTLINE", "WEBSITE", "FACEBOOK", "STT"]):
            continue
        if b_raw.replace('.', '').replace('-', '').isdigit():
            continue

        c["branch"] = BRANCH_MAP.get(b_raw, b_raw)
        cleaned.append(c)

    json_path.write_text(json.dumps(cleaned, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"[CLEANED] Saved {len(cleaned):,} customer records with perfect branch names!")

if __name__ == "__main__":
    clean_data()
