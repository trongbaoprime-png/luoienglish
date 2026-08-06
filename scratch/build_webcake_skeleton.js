const { spawn } = require('child_process');
const fs = require('fs');

const authPath = 'C:\\Users\\AD\\.webcake-landing-mcp\\auth.json';
let jwt = '';
if (fs.existsSync(authPath)) {
    const auth = JSON.parse(fs.readFileSync(authPath, 'utf8'));
    jwt = auth.jwt;
}

const htmlContent = fs.readFileSync('d:\\AI\\ClaudeCode\\implant_landing_page_webcake.html', 'utf8');

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
            console.log("MCP MSG:", JSON.stringify(msg, null, 2));
        } catch (e) {
            console.log("RAW STDOUT:", line);
        }
    }
});

function send(msg) {
    child.stdin.write(JSON.stringify(msg) + '\n');
}

send({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'antigravity', version: '1.0' } }
});

setTimeout(() => {
    // 1. Call new_page_skeleton
    send({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
            name: 'new_page_skeleton',
            arguments: {
                roles: ['header', 'form', 'features', 'pricing', 'footer']
            }
        }
    });
}, 2000);

setTimeout(() => {
    child.kill();
    process.exit(0);
}, 10000);
