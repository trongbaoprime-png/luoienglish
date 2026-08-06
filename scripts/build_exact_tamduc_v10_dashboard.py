"""Build Exact Tâm Đức Smile Enterprise Dashboard V10.1 with refined Pancake DDH flow."""

import sys
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

def generate_exact_v10_1_dashboard():
    html_code = """<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tâm Đức Smile - Báo Cáo Doanh Thu, Marketing & Meta CAPI DDH V10.1</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        :root {
            --bg-body: #0b1120;
            --bg-sidebar: #0f172a;
            --bg-card: #1e293b;
            --bg-card-hover: #334155;
            --accent-blue: #3b82f6;
            --accent-green: #10b981;
            --accent-red: #ef4444;
            --accent-purple: #8b5cf6;
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
            --border: #334155;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
        body { background-color: var(--bg-body); color: var(--text-main); display: flex; min-height: 100vh; }

        /* LEFT SIDEBAR */
        .sidebar { width: 240px; background: var(--bg-sidebar); border-right: 1px solid var(--border); padding: 20px 16px; display: flex; flex-direction: column; gap: 8px; flex-shrink: 0; }
        .logo-area { display: flex; align-items: center; gap: 12px; padding: 8px 12px; margin-bottom: 16px; }
        .logo-text { font-size: 16px; font-weight: 800; color: #ef4444; }
        .logo-sub { font-size: 10px; color: var(--text-muted); }

        .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 10px; color: var(--text-muted); font-size: 13px; font-weight: 600; cursor: pointer; text-decoration: none; transition: all 0.2s; }
        .nav-item:hover, .nav-item.active { background: var(--accent-blue); color: white; }

        /* MAIN CONTENT AREA */
        .main-content { flex: 1; padding: 20px 24px; overflow-y: auto; }

        /* HEADER FILTERS BAR */
        .filter-bar { background: var(--bg-sidebar); border-radius: 14px; border: 1px solid var(--border); padding: 16px 20px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 20px; }
        .date-tabs { display: flex; align-items: center; gap: 6px; background: #1e293b; padding: 4px; border-radius: 8px; }
        .date-tab { padding: 6px 14px; font-size: 12px; font-weight: 600; border-radius: 6px; cursor: pointer; color: var(--text-muted); }
        .date-tab.active { background: var(--accent-blue); color: white; }

        .dropdown-group { display: flex; gap: 10px; flex-wrap: wrap; }
        select { background: #1e293b; color: var(--text-main); border: 1px solid var(--border); padding: 8px 14px; border-radius: 8px; font-size: 12px; outline: none; }

        .btn-excel { background: var(--accent-blue); color: white; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 700; font-size: 12px; cursor: pointer; }

        /* CAPI PANCAKE LIVE NOTIFICATION BANNER */
        .capi-banner { background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(59, 130, 246, 0.15)); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 14px; padding: 16px 20px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
        .capi-badge { background: #10b981; color: white; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; }

        /* TOP METRICS ROW */
        .metrics-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; }
        .card-metric { background: var(--bg-card); border-radius: 14px; border: 1px solid var(--border); padding: 20px; position: relative; }
        .card-label { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
        .card-value { font-size: 26px; font-weight: 800; color: var(--text-main); margin-bottom: 12px; }
        
        .sub-breakdown { font-size: 11px; color: var(--text-muted); display: grid; grid-template-columns: 1fr 1fr; gap: 8px; border-top: 1px dashed var(--border); padding-top: 10px; }
        .sub-val { font-weight: 700; color: #60a5fa; }

        /* MIDDLE BREAKDOWN CARDS ROW */
        .metrics-grid-5 { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 20px; }
        .mini-card { background: var(--bg-card); border-radius: 12px; border: 1px solid var(--border); padding: 14px; text-align: center; }
        .mini-title { font-size: 11px; color: var(--text-muted); font-weight: 600; margin-bottom: 6px; }
        .mini-val { font-size: 16px; font-weight: 800; color: var(--text-main); }
        .mini-sub { font-size: 11px; color: var(--accent-green); margin-top: 4px; font-weight: 600; }

        /* BOTTOM CHARTS & TABLES GRID */
        .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 20px; }
        .box-panel { background: var(--bg-card); border-radius: 14px; border: 1px solid var(--border); padding: 20px; }
        .panel-title { font-size: 14px; font-weight: 700; margin-bottom: 14px; color: var(--text-main); display: flex; justify-content: space-between; }

        .rank-list { display: flex; flex-direction: column; gap: 10px; }
        .rank-item { display: flex; justify-content: space-between; align-items: center; font-size: 12px; }
        .rank-bar-bg { width: 100%; height: 6px; background: #0f172a; border-radius: 4px; overflow: hidden; margin-top: 4px; }
        .rank-bar-fill { height: 100%; background: var(--accent-blue); border-radius: 4px; }
    </style>
</head>
<body>

    <!-- LEFT SIDEBAR MENU -->
    <div class="sidebar">
        <div class="logo-area">
            <div>
                <div class="logo-text">TÂM ĐỨC SMILE</div>
                <div class="logo-sub">Răng Tốt Sức Khoẻ Tốt</div>
            </div>
        </div>

        <a class="nav-item active">📊 Tổng quan</a>
        <a class="nav-item">💸 Chi tiêu</a>
        <a class="nav-item">🎯 Chiến dịch</a>
        <a class="nav-item">🖼️ Nội dung quảng cáo</a>
        <a class="nav-item">💬 Data Pancake (DDH)</a>
        <a class="nav-item">💳 Facebook Billing</a>
        <a class="nav-item">👤 Tài khoản ads</a>
        <a class="nav-item">⚙️ Cài đặt</a>
    </div>

    <!-- MAIN CONTENT -->
    <div class="main-content">

        <!-- HEADER FILTERS BAR -->
        <div class="filter-bar">
            <div class="date-tabs">
                <span class="date-tab">Hôm nay</span>
                <span class="date-tab">Hôm qua</span>
                <span class="date-tab active">Tháng này (01/07/2026 - 31/07/2026)</span>
                <span class="date-tab">Tháng trước</span>
                <span class="date-tab">Tất cả</span>
            </div>

            <div class="dropdown-group">
                <select><option>Tất cả dịch vụ</option><option>Trồng Implant</option><option>Răng sứ</option><option>Niềng răng</option></select>
                <select><option>Tất cả khu vực</option></select>
                <select><option>Chọn chi nhánh</option><option>Tân Phú</option><option>Quy Nhơn</option><option>Biên Hòa</option></select>
                <select><option>Tất cả nguồn</option><option>Facebook</option><option>Google</option><option>TikTok</option></select>
                <select><option>Tất cả Telesale</option></select>
            </div>

            <button class="btn-excel">📥 Xuất Excel</button>
        </div>

        <!-- CAPI PANCAKE LIVE NOTIFICATION BANNER -->
        <div class="capi-banner">
            <div>
                <span class="capi-badge">LIVE CAPI REFINED</span>
                <strong style="margin-left: 10px; font-size: 14px;">BẮN SỰ KIỆN LEAD CAPI KHI VÀ CHỈ KHI ĐÃ CHUYỂN ĐỔI THÀNH THẺ PANCAKE 'DDH'</strong>
                <p style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">19,139 Lead (Đặt Hẹn DDH) • 48,595 Purchase (Khám Làm) • 616 Ca Rớt (Retargeting Audience)</p>
            </div>
            <button class="btn-excel" style="background: var(--accent-green);" onclick="alert('Đã kích hoạt Retargeting bám đuổi cho 616 ca rớt trên Facebook Ads!')">⚡ RETARGETING 616 CA RỚT</button>
        </div>

        <!-- TOP METRICS ROW -->
        <div class="metrics-grid-4">
            <div class="card-metric">
                <div class="card-label">Tổng Doanh Thu</div>
                <div class="card-value">1.788.923.875 ₫</div>
                <div class="sub-breakdown">
                    <div>Facebook: <span class="sub-val">723.775.530 ₫</span></div>
                    <div>Website/Google: <span class="sub-val">601.523.045 ₫</span></div>
                    <div>TikTok: <span class="sub-val">315.355.500 ₫</span></div>
                    <div>Hotline: <span class="sub-val">147.229.800 ₫</span></div>
                </div>
            </div>

            <div class="card-metric">
                <div class="card-label">Doanh Thu Tính MKT</div>
                <div class="card-value" style="color: #34d399;">1.673.738.175 ₫</div>
                <div class="sub-breakdown">
                    <div>Facebook MKT: <span class="sub-val">707.085.530 ₫</span></div>
                    <div>Google MKT: <span class="sub-val">576.245.145 ₫</span></div>
                </div>
            </div>

            <div class="card-metric">
                <div class="card-label">Tổng Check-in Phòng Khám</div>
                <div class="card-value" style="color: #60a5fa;">1.949 Khách</div>
                <div class="sub-breakdown">
                    <div>Ca Đậu (Khám làm): <span class="sub-val" style="color: #10b981;">1.253 (64.29%)</span></div>
                    <div>Ca Rớt (Retargeting): <span class="sub-val" style="color: #ef4444;">616 (31.67%)</span></div>
                </div>
            </div>

            <div class="card-metric">
                <div class="card-label">Chi Phí Quảng Cáo</div>
                <div class="card-value" style="color: #f59e0b;">Tracking Live</div>
                <div class="sub-breakdown">
                    <div>Chi phí / Ca Đặt Hẹn: <span class="sub-val">87.500 ₫</span></div>
                    <div>CAC / Bệnh nhân: <span class="sub-val">325.000 ₫</span></div>
                </div>
            </div>
        </div>

        <!-- MIDDLE METRICS BREAKDOWN ROW -->
        <div class="metrics-grid-5">
            <div class="mini-card">
                <div class="mini-title">THỰC THU</div>
                <div class="mini-val">499.355.545 ₫</div>
                <div class="mini-sub">1.266 KHÁCH</div>
            </div>
            <div class="mini-card">
                <div class="mini-title">THỰC THU MỚI</div>
                <div class="mini-val">328.579.645 ₫</div>
                <div class="mini-sub">940 KHÁCH (65.8%)</div>
            </div>
            <div class="mini-card">
                <div class="mini-title">THỰC THU CŨ</div>
                <div class="mini-val">170.775.900 ₫</div>
                <div class="mini-sub">326 KHÁCH (34.2%)</div>
            </div>
            <div class="mini-card">
                <div class="mini-title">DOANH THU MỚI</div>
                <div class="mini-val">444.397.285 ₫</div>
                <div class="mini-sub">896 KHÁCH</div>
            </div>
            <div class="mini-card">
                <div class="mini-title">DOANH THU CŨ</div>
                <div class="mini-val">237.907.945 ₫</div>
                <div class="mini-sub">313 KHÁCH</div>
            </div>
        </div>

        <!-- BOTTOM PANELS GRID -->
        <div class="grid-3">
            <div class="box-panel">
                <div class="panel-title"><span>DOANH THU THEO NGUỒN</span></div>
                <canvas id="chartSource" height="180"></canvas>
            </div>

            <div class="box-panel">
                <div class="panel-title"><span>DOANH THU THEO DỊCH VỤ</span></div>
                <canvas id="chartService" height="180"></canvas>
            </div>

            <div class="box-panel">
                <div class="panel-title"><span>TOP CHI NHÁNH TỶ LỆ ĐẬU</span></div>
                <div class="rank-list">
                    <div>
                        <div class="rank-item"><span>1. MINH HÒA</span><strong>100%</strong></div>
                        <div class="rank-bar-bg"><div class="rank-bar-fill" style="width: 100%;"></div></div>
                    </div>
                    <div>
                        <div class="rank-item"><span>2. CÀ MAU</span><strong>84.21%</strong></div>
                        <div class="rank-bar-bg"><div class="rank-bar-fill" style="width: 84.21%;"></div></div>
                    </div>
                    <div>
                        <div class="rank-item"><span>3. SÓC TRĂNG</span><strong>84.21%</strong></div>
                        <div class="rank-bar-bg"><div class="rank-bar-fill" style="width: 84.21%;"></div></div>
                    </div>
                    <div>
                        <div class="rank-item"><span>4. PHƯỚC TỈNH</span><strong>82.14%</strong></div>
                        <div class="rank-bar-bg"><div class="rank-bar-fill" style="width: 82.14%;"></div></div>
                    </div>
                    <div>
                        <div class="rank-item"><span>5. QUẬN 1</span><strong>81.11%</strong></div>
                        <div class="rank-bar-bg"><div class="rank-bar-fill" style="width: 81.11%;"></div></div>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <script>
        new Chart(document.getElementById('chartSource'), {
            type: 'doughnut',
            data: {
                labels: ['Facebook', 'Website/Google', 'TikTok', 'Hotline'],
                datasets: [{ data: [723775530, 601523045, 315355500, 147229800], backgroundColor: ['#3b82f6', '#10b981', '#ef4444', '#f59e0b'] }]
            },
            options: { plugins: { legend: { labels: { color: '#f8fafc' } } } }
        });

        new Chart(document.getElementById('chartService'), {
            type: 'pie',
            data: {
                labels: ['Chỉnh nha', 'Implant', 'Răng sứ', 'Tổng quát'],
                datasets: [{ data: [702382745, 430084300, 418263340, 238193490], backgroundColor: ['#8b5cf6', '#10b981', '#3b82f6', '#f59e0b'] }]
            },
            options: { plugins: { legend: { labels: { color: '#f8fafc' } } } }
        });
    </script>

</body>
</html>
"""
    v10_path = Path("customer_roi_enterprise_v10.html")
    v10_path.write_text(html_code, encoding="utf-8")
    dash_path = Path("customer_analytics_dashboard.html")
    dash_path.write_text(html_code, encoding="utf-8")
    print("[SUCCESS HTML] Dashboard updated to V10.1 with exact refined flow!")

if __name__ == "__main__":
    generate_exact_v10_1_dashboard()
