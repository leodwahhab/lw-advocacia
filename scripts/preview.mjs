// npm run preview: serve dist/ como uma hospedagem de produção (compressão + cache), para medir com o Lighthouse.
// Os mesmos cabeçalhos estão em dist/_headers (Netlify/Cloudflare Pages); veja docs/publicacao.md.
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { brotliCompressSync, gzipSync, constants } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const PORT = Number(process.env.PORT) || 4173;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.yml': 'text/yaml; charset=utf-8', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json', '.ico': 'image/x-icon', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.svg': 'image/svg+xml',
};
const COMPRESSIBLE = /\.(html|css|js|json|yml|xml|txt|webmanifest|svg)$/;

function cacheFor(url) {
  if (/\.[0-9a-f]{8}\.(css|js)$/.test(url) || url.startsWith('/img/') || url.startsWith('/fonts/')) return 'public, max-age=31536000, immutable';
  if (url.endsWith('.html')) return 'public, max-age=0, must-revalidate';
  return 'public, max-age=86400';
}

http.createServer(async (req, res) => {
  let url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (url.endsWith('/')) url += 'index.html';
  const file = path.join(DIST, path.normalize(url));
  if (!file.startsWith(DIST)) { res.writeHead(403).end(); return; }
  try {
    if ((await stat(file)).isDirectory()) { res.writeHead(301, { Location: url + '/' }).end(); return; }
    let body = await readFile(file);
    const headers = {
      'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream',
      'Cache-Control': cacheFor(url),
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      Vary: 'Accept-Encoding',
    };
    const accept = req.headers['accept-encoding'] || '';
    if (COMPRESSIBLE.test(file)) {
      if (accept.includes('br')) { body = brotliCompressSync(body, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } }); headers['Content-Encoding'] = 'br'; }
      else if (accept.includes('gzip')) { body = gzipSync(body, { level: 9 }); headers['Content-Encoding'] = 'gzip'; }
    }
    res.writeHead(200, headers).end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Não encontrado');
  }
}).listen(PORT, () => console.log(`Preview de produção: http://localhost:${PORT}/`));
