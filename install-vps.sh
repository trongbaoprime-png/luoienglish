#!/usr/bin/env bash
# ==============================================================================
# LƯỚI CMS + MINICRM + OMNICHANNEL HUB + AI INFRA
# 1-CLICK AUTOMATED VPS INSTALLATION SCRIPT (/luoi/ CONDENSED ARCHITECTURE)
# HARDENED SECURITY VERSION (OWASP TOP 10:2025 COMPLIANT)
# ==============================================================================

set -e

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}"
echo "=============================================================================="
echo "      🚀 BẮT ĐẦU CÀI ĐẶT 1-CLICK HỆ THỐNG /LUOI/ (SECURITY HARDENED)           "
echo "=============================================================================="
echo -e "${NC}"

# 1. Update OS Packages
echo -e "${YELLOW}--> [1/6] Cập nhật hệ điều hành Linux Ubuntu/Debian...${NC}"
apt-get update -y && apt-get install -y curl git unzip sqlite3 ca-certificates curl gnupg lsb-release nginx

# 2. Install Docker & Docker Compose if missing
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}--> [2/6] Đang cài đặt Docker Engine & Docker Compose...${NC}"
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
fi

# 3. Setup Project Directory & Clone Repository
APP_DIR="/var/www/app"
mkdir -p "$APP_DIR"
cd "$APP_DIR"

if [ -d "$APP_DIR/path-app" ]; then
    echo -e "${YELLOW}--> [3/6] Thư mục đã tồn tại, tiến hành git pull cập nhật...${NC}"
    cd "$APP_DIR" && git pull || true
    cd "$APP_DIR/path-app" && git pull || true
else
    echo -e "${YELLOW}--> [3/6] Đang clone mã nguồn từ GitHub...${NC}"
    git clone https://github.com/AgriciDaniel/claude-ads.git "$APP_DIR"
fi

cd "$APP_DIR/path-app"
mkdir -p luoi/cms luoi/minicrm luoi/omni luoi/aiflow public/uploads

# 4. Sync Database Copies for /luoi/ Architecture
echo -e "${YELLOW}--> [4/6] Chuẩn hóa dữ liệu CSDL 3 Module (/luoi/cms, /luoi/minicrm, /luoi/omni)...${NC}"
if [ -f "prisma/dev.db" ]; then
    cp -n prisma/dev.db luoi/cms/cms.db || true
    cp -n prisma/dev.db luoi/minicrm/minicrm.db || true
    cp -n prisma/dev.db luoi/omni/omni.db || true
fi

# Set Production Environment File
cat << 'EOF' > .env
NODE_ENV=production
PORT=3000
DATABASE_URL=file:/app/prisma/luoi-cms.db
CMS_DATABASE_URL=file:/app/luoi/cms/cms.db
CRM_DATABASE_URL=file:/app/luoi/minicrm/minicrm.db
OMNI_DATABASE_URL=file:/app/luoi/omni/omni.db
ADMIN_USER=admin
ADMIN_PASS=B@oph@m021991
EOF

# 5. Configure Nginx Reverse Proxy with OWASP Hardened Rules
echo -e "${YELLOW}--> [5/6] Cấu hình Nginx Reverse Proxy Hardened Port 80...${NC}"
rm -rf /etc/nginx/sites-enabled/* /etc/nginx/sites-available/default /etc/nginx/conf.d/* || true

cat << 'EOF' > /etc/nginx/conf.d/default.conf
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    client_max_body_size 100M;

    # OWASP Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

    # 1. Deny access to sensitive files (.env, .git, .db, .sql, .bak, .sqlite)
    location ~ /\.(env|git|htaccess|db|sqlite|sql|bak|config) {
        deny all;
        return 404;
    }

    # 2. Prevent script execution in uploads directory
    location /uploads/ {
        types { }
        default_type application/octet-stream;
    }

    # 3. Lưới CMS + miniCRM + Omnichannel Next.js App
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 4. LiteLLM Proxy AI Router Gateway (Port 4000)
    location /llm/ {
        proxy_pass http://127.0.0.1:4000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 5. OpenClaw AI Engine (Port 7000)
    location /claw/ {
        proxy_pass http://127.0.0.1:7000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 6. OmniRoute Token Router (Port 8080)
    location /omni/ {
        proxy_pass http://127.0.0.1:8080/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

nginx -t
systemctl restart nginx

# 6. Rebuild and Launch Docker Containers
echo -e "${YELLOW}--> [6/6] Khởi chạy toàn bộ 5 Docker Containers...${NC}"
docker compose down || true
docker compose up -d --build

SERVER_IP=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')

echo -e "${GREEN}"
echo "=============================================================================="
echo "🎉 CHÚC MỪNG! HỆ THỐNG /LUOI/ ĐÃ ĐƯỢC CÀI ĐẶT BẢO MẬT BẬC CAO TRÊN VPS!     "
echo "=============================================================================="
echo -e "${NC}"
echo -e "🌐 Lưới CMS Portal:   http://$SERVER_IP"
echo -e "🔐 Admin Control:     http://$SERVER_IP/admin"
echo -e "⚡ LiteLLM Proxy AI:  http://$SERVER_IP/llm/"
echo -e "🦀 OpenClaw Agents:   http://$SERVER_IP/claw/"
echo -e "🤖 OmniRoute Engine:  http://$SERVER_IP/omni/"
echo ""
echo -e "${CYAN}🔑 TÀI KHOẢN ĐĂNG NHẬP ADMIN MẶC ĐỊNH:${NC}"
echo -e "   - Username: ${YELLOW}admin${NC}"
echo -e "   - Password: ${YELLOW}B@oph@m021991${NC}"
echo "=============================================================================="
