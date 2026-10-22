// npm run dev: build + watch + servidor estático (http://localhost:8080) + decap-server (CMS local).
import http from 'node:http';
import { watch } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const PORT = Number(process.env.PORT) || 8080;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.yml': 'text/yaml; charset=utf-8', '.svg': 'image/svg+xml', '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json', '.ico': 'image/x-icon',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.woff2': 'font/woff2',
};

// Build num processo novo a cada vez: mudanças em scripts/ valem sem reiniciar o servidor.
function run(script) {
  return new Promise((resolve) => {
    spawn(process.execPath, [path.join(ROOT, script)], { stdio: 'inherit' }).on('close', resolve);
  });
}
let building = false, again = false;
async function runBuild() {
  if (building) { again = true; return; }
  building = true;
  if ((await run('scripts/build.mjs')) === 0) await run('scripts/check-oab.mjs');
  building = false;
  if (again) { again = false; runBuild(); }
}

await runBuild();

// Rebuild com debounce ao salvar conteúdo, template, CSS, JS ou imagens (inclusive pelo CMS).
let timer;
for (const dir of ['content', 'src', 'assets', 'scripts']) {
  watch(path.join(ROOT, dir), { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(runBuild, 150);
  });
}

http.createServer(async (req, res) => {
  let url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (url.endsWith('/')) url += 'index.html';
  // Prévia de imagens enviadas pelo CMS (ainda não processadas pelo build)
  const base = url.startsWith('/assets/') ? ROOT : DIST;
  const file = path.join(base, path.normalize(url));
  if (!file.startsWith(base)) { res.writeHead(403).end(); return; }
  try {
    if ((await stat(file)).isDirectory()) { res.writeHead(301, { Location: url + '/' }).end(); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Não encontrado');
  }
}).listen(PORT, () => {
  console.log(`\n  Site:  http://localhost:${PORT}/`);
  console.log(`  CMS:   http://localhost:${PORT}/admin/\n`);
});

if (!process.env.NO_CMS) {
  // decap-server local: o painel grava direto em content/ e assets/uploads/
  const cms = spawn(process.execPath, [path.join(ROOT, 'node_modules/decap-server/dist/index.js')], { cwd: ROOT, stdio: 'inherit' });
  process.on('exit', () => cms.kill());
}
