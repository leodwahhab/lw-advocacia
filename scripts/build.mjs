// Build da landing: content/site.json + src/ → dist/
// Uso: node scripts/build.mjs   (ou npm run build, que também roda o check-oab)
import { readFile, writeFile, mkdir, cp, rm, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderTemplate, escapeHtml } from './lib/template.mjs';
import { picture, logo, icons } from './lib/images.mjs';
import { sprite } from './lib/icons.mjs';
import { writeDocs } from './lib/docs.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const LOGO = 'assets/lw-advocacia-logo-wordmark.jpg';
const EMBLEM = 'assets/lw-advocacia-emblema.jpg';

// Seções do components.css que vão inline (acima da dobra e elementos fixos).
const CRITICAL = ['Base', 'Tipografia', 'Layout', 'Eyebrow', 'Botões', 'Logo', 'Header', 'Hero', 'Botão flutuante', 'Banner de cookies', 'Movimento reduzido'];

const read = (p) => readFile(path.join(ROOT, p), 'utf8');
const hash = (s) => createHash('sha256').update(s).digest('hex').slice(0, 8);

function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,>])\s*/g, '$1')
    .replace(/:\s+/g, ':')
    .replace(/;}/g, '}')
    .trim();
}

// Minificação conservadora: só remove comentários de linha inteira e indentação (não toca em strings ou regex).
function minifyJs(js) {
  return js
    .replace(/^\s*\/\*[\s\S]*?\*\/\s*$/gm, '')
    .replace(/^\s*\/\/.*$/gm, '')
    .split('\n').map((l) => l.trim()).filter(Boolean).join('\n') + '\n';
}
// Divide um CSS nas seções marcadas com "/* ── Nome ───".
function sections(css) {
  const parts = css.split(/(?=\/\* ── )/);
  return parts.map((body) => {
    const m = body.match(/^\/\* ── ([^─*]+)/);
    return { name: m ? m[1].trim() : '', body };
  });
}

function splitCss(tokens, components, site) {
  const crit = [tokens], rest = [];
  for (const s of [...sections(components), ...sections(site)]) {
    const isCrit = !s.name || s.name.includes('[crítico]') || CRITICAL.some((c) => s.name.startsWith(c));
    (isCrit ? crit : rest).push(s.body);
    // O movimento reduzido precisa vir DEPOIS de todas as regras que ele desliga. Como parte delas
    // (cards, FAQ, formulário) está no CSS não crítico, a seção é repetida no fim do arquivo externo.
    if (s.name.startsWith('Movimento reduzido')) rest.push(s.body);
  }
  return {
    critical: minifyCss(crit.join('\n')).replace(/\.\.\/fonts\//g, 'fonts/'),
    rest: minifyCss(rest.join('\n')),
  };
}

// Consent Mode v2: padrões "denied" antes de qualquer tag; escolha salva é reaplicada antes do GTM carregar.
// O GTM em si é injetado pelo main.js depois da primeira interação (ver docs/configurar-gtm.md).
function trackingHead(gtmId) {
  const js = `window.__lw={gtm:${JSON.stringify(gtmId)}};window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}` +
    `gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});` +
    `gtag('set','ads_data_redaction',true);` +
    `try{var c=JSON.parse(localStorage.getItem('lw_consent'));if(c&&c.v===1&&Date.now()-Date.parse(c.ts)<31536e6){` +
    `var a=c.analytics?'granted':'denied',m=c.marketing?'granted':'denied';` +
    `gtag('consent','update',{analytics_storage:a,ad_storage:m,ad_user_data:m,ad_personalization:m});` +
    `dataLayer.push({event:'consent_update',consent_analytics:!!c.analytics,consent_marketing:!!c.marketing})}}catch(e){}`;
  return `<script>${js.replace(/</g, '\u003c')}</script>`;
}

function inlineEm(text) {
  return escapeHtml(text).replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

function jsonLd(c) {
  const e = c.contato.endereco;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: c.site.nome,
    url: `${c.site.url}/`,
    image: `${c.site.url}/og-image.jpg`,
    logo: `${c.site.url}/icon-512.png`,
    description: c.seo.descricao,
    telephone: c.contato.telefoneLink,
    email: c.contato.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: e.logradouro, addressLocality: e.cidade, addressRegion: e.uf,
      postalCode: e.cep, addressCountry: 'BR',
    },
    areaServed: e.cidade,
    knowsAbout: c.areas.itens.map((a) => a.titulo),
    openingHoursSpecification: [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: c.contato.horarioAbre, closes: c.contato.horarioFecha,
    }],
    employee: {
      '@type': 'Person',
      name: c.advogado.nome,
      jobTitle: c.advogado.cargo,
      identifier: c.advogado.oab,
    },
    sameAs: c.redes.map((r) => r.url),
  };
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

async function loadPartials() {
  const dir = path.join(SRC, 'partials');
  const out = {};
  for (const f of await readdir(dir)) {
    if (f.endsWith('.html')) out[path.basename(f, '.html')] = await readFile(path.join(dir, f), 'utf8');
  }
  return out;
}

export async function build() {
  const t0 = Date.now();
  const content = JSON.parse(await read('content/site.json'));

  // dist/ é recriado, mas a pasta de imagens é mantida como cache (o sharp é o passo mais lento).
  await mkdir(DIST, { recursive: true });
  for (const f of await readdir(DIST)) if (f !== 'img') await rm(path.join(DIST, f), { recursive: true, force: true });

  // CSS: crítico inline, restante em arquivo com hash
  const css = splitCss(await read('src/css/tokens.css'), await read('src/css/components.css'), await read('src/css/site.css'));
  const cssHref = `css/site.${hash(css.rest)}.css`;
  await mkdir(path.join(DIST, 'css'), { recursive: true });
  await writeFile(path.join(DIST, cssHref), css.rest);

  // JS
  const js = minifyJs(await read('src/js/main.js'));
  const jsHref = `js/main.${hash(js)}.js`;
  await mkdir(path.join(DIST, 'js'), { recursive: true });
  await writeFile(path.join(DIST, jsHref), js);

  // Painel do CMS (Decap)
  await cp(path.join(SRC, 'admin'), path.join(DIST, 'admin'), { recursive: true });

  // Fontes
  await cp(path.join(SRC, 'fonts'), path.join(DIST, 'fonts'), { recursive: true });

  // Imagens
  const logoHtml = await logo(ROOT, DIST, LOGO);
  await icons(ROOT, DIST, EMBLEM, LOGO, content.site.nome);
  const imgHero = await picture(ROOT, DIST, content.hero.foto, {
    alt: content.hero.fotoAlt, priority: true, sizes: '(min-width: 1200px) 460px, (min-width: 960px) 38vw, calc(100vw - 32px)',
  });
  const imgSobre = await picture(ROOT, DIST, content.advogado.foto, {
    alt: content.advogado.fotoAlt, sizes: '(min-width: 30rem) 28rem, calc(100vw - 32px)',
  });

  const msg = encodeURIComponent(content.contato.whatsappMensagem);
  const build = {
    criticalCss: css.critical,
    cssHref, jsHref,
    tracking: trackingHead(content.site.gtmId),
    jsonLd: jsonLd(content),
    logoHeader: logoHtml('(min-width: 960px) 125px, 104px', false),
    logoFooter: logoHtml('146px', true),
    imgHero, imgSobre,
    heroTitulo: inlineEm(content.hero.titulo),
    whatsappUrl: `https://wa.me/${content.contato.whatsapp.replace(/\D/g, '')}?text=${msg}`,
    telUrl: `tel:${content.contato.telefoneLink.replace(/[^\d+]/g, '')}`,
    ano: new Date().getFullYear(),
  };

  const partials = await loadPartials();
  const pages = [
    { src: 'src/template.html', out: 'index.html', page: { home: true, base: '', titulo: content.seo.titulo, descricao: content.seo.descricao, canonical: `${content.site.url}/` } },
    { src: 'src/politica.html', out: 'politica-de-privacidade.html', page: { home: false, base: './', titulo: content.seo.tituloPolitica, descricao: content.seo.descricaoPolitica, canonical: `${content.site.url}/politica-de-privacidade.html` } },
  ];
  for (const p of pages) {
    let html = renderTemplate(await read(p.src), { ...content, build, page: p.page }, partials);
    html = html.replace('<!--SPRITE-->', sprite(html));
    await writeFile(path.join(DIST, p.out), html);
  }

  // Cabeçalhos de cache e segurança para Netlify / Cloudflare Pages (outras hospedagens: docs/publicacao.md)
  await writeFile(path.join(DIST, '_headers'), [
    '/*', '  X-Content-Type-Options: nosniff', '  Referrer-Policy: strict-origin-when-cross-origin', '  X-Frame-Options: SAMEORIGIN', '',
    '/css/*', '  Cache-Control: public, max-age=31536000, immutable', '',
    '/js/*', '  Cache-Control: public, max-age=31536000, immutable', '',
    '/img/*', '  Cache-Control: public, max-age=31536000, immutable', '',
    '/fonts/*', '  Cache-Control: public, max-age=31536000, immutable', '',
    '/admin/*', '  X-Robots-Tag: noindex', '',
  ].join('\n'));

  // SEO: robots e sitemap (domínio placeholder até a publicação)
  const today = new Date().toISOString().slice(0, 10);
  await writeFile(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${content.site.url}/sitemap.xml\n`);
  await writeFile(path.join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    pages.map((p) => `  <url><loc>${escapeHtml(p.page.canonical)}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
    `\n</urlset>\n`);

  // Documentos de revisão sempre em sincronia com o conteúdo
  await writeDocs(ROOT, content);

  const kb = (s) => (Buffer.byteLength(s) / 1024).toFixed(1);
  console.log(`Build ok em ${Date.now() - t0} ms · CSS crítico ${kb(css.critical)} KB · CSS restante ${kb(css.rest)} KB · JS ${kb(js)} KB`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  build().catch((err) => { console.error('Build falhou:', err.message); process.exit(1); });
}
