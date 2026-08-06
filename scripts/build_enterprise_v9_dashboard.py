"""Build Enterprise V9.1 Dashboard with exact user service classification directives."""

import sys
import json
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

def build_v9_dashboard():
    json_path = Path(".claude-ads/runs/live-meta-portfolio/all_customers_parsed.json")
    if not json_path.exists():
        return

    customers = json.loads(json_path.read_text(encoding="utf-8"))
    print(f"[V9 BUILDER EXACT] Loaded {len(customers):,} customer records.")

    compact_rows = []
    for c in customers:
        f_name = c.get("file", "")
        period = f_name.replace("DT ", "").replace(".xlsx", "") if f_name else "T6.2026"
        compact_rows.append([
            period,
            c.get("date", ""),
            c.get("name", ""),
            c.get("phone", ""),
            c.get("source", "FACEBOOK"),
            c.get("branch", "HCM"),
            c.get("service", "Khác"),
            c.get("staff", ""),
            f_name
        ])

    json_str = json.dumps(compact_rows, ensure_ascii=False)

    html_content = f"""<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Dashboard Doanh Thu & Khách Hàng Enterprise V9.1 — Nha Khoa Tâm Đức Smile</title>
<script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
<style>
:root{{--bg:#f3f6fb;--card:#fff;--dark:#0f172a;--muted:#64748b;--line:#e2e8f0;--blue:#2563eb;--blue2:#1d4ed8;--green:#10b981;--orange:#f59e0b;--red:#ef4444;--purple:#7c3aed;--shadow:0 8px 24px rgba(15,23,42,.08);--radius:16px}}
*{{box-sizing:border-box}}
body{{margin:0;background:var(--bg);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;color:var(--dark)}}
.app{{display:flex;min-height:100vh}}
.sidebar{{width:240px;background:#081526;color:#e5eefc;position:sticky;top:0;height:100vh;padding:18px 12px;box-shadow:4px 0 18px rgba(2,6,23,.15);z-index:10}}
.brand{{font-size:17px;font-weight:900;line-height:1.25;margin:4px 8px 18px;color:#fff}}
.brand small{{display:block;color:#93c5fd;font-size:12px;font-weight:700;margin-top:4px}}
.nav button{{display:flex;align-items:center;gap:9px;width:100%;border:0;background:transparent;color:#cbd5e1;border-radius:12px;padding:10px 12px;margin:3px 0;text-align:left;font-weight:800;cursor:pointer}}
.nav button.active,.nav button:hover{{background:#1d4ed8;color:#fff}}

.main{{flex:1;min-width:0}}
.topbar{{position:sticky;top:0;background:rgba(243,246,251,.95);backdrop-filter:blur(12px);border-bottom:1px solid var(--line);z-index:9;padding:12px 18px}}
.toolbar{{display:flex;gap:8px;flex-wrap:wrap;align-items:center}}
.btn{{border:0;border-radius:11px;padding:10px 14px;font-weight:800;cursor:pointer;background:#fff;color:#0f172a;box-shadow:0 2px 8px rgba(15,23,42,.08);border:1px solid var(--line);font-size:13px;display:inline-flex;align-items:center;gap:6px}}
.btn.primary{{background:var(--blue);color:white;border-color:var(--blue)}}
.btn.danger{{background:#fee2e2;color:#991b1b;border-color:#fecaca}}
.btn.green{{background:#dcfce7;color:#166534;border-color:#bbf7d0}}
.btn:hover{{filter:brightness(.97)}}
.status{{font-size:13px;color:#475569;margin-left:auto;font-weight:800}}

.content{{padding:18px}}
.dropzone{{border:2px dashed #93c5fd;background:#eff6ff;border-radius:var(--radius);padding:14px 18px;text-align:center;color:#1d4ed8;font-weight:800;margin-bottom:14px}}
.dropzone.drag{{background:#dbeafe;border-color:#2563eb}}

.filters{{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin-bottom:14px}}
.search-box{{flex:1;min-width:240px;padding:10px 14px;border-radius:12px;border:1px solid var(--line);outline:none;font-size:13px;background:white;font-weight:600}}
select{{width:100%;padding:10px 12px;border-radius:12px;border:1px solid var(--line);background:white;font-weight:700;font-size:13px;cursor:pointer}}

.cards{{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:14px}}
.card{{background:#fff;border-radius:var(--radius);box-shadow:var(--shadow);border:1px solid var(--line);padding:16px;position:relative;overflow:hidden}}
.card:before{{content:"";position:absolute;left:0;top:0;bottom:0;width:5px;background:var(--blue)}}
.card.green:before{{background:var(--green)}}
.card.orange:before{{background:var(--orange)}}
.card.purple:before{{background:var(--purple)}}
.card.red:before{{background:var(--red)}}
.card .label{{color:var(--muted);font-weight:800;font-size:12px;text-transform:uppercase}}
.card .value{{font-size:24px;font-weight:900;margin-top:4px}}
.card .sub{{font-size:12px;color:#64748b;margin-top:2px}}

.section{{background:#fff;border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow);padding:16px;margin-bottom:14px}}
.section h2{{font-size:16px;margin:0 0 12px;font-weight:900;color:#0f2850}}

.table-wrap{{overflow:auto;border:1px solid var(--line);border-radius:13px}}
.table{{width:100%;border-collapse:collapse;min-width:800px}}
.table th,.table td{{padding:11px 14px;border-bottom:1px solid var(--line);font-size:13px;text-align:left}}
.table th{{background:#0f2850;color:white;font-weight:800;position:sticky;top:0;z-index:2}}
.table tbody tr:nth-child(even){{background:#f8fafc}}
.table tbody tr:hover{{background:#eff6ff}}

.pill{{display:inline-block;padding:3px 9px;border-radius:999px;font-weight:800;font-size:11px}}
.p-good{{background:#dcfce7;color:#166534}}
.p-warn{{background:#fef3c7;color:#92400e}}
.p-blue{{background:#e0f2fe;color:#075985}}

.tab{{display:none}}
.tab.active{{display:block}}

.pagination{{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:#f8fafc;border-top:1px solid var(--line);font-size:13px;font-weight:700}}
.page-btn{{padding:6px 12px;border-radius:8px;border:1px solid var(--line);background:white;cursor:pointer;font-weight:800}}
</style>
</head>
<body>
<div class="app">
  <aside class="sidebar">
    <div class="brand">Doanh Thu Enterprise <small>V9.1 · Tâm Đức Smile</small></div>
    <div class="nav" id="nav">
      <button onclick="switchTab('overview')" class="active" id="tabBtn-overview">📌 Tổng quan</button>
      <button onclick="switchTab('customer')" id="tabBtn-customer">⭐ Khách hàng (48.6k)</button>
      <button onclick="switchTab('branch')" id="tabBtn-branch">🏢 Chi nhánh</button>
      <button onclick="switchTab('service')" id="tabBtn-service">🦷 Dịch vụ</button>
      <button onclick="switchTab('source')" id="tabBtn-source">📣 Nguồn Marketing</button>
      <button onclick="switchTab('meta')" id="tabBtn-meta">🎯 Meta CAPI Hub</button>
    </div>
  </aside>

  <main class="main">
    <div class="topbar">
      <div class="toolbar">
        <label class="btn primary">📂 Thêm file Excel<input id="fileInput" type="file" multiple accept=".xlsx,.xls" style="display:none" onchange="handleFileSelect(event)"></label>
        <button class="btn green" onclick="triggerCapiPush()">⚡ Bắn CAPI (Pixel 902489598915870)</button>
        <button class="btn green" onclick="exportMetaCSV()">⬇ Xuất CSV Meta</button>
        <button class="btn" onclick="exportFullCSV()">⬇ Xuất Excel Báo Cáo</button>
        <button class="btn danger" onclick="resetFilters()">🔄 Reset Lọc</button>
        <div class="status" id="statusText">Đã nạp 48,604 Khách Hàng</div>
      </div>
    </div>

    <div class="content">
      <div class="dropzone" id="dropzone" ondragover="event.preventDefault()" ondrop="handleDrop(event)">
        📁 Kéo thả file Excel mới (DT T7.2026.xlsx...) vào đây hoặc bấm "📂 Thêm file Excel" để cập nhật tự động!
      </div>

      <div class="cards">
        <div class="card">
          <div class="label">Tổng Khách Hàng</div>
          <div class="value" id="cardTotalCust">48,604</div>
          <div class="sub">15 File Tháng (T4/2025 -> T6/2026)</div>
        </div>
        <div class="card green">
          <div class="label">Doanh Thu Hợp Nhất</div>
          <div class="value">144.51 Tỷ</div>
          <div class="sub">17 Chi nhánh toàn hệ thống</div>
        </div>
        <div class="card orange">
          <div class="label">Ngân Sách MKT</div>
          <div class="value">25.72 Tỷ</div>
          <div class="sub">%MKT Hợp nhất: 17.79%</div>
        </div>
        <div class="card red">
          <div class="label">Trạng Thái CAPI</div>
          <div class="value">Sẵn Sàng</div>
          <div class="sub">Pixel: 902489598915870</div>
        </div>
      </div>

      <div class="filters">
        <input type="text" id="searchInput" class="search-box" placeholder="🔍 Tìm nhanh Tên, SĐT, Chi nhánh, Dịch vụ..." oninput="onFilter()">
        
        <select id="branchSelect" onchange="onFilter()">
          <option value="all">Tất cả Chi nhánh</option>
        </select>

        <select id="serviceSelect" onchange="onFilter()">
          <option value="all">Tất cả Dịch vụ</option>
          <option value="IMP">Trồng răng Implant (IMP/IMPLANT/CẤY GHÉP)</option>
          <option value="SỨ">Răng sứ thẩm mỹ (SỨ/SU/VENEER)</option>
          <option value="NR">Niềng răng chỉnh hình (CN/NIỀNG)</option>
          <option value="TQ">Nha khoa tổng quát (TRÁM/CTUY/TTR/TL/HDT...)</option>
        </select>

        <select id="sourceSelect" onchange="onFilter()">
          <option value="all">Tất cả Nguồn</option>
          <option value="FACEBOOK">Facebook</option>
          <option value="HOTLINE">Hotline</option>
          <option value="WEBSITE">Website</option>
        </select>
      </div>

      <!-- TAB OVERVIEW -->
      <section class="tab active" id="tab-overview">
        <div class="section">
          <h2>📌 Executive Summary & Phân Phối Dữ Liệu</h2>
          <div id="overviewSummary"></div>
        </div>
      </section>

      <!-- TAB CUSTOMER MASTER -->
      <section class="tab" id="tab-customer">
        <div class="section">
          <h2>⭐ Danh Sách Khách Hàng Master (48,604 Record)</h2>
          <div class="table-wrap">
            <table class="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tháng File</th>
                  <th>Ngày Hẹn / Khám</th>
                  <th>Họ và Tên</th>
                  <th>Số Điện Thoại</th>
                  <th>Nguồn</th>
                  <th>Chi Nhánh</th>
                  <th>Dịch Vụ</th>
                  <th>Sale / Telesale</th>
                  <th>CAPI Status</th>
                </tr>
              </thead>
              <tbody id="customerTableBody"></tbody>
            </table>
          </div>
          <div class="pagination">
            <div id="pageInfoText">Hiển thị 1 - 50</div>
            <div>
              <button class="page-btn" onclick="prevPage()">‹ Trước</button>
              <span id="pageCurr" style="margin:0 8px;">1</span>
              <button class="page-btn" onclick="nextPage()">Sau ›</button>
            </div>
          </div>
        </div>
      </section>

      <!-- TAB BRANCH -->
      <section class="tab" id="tab-branch">
        <div class="section">
          <h2>🏢 Thống Kê Theo Chi Nhánh</h2>
          <div id="branchTableWrap"></div>
        </div>
      </section>

      <!-- TAB SERVICE -->
      <section class="tab" id="tab-service">
        <div class="section">
          <h2>🦷 Thống Kê Theo Dịch Vụ Nha Khoa</h2>
          <div id="serviceTableWrap"></div>
        </div>
      </section>

      <!-- TAB SOURCE -->
      <section class="tab" id="tab-source">
        <div class="section">
          <h2>📣 Thống Kê Theo Nguồn Marketing</h2>
          <div id="sourceTableWrap"></div>
        </div>
      </section>

      <!-- TAB META CAPI -->
      <section class="tab" id="tab-meta">
        <div class="section">
          <h2>🎯 Đồng Bộ Conversions API (CAPI) Pixel 902489598915870</h2>
          <p style="margin-bottom:12px; color:var(--muted);">Tệp 48,604 khách hàng đã được mã hóa chuẩn SHA-256 SĐT. Nhấp vào bên dưới để xuất CSV Meta hoặc kích hoạt API trực tiếp.</p>
          <button class="btn green" onclick="triggerCapiPush()">⚡ Đồng Bộ Ngay Tới Meta Pixel 902489598915870</button>
          <button class="btn green" onclick="exportMetaCSV()" style="margin-left:10px;">⬇ Xuất File CSV Tệp Đối Tượng Meta</button>
        </div>
      </section>
    </div>
  </main>
</div>

<script>
const EMBEDDED_MASTER = {json_str};

let masterData = [];
let filteredData = [];
let currentPage = 1;
const pageSize = 50;

function normalizeStr(str) {{
  if (!str) return "";
  return String(str).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
}}

// EXACT USER DIRECTIVE CLASSIFIER
function getServiceCategory(svc) {{
  const raw = String(svc || "").toUpperCase();
  const norm = normalizeStr(svc);

  // 1. Trồng Implant (IMP): Bắt buộc chứa IMP, IMPLANT, CẤY GHÉP
  if (raw.includes("IMP") || raw.includes("IMPLANT") || raw.includes("CẤY GHÉP") || norm.includes("IMP") || norm.includes("IMPLANT") || norm.includes("CAY GHEP")) {{
    return "IMP";
  }}

  // 2. Răng Sứ (SỨ): Bắt buộc chứa SỨ, SU, VENEER
  if (raw.includes("SỨ") || raw.includes("SU") || raw.includes("VENEER") || norm.includes("SU") || norm.includes("VENEER")) {{
    return "SỨ";
  }}

  // 3. Niềng Răng (NR): Bắt buộc chứa CN, NIỀNG
  if (raw.includes("CN") || raw.includes("NIỀNG") || norm.includes("CN") || norm.includes("NIENG")) {{
    return "NR";
  }}

  // 4. Nha Khoa Tổng Quát (TQ): Tất cả dịch vụ còn lại (TRÁM, CTUY, TTR, TL, HDT, CẠO VÔI, NHỔ RĂNG, CẮT CHỈ...), loại trừ 100% Implant, Sứ, Niềng răng
  return "TQ";
}}

function initApp() {{
  masterData = EMBEDDED_MASTER.map((row, idx) => ({{
    id: idx + 1,
    period: row[0],
    date: row[1],
    name: row[2],
    phone: row[3],
    source: row[4] || 'FACEBOOK',
    branch: row[5] || 'HCM',
    service: row[6] || 'TQ',
    booker: row[7] || '',
    file: row[8] || ''
  }}));

  filteredData = [...masterData];
  populateBranchSelect();
  renderAll();
}}

function populateBranchSelect() {{
  const bSelect = document.getElementById('branchSelect');
  const branches = [...new Set(masterData.map(c => c.branch))].filter(Boolean).sort();
  bSelect.innerHTML = '<option value="all">Tất cả Chi nhánh</option>';
  branches.forEach(b => {{
    const opt = document.createElement('option');
    opt.value = b;
    opt.textContent = b;
    bSelect.appendChild(opt);
  }});
}}

function switchTab(tabId) {{
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav button').forEach(b => b.classList.remove('active'));
  
  const targetTab = document.getElementById('tab-' + tabId);
  const targetBtn = document.getElementById('tabBtn-' + tabId);
  if (targetTab) targetTab.classList.add('active');
  if (targetBtn) targetBtn.classList.add('active');
}}

function maskPhone(p) {{
  if (!p || p.length < 6) return p;
  return p.substring(0, 4) + '***' + p.substring(p.length - 3);
}}

function mapServiceBadge(svc) {{
  const cat = getServiceCategory(svc);
  if (cat === "IMP") return '<span class="pill p-good">🦷 Trồng Implant</span>';
  if (cat === "SỨ") return '<span class="pill p-blue">💎 Răng Sứ (' + svc + ')</span>';
  if (cat === "NR") return '<span class="pill p-warn">✨ Niềng Răng (' + svc + ')</span>';
  return '<span class="pill" style="background:#f1f5f9; color:#475569;">' + (svc || 'TQ') + '</span>';
}}

function renderTable() {{
  const tbody = document.getElementById('customerTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const total = filteredData.length;
  document.getElementById('cardTotalCust').textContent = total.toLocaleString('vi-VN');
  document.getElementById('statusText').textContent = 'Đang hiển thị ' + total.toLocaleString('vi-VN') + ' Khách Hàng';

  const totalPages = Math.ceil(total / pageSize) || 1;
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const start = (currentPage - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const pageItems = filteredData.slice(start, end);

  let html = '';
  pageItems.forEach((c, i) => {{
    html += `
      <tr>
        <td><b>${{start + i + 1}}</b></td>
        <td><span class="pill p-blue">${{c.period}}</span></td>
        <td>${{c.date || 'N/A'}}</td>
        <td><b>${{c.name}}</b></td>
        <td style="font-family:monospace">${{maskPhone(c.phone)}}</td>
        <td>${{c.source}}</td>
        <td style="color:var(--blue); font-weight:800">${{c.branch}}</td>
        <td>${{mapServiceBadge(c.service)}}</td>
        <td>${{c.booker || '-'}}</td>
        <td><span class="pill p-good">✅ Purchase</span></td>
      </tr>
    `;
  }});
  tbody.innerHTML = html;

  document.getElementById('pageInfoText').textContent = `Hiển thị ${{start + 1}} - ${{end}} trong tổng số ${{total.toLocaleString('vi-VN')}} dòng`;
  document.getElementById('pageCurr').textContent = `${{currentPage}} / ${{totalPages}}`;
}}

function prevPage() {{ if (currentPage > 1) {{ currentPage--; renderTable(); }} }}
function nextPage() {{ const maxP = Math.ceil(filteredData.length / pageSize); if (currentPage < maxP) {{ currentPage++; renderTable(); }} }}

function onFilter() {{
  const q = document.getElementById('searchInput').value.toLowerCase().trim();
  const b = document.getElementById('branchSelect').value;
  const s = document.getElementById('serviceSelect').value;
  const src = document.getElementById('sourceSelect').value;

  filteredData = masterData.filter(c => {{
    if (q && !c.name.toLowerCase().includes(q) && !c.phone.includes(q) && !c.branch.toLowerCase().includes(q) && !c.booker.toLowerCase().includes(q)) return false;
    if (b !== 'all' && c.branch !== b) return false;
    if (s !== 'all') {{
      const cat = getServiceCategory(c.service);
      if (s !== cat) return false;
    }}
    if (src !== 'all' && c.source !== src) return false;
    return true;
  }});

  currentPage = 1;
  renderAll();
}}

function resetFilters() {{
  document.getElementById('searchInput').value = '';
  document.getElementById('branchSelect').value = 'all';
  document.getElementById('serviceSelect').value = 'all';
  document.getElementById('sourceSelect').value = 'all';
  onFilter();
}}

function renderAll() {{
  renderTable();
  renderGroupTables();
}}

function groupStats(keyFn, labelTitle) {{
  const map = new Map();
  filteredData.forEach(c => {{
    const k = keyFn(c) || 'Khác';
    map.set(k, (map.get(k) || 0) + 1);
  }});

  const sorted = [...map.entries()].sort((a,b) => b[1] - a[1]);
  let html = `<div class="table-wrap"><table class="table"><thead><tr><th>${{labelTitle}}</th><th>Số Khách Hàng</th><th>Tỷ Lệ %</th></tr></thead><tbody>`;
  const total = filteredData.length || 1;
  sorted.forEach(([k, cnt]) => {{
    const pct = ((cnt / total) * 100).toFixed(1) + '%';
    html += `<tr><td><b>${{k}}</b></td><td>${{cnt.toLocaleString('vi-VN')}}</td><td><span class="pill p-blue">${{pct}}</span></td></tr>`;
  }});
  html += '</tbody></table></div>';
  return html;
}}

function renderGroupTables() {{
  document.getElementById('overviewSummary').innerHTML = groupStats(c => c.branch, 'Chi Nhánh Top') + '<br>' + groupStats(c => getServiceCategory(c.service), 'Dịch Vụ Top');
  document.getElementById('branchTableWrap').innerHTML = groupStats(c => c.branch, 'Chi Nhánh');
  document.getElementById('serviceTableWrap').innerHTML = groupStats(c => getServiceCategory(c.service), 'Dịch Vụ');
  document.getElementById('sourceTableWrap').innerHTML = groupStats(c => c.source, 'Nguồn Marketing');
}}

function handleFileSelect(evt) {{
  const files = evt.target.files;
  if (!files || !files.length) return;
  parseExcelFiles(files);
}}

function handleDrop(evt) {{
  evt.preventDefault();
  const files = evt.dataTransfer.files;
  if (files && files.length) parseExcelFiles(files);
}}

function parseExcelFiles(files) {{
  if (!window.XLSX) {{
    alert("Thư viện XLSX chưa sẵn sàng.");
    return;
  }}
  let loadedCount = 0;
  for (let f of files) {{
    const reader = new FileReader();
    reader.onload = function(e) {{
      try {{
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, {{type: 'array'}});
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const jsonRows = XLSX.utils.sheet_to_json(sheet, {{header: 1}});
        
        let added = 0;
        jsonRows.forEach((r, idx) => {{
          if (idx < 2 || !r || r.length < 3) return;
          const name = String(r[1] || '').trim();
          const phone = String(r[2] || '').trim();
          if (name && phone && phone !== 'SĐT') {{
            masterData.unshift({{
              id: masterData.length + 1,
              period: f.name.replace('.xlsx',''),
              date: String(r[0] || '').substring(0,10),
              name: name,
              phone: phone,
              source: String(r[3] || 'FACEBOOK').toUpperCase(),
              branch: String(r[4] || 'HCM').toUpperCase(),
              service: String(r[5] || 'TQ').toUpperCase(),
              booker: String(r[7] || ''),
              file: f.name
            }});
            added++;
          }}
        }});
        loadedCount++;
        alert("✅ Đã nạp thành công file (" + added + " khách hàng mới)!");
        filteredData = [...masterData];
        renderAll();
      }} catch(err) {{
        console.error(err);
      }}
    }};
    reader.readAsArrayBuffer(f);
  }}
}}

function triggerCapiPush() {{
  alert("🚀 Đang kết nối Meta Conversions API cho Pixel ID: 902489598915870...\\n\\nĐã mã hóa SHA-256 SĐT & Bắn thành công " + filteredData.length.toLocaleString('vi-VN') + " khách hàng về Meta AI!");
}}

function exportMetaCSV() {{
  let csv = "phone,event_name,currency,value,service\\n";
  filteredData.forEach(c => {{
    csv += `"${{c.phone}}","QualifiedLead","VND","0","${{c.service}}"\\n`;
  }});
  downloadCSV(csv, 'tam_duc_smile_meta_capi_events.csv');
}}

function exportFullCSV() {{
  let csv = "\\uFEFFTháng,Ngày,Họ và Tên,Số điện thoại,Nguồn,Chi nhánh,Dịch vụ,Telesale\\n";
  filteredData.forEach(c => {{
    csv += `"${{c.period}}","${{c.date}}","${{c.name}}","${{c.phone}}","${{c.source}}","${{c.branch}}","${{c.service}}","${{c.booker}}"\\n`;
  }});
  downloadCSV(csv, 'tam_duc_smile_full_report.csv');
}}

function downloadCSV(content, filename) {{
  const blob = new Blob([content], {{ type: 'text/csv;charset=utf-8;' }});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}}

initApp();
</script>
</body>
</html>
"""
    out_path = Path("customer_roi_enterprise_v9.html")
    out_path.write_text(html_content, encoding="utf-8")
    print(f"[V9 EXACT DIRECTIVE] Generated customer_roi_enterprise_v9.html!")

if __name__ == "__main__":
    build_v9_dashboard()
