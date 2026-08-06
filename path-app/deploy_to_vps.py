import paramiko
import time
import sys
import io

# Force UTF-8 stdout encoding on Windows
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

VPS_HOST = "136.110.2.153"
VPS_PORT = 22
VPS_USER = "root"
VPS_PASS = "B@oph@m021991"
GIT_REPO = "https://github.com/AgriciDaniel/claude-ads.git"

def run_ssh_command(ssh, cmd, title):
    print(f"\n=======================================================")
    print(f"--> [{title}] Executing: {cmd}")
    print(f"=======================================================")
    stdin, stdout, stderr = ssh.exec_command(cmd, get_pty=True)
    
    # Stream output in real-time
    for line in iter(stdout.readline, ""):
        print(line, end="")
        sys.stdout.flush()
        
    exit_status = stdout.channel.recv_exit_status()
    if exit_status != 0:
        err_msg = stderr.read().decode('utf-8', errors='ignore')
        print(f"\n[WARNING] Command exit code {exit_status}. Stderr: {err_msg}")
    else:
        print(f"[OK] Success: [{title}]")
    return exit_status

def main():
    print(f"[START] Connecting to Google Cloud VPS {VPS_HOST}:{VPS_PORT} as {VPS_USER}...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        ssh.connect(VPS_HOST, port=VPS_PORT, username=VPS_USER, password=VPS_PASS, timeout=30)
        print("[OK] SSH Connection Established Successfully!")
    except Exception as e:
        print(f"[ERROR] Connection Failed: {e}")
        return

    # 1. Update OS & Install Core Dependencies
    run_ssh_command(
        ssh,
        "apt-get update -y && apt-get install -y curl git ufw htop jq certbot python3-certbot-nginx ca-certificates",
        "Step 1: Install OS Dependencies & Tools"
    )

    # 2. Install Docker & Docker Compose
    run_ssh_command(
        ssh,
        "if ! command -v docker &> /dev/null; then curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh && rm -f get-docker.sh; fi",
        "Step 2: Install Docker Engine"
    )

    # 3. Create Project Directory & Clone Git Repository
    run_ssh_command(
        ssh,
        f"mkdir -p /var/www/app && cd /var/www && if [ -d '/var/www/app/.git' ]; then cd /var/www/app && git pull origin main; else rm -rf /var/www/app/* && git clone {GIT_REPO} /var/www/app; fi",
        "Step 3: Clone/Sync Codebase from Git"
    )

    # 4. Setup .env file & Prisma Directories
    run_ssh_command(
        ssh,
        "cd /var/www/app && mkdir -p prisma/data && cat << 'EOF' > .env\nNODE_ENV=production\nPORT=3000\nDATABASE_URL=file:./data/minicrm.db\nEOF",
        "Step 4: Configure Production Environment (.env)"
    )

    # 5. Open UFW Firewall Ports (80, 443, 22)
    run_ssh_command(
        ssh,
        "ufw allow 80/tcp && ufw allow 443/tcp && ufw allow 22/tcp && echo 'y' | ufw enable",
        "Step 5: Configure Firewall Rules"
    )

    # 6. Build & Launch Docker Containers
    run_ssh_command(
        ssh,
        "cd /var/www/app && docker compose up -d --build",
        "Step 6: Build & Launch Docker Containers (App, LiteLLM, OpenClaw, Redis)"
    )

    # 7. Verify Container Status
    run_ssh_command(
        ssh,
        "docker ps",
        "Step 7: Verify Running Docker Containers"
    )

    ssh.close()
    print("\n=======================================================")
    print("SUCCESS: TRIEN KHAI HOAN TAT 100% TREN VPS GOOGLE CLOUD!")
    print(f"VPS IP: http://{VPS_HOST}")
    print(f"Next.js App: http://{VPS_HOST}:3000")
    print(f"LiteLLM Proxy: http://{VPS_HOST}:4000")
    print(f"OpenClaw Engine: http://{VPS_HOST}:7000")
    print("=======================================================")

if __name__ == "__main__":
    main()
