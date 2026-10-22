// Checagem de publicidade (Código de Ética da OAB e Provimento 205/2021).
// Procura termos proibidos em content/site.json e no texto visível do HTML gerado. Falha (exit 1) se encontrar.
// Os acentos são ignorados na comparação. Para acrescentar um termo, inclua uma linha em RULES.
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const RULES = [
  ['Superlativo / autopromoção', /\bmelhor(es)? (advogad|escritori|defesa|equipe|opcao|resultado|atendimento da)/],
  ['Superlativo / autopromoção', /\bo mais (experiente|qualificad|renomad|competente|premiad|requisitad)/],
  ['Superlativo / autopromoção', /\b(lider|numero 1|n[oº°] ?1|#1|imbativel|o maior escritorio|top \d+)\b/],
  ['Comparação com outros escritórios', /\b(diferente dos outros|melhor que|mais barato|outros escritorios)\b/],
  ['Promessa de resultado', /\b(causa ganha|ganhe sua causa|ganhar (a|sua) causa|vitoria garantida)\b/],
  ['Promessa de resultado', /\b(garantia de (exito|sucesso|resultado|vitoria)|(exito|sucesso|resultado|vitoria)s? garantid|garantimos|garanta)/],
  ['Promessa de resultado', /\b(100 ?%|sem risco|resultado certo|certeza de (exito|vitoria|resultado))/],
  ['Preço, promoção ou gratuidade', /\b(consulta (gratis|gratuita)|gratis|gratuit[oa]s?|promocao|promocional|desconto|precos?|parcelamos|r\$ ?\d)/],
  ['Depoimento ou resultado de processos', /\b(depoimentos?|clientes satisfeitos|casos ganhos|processos ganhos|vitorias|causas ganhas|\d+ (casos|processos|clientes))\b/],
  ['CTA apelativo', /\b(garanta seus direitos|ligue ja|nao perca|aproveite|ultimas vagas|agora!)/],
];

const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function strings(obj, trail = []) {
  if (typeof obj === 'string') return [{ where: trail.join('.'), text: obj }];
  if (Array.isArray(obj)) return obj.flatMap((v, i) => strings(v, [...trail, i]));
  if (obj && typeof obj === 'object') return Object.entries(obj).flatMap(([k, v]) => strings(v, [...trail, k]));
  return [];
}

function visibleText(html) {
  return html
    .replace(/<(script|style|svg|template)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ');
}

export async function checkOab() {
  const targets = [];
  const content = JSON.parse(await readFile(path.join(ROOT, 'content/site.json'), 'utf8'));
  for (const s of strings(content)) targets.push({ file: 'content/site.json', where: s.where, text: s.text });
  try {
    for (const f of await readdir(path.join(ROOT, 'dist'))) {
      if (!f.endsWith('.html')) continue;
      const html = await readFile(path.join(ROOT, 'dist', f), 'utf8');
      // Texto visível + templates de mensagens do formulário (também aparecem para o visitante)
      const templates = [...html.matchAll(/<template[^>]*>([\s\S]*?)<\/template>/gi)].map((m) => m[1]).join(' ');
      targets.push({ file: `dist/${f}`, where: 'texto visível', text: visibleText(html) + ' ' + visibleText(templates) });
      const attrs = [...html.matchAll(/\b(?:alt|title|aria-label|content)="([^"]*)"/g)].map((m) => m[1]).join(' · ');
      targets.push({ file: `dist/${f}`, where: 'atributos', text: attrs });
    }
  } catch { /* sem dist/ ainda: checa só o conteúdo */ }

  const hits = [];
  for (const t of targets) {
    const n = norm(t.text);
    for (const [label, re] of RULES) {
      const m = n.match(re);
      if (m) {
        const at = Math.max(0, m.index - 40);
        hits.push(`  ✗ ${label}: "${m[0]}" em ${t.file} (${t.where})\n      …${n.slice(at, m.index + m[0].length + 40).trim()}…`);
      }
    }
  }
  return hits;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const hits = await checkOab();
  if (hits.length) {
    console.error(`check-oab: ${hits.length} ocorrência(s) proibida(s) pelas regras da OAB:\n${hits.join('\n')}`);
    process.exit(1);
  }
  console.log('check-oab: nenhum termo proibido encontrado.');
}
