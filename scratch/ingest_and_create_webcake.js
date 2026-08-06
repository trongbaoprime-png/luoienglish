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
let step = 0;

child.stdout.on('data', (chunk) => {
    buffer += chunk.toString();
    const lines = buffer.split('\n');
    buffer = lines.pop();

    for (const line of lines) {
        if (!line.trim()) continue;
        try {
            const msg = JSON.parse(line);
            console.log(`[STEP ${step}] RESPONSE:`, JSON.stringify(msg, null, 2));

            if (msg.id === 2 && msg.result) {
                // Ingest HTML response
                let resultObj = msg.result;
                if (msg.result.content && msg.result.content[0] && msg.result.content[0].text) {
                    resultObj = JSON.parse(msg.result.content[0].text);
                }
                
                console.log("INGESTED OBJECT KEYS:", Object.keys(resultObj));
                const source = resultObj.source || resultObj;

                // Step 2: Create Page with ingested source
                step = 2;
                send({
                    jsonrpc: '2.0',
                    id: 3,
                    method: 'tools/call',
                    params: {
                        name: 'create_page',
                        arguments: {
                            name: 'Nha Khoa Implant - Trồng Răng Không Đau (Khối Độc Lập)',
                            organization_id: 97737,
                            dry_run: false,
                            publish: true,
                            source: source
                        }
                    }
                });
            } else if (msg.id === 3) {
                console.log("FINAL CREATE PAGE RESPONSE:", JSON.stringify(msg, null, 2));
            }
        } catch (e) {
            console.log("RAW STDOUT:", line);
        }
    }
});

function send(msg) {
    child.stdin.write(JSON.stringify(msg) + '\n');
}

// Step 0: Init
send({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'antigravity', version: '1.0' } }
});

setTimeout(() => {
    step = 1;
    // Step 1: Ingest HTML
    send({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
            name: 'ingest_html',
            arguments: {
                html: htmlContent
            }
        }
    });
}, 2000);

setTimeout(() => {
    child.kill();
    process.exit(0);
}, 20000);
