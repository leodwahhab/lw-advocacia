// Gera docs/copy-para-revisao.md (todos os textos em ordem de leitura) e a seção automática de docs/pendencias.md.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const q = (s) => `> ${String(s).replace(/\n/g, '\n> ')}`;

export function copyDoc(c) {
  const L = [];
  const h = (t) => L.push('', `## ${t}`, '');
  const f = (label, v) => L.push(`**${label}**`, '', q(v), '');
  L.push('# Copy para revisão', '', 'Gerado automaticamente pelo build a partir de `content/site.json`. Não edite aqui: edite pelo painel (CMS) ou no `site.json`.', '',
    'Palavras entre `*asteriscos*` no título do hero aparecem em itálico. Itens entre `[colchetes]` são placeholders (lista em `pendencias.md`).');
  h('SEO (aparece no Google e no compartilhamento)');
  f('Título da página', c.seo.titulo); f('Descrição', c.seo.descricao);
  h('Header');
  f('Menu', c.header.nav.map((n) => n.rotulo).join(' · ')); f('Botão', c.header.cta);
  h('1. Hero');
  f('Eyebrow', c.hero.eyebrow); f('Título (h1)', c.hero.titulo); f('Subtítulo', c.hero.subtitulo);
  f('Botão principal (WhatsApp)', c.hero.ctaPrimario); f('Botão secundário (telefone)', c.hero.ctaSecundario);
  f('Linha de identificação', `${c.advogado.nome} · ${c.advogado.oab}`);
  f('Mensagem pré-preenchida do WhatsApp', c.contato.whatsappMensagem);
  h('2. Áreas de atuação');
  f('Eyebrow', c.areas.eyebrow); f('Título', c.areas.titulo); f('Introdução', c.areas.lead); f('Link dos cards', c.areas.linkRotulo);
  for (const a of c.areas.itens) f(a.titulo, a.descricao);
  h('3. Sobre');
  f('Eyebrow', c.sobre.eyebrow); f('Título', c.sobre.titulo); f('Nome', c.advogado.nome); f('Formação', c.advogado.formacao);
  f('Selo', `${c.sobre.seloRotulo}: ${c.advogado.oab}`); f('Texto', c.sobre.texto);
  f('Diferenciais', c.sobre.diferenciais.map((d) => `- ${d}`).join('\n'));
  h('4. Como funciona');
  f('Eyebrow', c.comoFunciona.eyebrow); f('Título', c.comoFunciona.titulo); f('Introdução', c.comoFunciona.lead);
  c.comoFunciona.passos.forEach((p, i) => f(`Passo ${i + 1}: ${p.titulo}`, p.texto));
  h('5. Perguntas frequentes');
  f('Eyebrow', c.faq.eyebrow); f('Título', c.faq.titulo);
  for (const x of c.faq.itens) f(x.pergunta, x.resposta);
  h('6. Contato e formulário');
  const fm = c.contatoSecao.form;
  f('Eyebrow', c.contatoSecao.eyebrow); f('Título', c.contatoSecao.titulo); f('Introdução', c.contatoSecao.lead);
  f('Botão WhatsApp', c.contatoSecao.ctaWhatsapp);
  f('Campos', [fm.nome, fm.telefone, fm.email, fm.caso].join(' · ')); f('Dica do campo de descrição', fm.casoDica);
  f('Consentimento', `${fm.consentimento} ${c.rodape.politicaRotulo}.`); f('Botão de envio', `${fm.botao} / ${fm.botaoEnviando}`);
  f('Erros dos campos', [fm.erroNome, fm.erroTelefone, fm.erroEmail, fm.erroCaso, fm.erroConsentimento].map((e) => `- ${e}`).join('\n'));
  f('Sucesso', `${fm.sucessoTitulo} ${fm.sucessoTexto}`); f('Erro no envio', `${fm.erroTitulo} ${fm.erroTexto}`); f('Sem JavaScript', fm.semJs);
  h('7. Rodapé');
  f('Aviso da OAB', c.rodape.avisoOab);
  f('Contato', [c.contato.endereco.logradouro, `${c.contato.endereco.bairro} · ${c.contato.endereco.cidade}/${c.contato.endereco.uf} · ${c.contato.endereco.cep}`, c.contato.telefone, c.contato.email, c.contato.horario].join('\n'));
  h('8. Aviso de cookies');
  const k = c.cookies;
  f('Texto', `${k.texto} ${c.rodape.politicaRotulo}.`); f('Botões', [k.aceitar, k.recusar, k.preferencias, k.salvar].join(' · '));
  f('Categorias', [`${k.necessariosTitulo}: ${k.necessariosTexto}`, `${k.estatisticaTitulo}: ${k.estatisticaTexto}`, `${k.marketingTitulo}: ${k.marketingTexto}`].map((x) => `- ${x}`).join('\n'));
  h('9. Política de Privacidade (revisão jurídica obrigatória)');
  f('Aviso', c.privacidade.aviso);
  for (const s of c.privacidade.secoes) f(s.titulo, [...s.paragrafos, ...s.itens.map((i) => `- ${i}`)].join('\n'));
  return L.join('\n') + '\n';
}

function placeholders(obj, trail = [], out = new Map()) {
  if (typeof obj === 'string') {
    for (const m of obj.matchAll(/\[[^\]]+\]/g)) {
      if (!out.has(m[0])) out.set(m[0], []);
      out.get(m[0]).push(trail.join('.'));
    }
  } else if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) placeholders(v, [...trail, k], out);
  }
  return out;
}

const START = '<!-- placeholders:inicio -->';
const END = '<!-- placeholders:fim -->';

export async function writeDocs(root, content) {
  await writeFile(path.join(root, 'docs/copy-para-revisao.md'), copyDoc(content));
  // Na pendencias.md, só o trecho entre os marcadores é reescrito; o resto é editado à mão.
  const file = path.join(root, 'docs/pendencias.md');
  let md;
  try { md = await readFile(file, 'utf8'); } catch { return; }
  if (!md.includes(START)) return;
  const rows = [...placeholders(content)].map(([ph, where]) => `| \`${ph}\` | ${[...new Set(where.map((w) => w.split('.').slice(0, 2).join('.')))].join(', ')} |`);
  const table = `${START}\n| Placeholder | Onde aparece (campo no site.json) |\n| --- | --- |\n${rows.join('\n')}\n${END}`;
  await writeFile(file, md.replace(new RegExp(`${START}[\\s\\S]*?${END}`), table));
}
