// Minimal CDP client over Node's global WebSocket. No deps.
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const SHELL = process.env.CHROME_SHELL
  || '/Users/belkofski/Library/Caches/ms-playwright/chromium_headless_shell-1217/chrome-headless-shell-mac-arm64/chrome-headless-shell';

export async function launch({ port = 9333, width = 1440, height = 900 } = {}) {
  const proc = spawn(SHELL, [
    `--remote-debugging-port=${port}`,
    `--window-size=${width},${height}`,
    '--headless=new',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--user-data-dir=/tmp/cdp-clone-profile-' + port,
    'about:blank',
  ], { stdio: ['ignore', 'pipe', 'pipe'] });
  proc.stderr.on('data', () => {});
  let json = null;
  for (let i = 0; i < 100; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/json/version`);
      json = await r.json();
      break;
    } catch { await sleep(150); }
  }
  if (!json) { proc.kill('SIGKILL'); throw new Error('chrome did not start'); }
  return { proc, port, wsUrl: json.webSocketDebuggerUrl };
}

export class Session {
  constructor(ws) { this.ws = ws; this.id = 0; this.pending = new Map(); this.events = new Map(); this.sessionId = null; }
  static async connect(wsUrl) {
    const ws = new WebSocket(wsUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
    const s = new Session(ws);
    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && s.pending.has(msg.id)) {
        const { res, rej } = s.pending.get(msg.id); s.pending.delete(msg.id);
        msg.error ? rej(new Error(JSON.stringify(msg.error))) : res(msg.result);
      } else if (msg.method) {
        const hs = s.events.get(msg.method) || []; hs.forEach(h => h(msg.params));
      }
    };
    return s;
  }
  on(method, h) { const a = this.events.get(method) || []; a.push(h); this.events.set(method, a); }
  send(method, params = {}, sessionId = this.sessionId) {
    const id = ++this.id;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    return new Promise((res, rej) => { this.pending.set(id, { res, rej }); this.ws.send(JSON.stringify(payload)); });
  }
  async attachToPage() {
    const { targetInfos } = await this.send('Target.getTargets', {}, null);
    const page = targetInfos.find(t => t.type === 'page');
    const { sessionId } = await this.send('Target.attachToTarget', { targetId: page.targetId, flatten: true }, null);
    this.sessionId = sessionId;
    return sessionId;
  }
  async eval(expression, { awaitPromise = true, returnByValue = true } = {}) {
    const r = await this.send('Runtime.evaluate', { expression, awaitPromise, returnByValue, allowUnsafeEvalBlockedByCSP: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || JSON.stringify(r.exceptionDetails));
    return r.result.value;
  }
  close() { try { this.ws.close(); } catch {} }
}
