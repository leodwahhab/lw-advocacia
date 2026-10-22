// Pipeline de imagens com sharp: variantes AVIF/WebP/JPEG para srcset, logo recortado e favicons.
import sharp from 'sharp';
import { mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { escapeHtml } from './template.mjs';

const WIDTHS = [480, 800, 1200];

async function isFresh(src, out) {
  try { return (await stat(out)).mtimeMs >= (await stat(src)).mtimeMs; } catch { return false; }
}

async function emit(pipeline, out, src, fmt) {
  if (await isFresh(src, out)) return;
  const p = pipeline.clone();
  if (fmt === 'avif') await p.avif({ quality: 50, effort: 4 }).toFile(out);
  else if (fmt === 'webp') await p.webp({ quality: 72 }).toFile(out);
  else await p.jpeg({ quality: 78, mozjpeg: true, progressive: true }).toFile(out);
}

// Gera as variantes de uma foto e devolve o HTML do <picture>.
export async function picture(root, outDir, src, { alt, sizes, priority = false, widths = WIDTHS }) {
  // O CMS grava caminhos com barra inicial (/assets/uploads/...): sempre relativos à raiz do projeto
  const abs = path.join(root, src.replace(/^\/+/, ''));
  const meta = await sharp(abs).metadata();
  const base = path.basename(src, path.extname(src)).toLowerCase().replace(/[^a-z0-9-]+/g, '-');
  const ws = widths.filter((w) => w < meta.width);
  ws.push(Math.min(meta.width, widths.at(-1)));
  const uniq = [...new Set(ws)];
  await mkdir(path.join(outDir, 'img'), { recursive: true });
  const srcset = { avif: [], webp: [], jpg: [] };
  for (const w of uniq) {
    const pipe = sharp(abs).rotate().resize({ width: w, withoutEnlargement: true });
    for (const fmt of Object.keys(srcset)) {
      const name = `img/${base}-${w}.${fmt}`;
      await emit(pipe, path.join(outDir, name), abs, fmt);
      srcset[fmt].push(`${name} ${w}w`);
    }
  }
  const h = Math.round((meta.height / meta.width) * uniq.at(-1));
  const fallback = `img/${base}-${uniq.at(-1)}.jpg`;
  const load = priority ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"';
  return `<picture><source type="image/avif" srcset="${srcset.avif.join(', ')}" sizes="${sizes}">` +
    `<source type="image/webp" srcset="${srcset.webp.join(', ')}" sizes="${sizes}">` +
    `<img src="${fallback}" srcset="${srcset.jpg.join(', ')}" sizes="${sizes}" width="${uniq.at(-1)}" height="${h}" alt="${escapeHtml(alt)}" ${load}></picture>`;
}

// Logo horizontal: recorta a área útil + 16px de folga (x 236–1132, y 212–556), como no design system.
const LOGO_CROP = { left: 236, top: 212, width: 896, height: 344 };
// Emblema: quadrado x/y 232–792.
const EMBLEM_CROP = { left: 232, top: 232, width: 560, height: 560 };

export async function logo(root, outDir, src) {
  const abs = path.join(root, src);
  await mkdir(path.join(outDir, 'img'), { recursive: true });
  const widths = [250, 375];
  const set = { avif: [], webp: [], jpg: [] };
  for (const w of widths) {
    const pipe = sharp(abs).extract(LOGO_CROP).resize({ width: w });
    for (const fmt of Object.keys(set)) {
      const name = `img/logo-${w}.${fmt}`;
      await emit(pipe, path.join(outDir, name), abs, fmt);
      set[fmt].push(`${name} ${w}w`);
    }
  }
  return (sizes, lazy) =>
    `<picture><source type="image/avif" srcset="${set.avif.join(', ')}" sizes="${sizes}">` +
    `<source type="image/webp" srcset="${set.webp.join(', ')}" sizes="${sizes}">` +
    `<img src="img/logo-250.jpg" srcset="${set.jpg.join(', ')}" sizes="${sizes}" width="896" height="344" alt=""${lazy ? ' loading="lazy"' : ''} decoding="async"></picture>`;
}

// Favicons e ícones do manifest a partir do emblema; imagem de compartilhamento (Open Graph) com o logo.
export async function icons(root, outDir, emblemSrc, logoSrc, siteName) {
  const emblem = path.join(root, emblemSrc);
  const crop = () => sharp(emblem).extract(EMBLEM_CROP);
  const png32 = await crop().resize(32, 32).png().toBuffer();
  await writeFile(path.join(outDir, 'favicon.ico'), icoFromPng(png32, 32));
  await crop().resize(180, 180).png().toFile(path.join(outDir, 'apple-touch-icon.png'));
  await crop().resize(192, 192).png().toFile(path.join(outDir, 'icon-192.png'));
  await crop().resize(512, 512).png().toFile(path.join(outDir, 'icon-512.png'));
  await writeFile(path.join(outDir, 'manifest.webmanifest'), JSON.stringify({
    name: siteName, short_name: siteName, start_url: './', display: 'browser',
    background_color: '#172639', theme_color: '#172639',
    icons: [
      { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }, null, 2));

  const logoBuf = await sharp(path.join(root, logoSrc)).extract(LOGO_CROP).resize({ width: 820 }).toBuffer();
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#172639' } })
    .composite([{ input: logoBuf, gravity: 'center' }])
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(path.join(outDir, 'og-image.jpg'));
}

// ICO com um único PNG embutido (formato aceito por todos os navegadores atuais).
function icoFromPng(png, size) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
  header.writeUInt8(size, 6); header.writeUInt8(size, 7); header.writeUInt8(0, 8); header.writeUInt8(0, 9);
  header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14); header.writeUInt32LE(22, 18);
  return Buffer.concat([header, png]);
}
