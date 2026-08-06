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
            if (msg.result && msg.result.tools) {
                const tools = msg.result.tools;
                console.log("ALL TOOL NAMES:", tools.map(t => t.name));
                const ingest = tools.find(t => t.name === 'ingest_html');
                if (ingest) console.log("INGEST_HTML SCHEMA:", JSON.stringify(ingest, null, 2));
                const create = tools.find(t => t.name === 'create_page');
                if (create) console.log("CREATE_PAGE SCHEMA:", JSON.stringify(create, null, 2));
                const addSec = tools.find(t => t.name === 'add_section');
                if (addSec) console.log("ADD_SECTION SCHEMA:", JSON.stringify(addSec, null, 2));
            }
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
    params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'test', version: '1.0' } }
});

setTimeout(() => {
    send({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} });
}, 2000);

setTimeout(() => {
    child.kill();
    process.exit(0);
}, 6000);
