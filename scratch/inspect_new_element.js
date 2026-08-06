const { spawn } = require('child_process');

const child = spawn('cmd.exe', ['/c', 'npx', '-y', 'webcake-landing-mcp'], {
    env: { ...process.env, WEBCAKE_ENV: 'prod' },
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
                const newElem = tools.find(t => t.name === 'new_element');
                console.log("NEW_ELEMENT SCHEMA:", JSON.stringify(newElem, null, 2));
            }
        } catch (e) {}
    }
});

function send(msg) {
    child.stdin.write(JSON.stringify(msg) + '\n');
}

send({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'test', version: '1.0' } } });
setTimeout(() => send({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} }), 1000);
setTimeout(() => { child.kill(); process.exit(0); }, 4000);
