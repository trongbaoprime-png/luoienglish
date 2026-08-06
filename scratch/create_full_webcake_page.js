const { spawn } = require('child_process');
const fs = require('fs');

const authPath = 'C:\\Users\\AD\\.webcake-landing-mcp\\auth.json';
let jwt = '';
if (fs.existsSync(authPath)) {
    const auth = JSON.parse(fs.readFileSync(authPath, 'utf8'));
    jwt = auth.jwt;
}

const child = spawn('cmd.exe', ['/c', 'npx', '-y', 'webcake-landing-mcp'], {
    env: { ...process.env, WEBCAKE_ENV: 'prod', WEBCAKE_JWT: jwt },
    stdio: ['pipe', 'pipe', 'inherit']
});

let buffer = '';

child.stdout.on('data', (chunk) => {
    buffer += chunk.toString();
    const lines = buffer.split('\n');
    buffer = lines.pop();

    for (const line of lines) {
        if (!line.trim()) continue;
        try {
            const msg = JSON.parse(line);
            console.log("RESPONSE:", JSON.stringify(msg, null, 2));
        } catch (e) {
            console.log("RAW STDOUT:", line);
        }
    }
});

function send(msg) {
    child.stdin.write(JSON.stringify(msg) + '\n');
}

// Helper to build section with html-box
function createSectionNode(secId, boxId, name, htmlContent, desktopHeight, mobileHeight) {
    return {
        id: secId,
        type: 'section',
        specials: {
            imageCompression: true
        },
        responsive: {
            desktop: {
                styles: {
                    position: 'relative',
                    height: desktopHeight,
                    background: '#ffffff'
                }
            },
            mobile: {
                styles: {
                    position: 'relative',
                    height: mobileHeight,
                    background: '#ffffff'
                }
            }
        },
        properties: {
            name: name
        },
        children: [
            {
                id: boxId,
                type: 'html-box',
                specials: {
                    html: htmlContent
                },
                responsive: {
                    desktop: {
                        styles: {
                            top: 0,
                            left: 0,
                            width: 960,
                            height: desktopHeight
                        }
                    },
                    mobile: {
                        styles: {
                            top: 0,
                            left: 0,
                            width: 420,
                            height: mobileHeight
                        }
                    }
                },
                properties: {
                    name: 'Mã HTML ' + name
                }
            }
        ]
    };
}

const sectionHeaderHTML = `<header style="background-color: #00509d; color: #fff; padding: 12px 0;">
  <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; align-items: center; justify-content: space-between;">
    <a href="#" style="display: flex; align-items: center; gap: 10px; text-decoration: none; color: #fff;">
      <div style="width: 40px; height: 40px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; color: #00509d;">🦷</div>
      <div>
        <span style="font-size: 18px; font-weight: 800; text-transform: uppercase;">NHA KHOA IMPLANT</span>
        <span style="font-size: 11px; display: block; color: #93c5fd;">Chuyên Khoa Cấy Ghép Răng</span>
      </div>
    </a>
    <div style="display: flex; align-items: center; gap: 15px;">
      <a href="tel:0900000000" style="color: #fde047; text-decoration: none; font-weight: 700; font-size: 16px;">📞 0900 000 000</a>
      <a href="#dangkytuvan" style="background: #10b981; color: #fff; padding: 10px 20px; border-radius: 30px; text-decoration: none; font-weight: 700; font-size: 14px;">Tư vấn ngay</a>
    </div>
  </div>
</header>`;

const sectionHeroHTML = `<section style="background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%); padding: 40px 0;">
  <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
    <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 30px; align-items: center;">
      <div style="background: linear-gradient(145deg, #003566, #001d3d); border-radius: 16px; padding: 35px; color: #fff; box-shadow: 0 10px 25px rgba(0,0,0,0.15);">
        <span style="background: rgba(245, 158, 11, 0.2); color: #f59e0b; border: 1px solid #f59e0b; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 700;">★ CÔNG NGHỆ CHÂU ÂU KHÔNG ĐAU</span>
        <h1 style="font-size: 26px; font-weight: 800; margin: 15px 0 10px 0; line-height: 1.3;">TRỒNG RĂNG IMPLANT CHUẨN Y KHOA — KHÔNG ĐAU — BẢO HÀNH TRỌN ĐỜI</h1>
        <p style="font-size: 14px; color: #93c5fd; margin-bottom: 20px;">Phục hồi khả năng ăn nhai 99%. Đội ngũ Thạc sĩ - Bác sĩ trên 15 năm kinh nghiệm.</p>
        <div style="background: rgba(255,255,255,0.1); border: 2px dashed rgba(255,255,255,0.3); border-radius: 10px; padding: 30px; text-align: center; color: #e0f2fe; font-size: 14px;">
            📷 [Hình ảnh phòng khám / Nụ cười khách hàng]
        </div>
      </div>
      <div id="dangkytuvan" style="background: #fff; border-radius: 16px; padding: 30px; box-shadow: 0 20px 40px rgba(0,0,0,0.08);">
        <h2 style="text-align: center; font-size: 20px; font-weight: 800; color: #f59e0b; margin-bottom: 15px;">ĐĂNG KÝ TƯ VẤN NHẬN ƯU ĐÃI</h2>
        <form onsubmit="alert('Đã gửi thông tin! Bác sĩ sẽ gọi điện tư vấn ngay.'); return false;">
          <div style="margin-bottom: 12px;">
            <label style="font-size: 13px; font-weight: 600;">Họ và tên *</label>
            <input type="text" placeholder="Nhập họ và tên" required style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:6px; margin-top:4px;">
          </div>
          <div style="margin-bottom: 12px;">
            <label style="font-size: 13px; font-weight: 600;">Số điện thoại *</label>
            <input type="tel" placeholder="Nhập số điện thoại" required style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:6px; margin-top:4px;">
          </div>
          <div style="margin-bottom: 15px;">
            <label style="font-size: 13px; font-weight: 600;">Tình trạng răng *</label>
            <select required style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:6px; margin-top:4px;">
              <option value="">-- Chọn tình trạng --</option>
              <option value="1">Mất 1 răng</option>
              <option value="2">Mất nhiều răng</option>
              <option value="3">Mất răng toàn hàm</option>
            </select>
          </div>
          <button type="submit" style="width:100%; background: linear-gradient(135deg, #f59e0b, #d97706); color:#fff; border:none; padding:14px; border-radius:8px; font-weight:800; font-size:16px; cursor:pointer;">ĐĂNG KÝ NGAY</button>
          <p style="text-align:center; font-size:12px; color:#64748b; margin-top:8px;">* Số lượng ưu đãi giới hạn theo tuần</p>
        </form>
      </div>
    </div>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 25px;">
      <div style="background:#fff; border-radius:10px; padding:12px; text-align:center; border-top:4px solid #f59e0b; box-shadow: 0 4px 10px rgba(0,0,0,0.04);">
        <span style="background:#fef3c7; color:#92400e; font-size:11px; font-weight:800; padding:2px 8px; border-radius:4px;">ƯU ĐÃI</span>
        <div style="font-size:13px; font-weight:700; margin-top:4px;">Trả góp 0% lãi suất</div>
      </div>
      <div style="background:#fff; border-radius:10px; padding:12px; text-align:center; border-top:4px solid #00509d; box-shadow: 0 4px 10px rgba(0,0,0,0.04);">
        <span style="background:#dbeafe; color:#1e40af; font-size:11px; font-weight:800; padding:2px 8px; border-radius:4px;">MIỄN PHÍ</span>
        <div style="font-size:13px; font-weight:700; margin-top:4px;">Chụp phim CT Cone Beam 3D</div>
      </div>
      <div style="background:#fff; border-radius:10px; padding:12px; text-align:center; border-top:4px solid #10b981; box-shadow: 0 4px 10px rgba(0,0,0,0.04);">
        <span style="background:#d1fae5; color:#065f46; font-size:11px; font-weight:800; padding:2px 8px; border-radius:4px;">TẶNG KÈM</span>
        <div style="font-size:13px; font-weight:700; margin-top:4px;">Bộ chăm sóc răng miệng cao cấp</div>
      </div>
    </div>
  </div>
</section>`;

const sectionWarningHTML = `<section style="background-color: #ffffff; padding: 50px 0;">
  <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
    <div style="text-align: center; max-width: 800px; margin: 0 auto 30px auto;">
      <span style="color: #f59e0b; font-size: 13px; font-weight: 800; text-transform: uppercase;">ĐỪNG ĐỂ VIỆC MẤT RĂNG KÉO DÀI</span>
      <h2 style="font-size: 24px; font-weight: 800; color: #00509d; margin: 8px 0;">Trì hoãn càng lâu, điều trị càng phức tạp, chi phí càng cao</h2>
      <p style="font-size: 14px; color: #64748b;">Nhiều khách hàng hiểu nên trồng lại răng sớm nhưng vẫn trì hoãn vì còn nhiều băn khoăn:</p>
    </div>
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
      <div style="background: #fff5f5; border-left: 4px solid #ef4444; border-radius: 8px; padding: 15px; display: flex; gap: 12px;">
        <span style="font-size: 20px;">❌</span>
        <div>
          <h3 style="font-size: 15px; font-weight: 700; color: #991b1b; margin: 0 0 4px 0;">Sợ đau trong quá trình cấy ghép</h3>
          <p style="font-size: 13px; color: #4b5563; margin: 0;">Lo lắng phẫu thuật gây đau đớn, ảnh hưởng công việc hàng ngày.</p>
        </div>
      </div>
      <div style="background: #fff5f5; border-left: 4px solid #ef4444; border-radius: 8px; padding: 15px; display: flex; gap: 12px;">
        <span style="font-size: 20px;">❌</span>
        <div>
          <h3 style="font-size: 15px; font-weight: 700; color: #991b1b; margin: 0 0 4px 0;">E ngại chi phí quá đắt đỏ</h3>
          <p style="font-size: 13px; color: #4b5563; margin: 0;">Lo sợ chi phí phát sinh hoặc thiếu chính sách trả góp phù hợp.</p>
        </div>
      </div>
    </div>
  </div>
</section>`;

const sectionPricingHTML = `<section style="background-color: #f8fafc; padding: 50px 0;">
  <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h2 style="font-size: 24px; font-weight: 800; color: #00509d;">Bảng Giá Trồng Răng Implant Ưu Đãi</h2>
      <p style="font-size: 14px; color: #64748b;">Trọn gói bao gồm Trụ Implant + Abutment + Răng sứ cao cấp</p>
    </div>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
      <div style="background: #fff; border-radius: 12px; padding: 25px; text-align: center; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <h3 style="font-size: 18px; font-weight: 800; color: #00509d;">Implant Hàn Quốc</h3>
        <div style="font-size: 24px; font-weight: 800; color: #f59e0b; margin: 10px 0;">12.500.000đ</div>
        <p style="font-size: 13px; color: #64748b; line-height: 1.8;">✓ Trụ chính hãng Hàn Quốc<br>✓ Tích hợp xương 2-3 tháng<br>✓ Bảo hành 10 năm</p>
      </div>
      <div style="background: #fff; border-radius: 12px; padding: 25px; text-align: center; border: 2px solid #f59e0b; box-shadow: 0 8px 20px rgba(245, 158, 11, 0.15);">
        <span style="background: #f59e0b; color: #fff; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 10px; text-transform: uppercase;">Phổ biến nhất</span>
        <h3 style="font-size: 18px; font-weight: 800; color: #00509d; margin-top: 5px;">Implant Mỹ (Dentium)</h3>
        <div style="font-size: 24px; font-weight: 800; color: #f59e0b; margin: 10px 0;">16.800.000đ</div>
        <p style="font-size: 13px; color: #64748b; line-height: 1.8;">✓ Tiêu chuẩn Hoa Kỳ<br>✓ Trả góp 0% lãi suất<br>✓ Bảo hành 20 năm</p>
      </div>
      <div style="background: #fff; border-radius: 12px; padding: 25px; text-align: center; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <h3 style="font-size: 18px; font-weight: 800; color: #00509d;">Implant Thụy Sĩ</h3>
        <div style="font-size: 24px; font-weight: 800; color: #f59e0b; margin: 10px 0;">24.500.000đ</div>
        <p style="font-size: 13px; color: #64748b; line-height: 1.8;">✓ Dòng trụ cao cấp thế giới<br>✓ Tích hợp xương siêu tốc 3 tuần<br>✓ Bảo hành TRỌN ĐỜI</p>
      </div>
    </div>
  </div>
</section>`;

const sectionFooterHTML = `<footer style="background-color: #00296b; color: #ffffff; padding: 35px 0 15px 0;">
  <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
    <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 30px; font-size: 13px;">
      <div>
        <h4 style="color: #fde047; font-size: 15px; margin-bottom: 10px;">NHA KHOA IMPLANT CHUYÊN SÂU</h4>
        <p style="color: #cbd5e1; line-height: 1.6;">Chuyên cấy ghép Implant & Phục hình răng sứ thẩm mỹ. Đem lại nụ cười tự tin và khả năng ăn nhai hoàn hảo.</p>
      </div>
      <div>
        <h4 style="color: #fde047; font-size: 15px; margin-bottom: 10px;">GIỜ LÀM VIỆC</h4>
        <p style="color: #cbd5e1;">Thứ 2 - Chủ Nhật<br>8:00 - 20:00 (Không nghỉ trưa)</p>
      </div>
      <div>
        <h4 style="color: #fde047; font-size: 15px; margin-bottom: 10px;">HOTLINE</h4>
        <p style="font-size: 18px; font-weight: 700; color: #fde047;">📞 0900 000 000</p>
      </div>
    </div>
    <div style="text-align: center; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 20px; padding-top: 15px; color: #94a3b8; font-size: 12px;">
      © 2026 Nha Khoa Implant. Tất cả quyền được bảo lưu.
    </div>
  </div>
</footer>`;

const pageSource = {
    page: [
        createSectionNode("sec_header", "box_header", "Header Section", sectionHeaderHTML, 80, 100),
        createSectionNode("sec_hero", "box_hero", "Hero & Form Section", sectionHeroHTML, 620, 950),
        createSectionNode("sec_warning", "box_warning", "Cảnh Báo Section", sectionWarningHTML, 400, 550),
        createSectionNode("sec_pricing", "box_pricing", "Bảng Giá Section", sectionPricingHTML, 550, 900),
        createSectionNode("sec_footer", "box_footer", "Footer Section", sectionFooterHTML, 200, 300)
    ],
    popup: [],
    settings: {
        title: "Nha Khoa Implant - Trồng Răng Không Đau",
        description: "Trung tâm trồng răng Implant chuyên sâu",
        fontGeneral: "'Montserrat', sans-serif",
        width_section: { desktop: 960, mobile: 420 },
        country: "84",
        currency: "VND"
    },
    options: { mobileOnly: false }
};

send({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'antigravity', version: '1.0' } } });

setTimeout(() => {
    send({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
            name: 'create_page',
            arguments: {
                name: 'Nha Khoa Implant - Trồng Răng Không Đau (Từng Khối Độc Lập)',
                organization_id: 97737,
                dry_run: false,
                publish: true,
                source: pageSource
            }
        }
    });
}, 2000);

setTimeout(() => { child.kill(); process.exit(0); }, 15000);
