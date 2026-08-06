const { spawn } = require('child_process');
const fs = require('fs');

const authPath = 'C:\\Users\\AD\\.webcake-landing-mcp\\auth.json';
let jwt = '';
if (fs.existsSync(authPath)) {
    const auth = JSON.parse(fs.readFileSync(authPath, 'utf8'));
    jwt = auth.jwt;
}

console.log("Using JWT from auth.json:", jwt.substring(0, 30) + "...");

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
            console.log("RECEIVED FROM MCP:", JSON.stringify(msg, null, 2));
        } catch (e) {
            console.log("RAW STDOUT:", line);
        }
    }
});

function send(msg) {
    console.log("SENDING TO MCP:", JSON.stringify(msg));
    child.stdin.write(JSON.stringify(msg) + '\n');
}

// 1. Initialize
send({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test-client', version: '1.0.0' }
    }
});

setTimeout(() => {
    // 2. List tools
    send({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/list',
        params: {}
    });
}, 2000);

setTimeout(() => {
    child.kill();
    process.exit(0);
}, 6000);
