// Mini motor de templates, sem dependências.
//   {{caminho}}            texto escapado
//   {{{caminho}}}          HTML cru (só para valores gerados pelo build)
//   {{#each lista}}…{{/each}}   dentro: campos do item, {{this}}, {{@index}}, {{@num}}
//   {{#if caminho}}…{{else}}…{{/if}}
//   {{> parcial}}          inclui src/partials/parcial.html
// Caminhos procuram do escopo mais interno para o mais externo.

const TAG = /\{\{\{\s*([\w.@]+)\s*\}\}\}|\{\{\s*([#/>]?)\s*(else|[\w.@-]+)?\s*([\w.@-]*)\s*\}\}/g;

export function escapeHtml(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function tokenize(src) {
  const out = [];
  let last = 0, m;
  TAG.lastIndex = 0;
  while ((m = TAG.exec(src))) {
    if (m.index > last) out.push({ t: 'text', v: src.slice(last, m.index) });
    if (m[1]) out.push({ t: 'raw', v: m[1] });
    else if (m[2] === '#') out.push({ t: 'open', kind: m[3], v: m[4] });
    else if (m[2] === '/') out.push({ t: 'close', kind: m[3] });
    else if (m[2] === '>') out.push({ t: 'partial', v: m[3] });
    else if (m[3] === 'else') out.push({ t: 'else' });
    else out.push({ t: 'var', v: m[3] });
    last = TAG.lastIndex;
  }
  if (last < src.length) out.push({ t: 'text', v: src.slice(last) });
  return out;
}

function parse(tokens, i = 0, closing = null) {
  const nodes = [];
  while (i < tokens.length) {
    const tk = tokens[i];
    if (tk.t === 'close') {
      if (tk.kind !== closing) throw new Error(`Template: {{/${tk.kind}}} inesperado`);
      return [nodes, i + 1, false];
    }
    if (tk.t === 'else' && closing === 'if') return [nodes, i + 1, true];
    if (tk.t === 'open') {
      const [body, j, hasElse] = parse(tokens, i + 1, tk.kind);
      let alt = [], k = j;
      if (hasElse) [alt, k] = parse(tokens, j, tk.kind);
      nodes.push({ t: tk.kind, v: tk.v, body, alt });
      i = k;
      continue;
    }
    nodes.push(tk);
    i++;
  }
  if (closing) throw new Error(`Template: falta {{/${closing}}}`);
  return [nodes, i];
}

function lookup(scopes, path) {
  if (path === 'this') return scopes[0] && '@index' in scopes[0] ? scopes[1] : scopes[0];
  for (const s of scopes) {
    if (s === null || typeof s !== 'object') continue;
    const [head, ...rest] = path.split('.');
    if (!(head in s)) continue;
    return rest.reduce((o, k) => (o == null ? undefined : o[k]), s[head]);
  }
  return undefined;
}

function truthy(v) { return Array.isArray(v) ? v.length > 0 : Boolean(v); }

function render(nodes, scopes, partials) {
  let out = '';
  for (const n of nodes) {
    if (n.t === 'text') out += n.v;
    else if (n.t === 'var') {
      const v = lookup(scopes, n.v);
      if (v === undefined) throw new Error(`Template: "${n.v}" não existe no conteúdo`);
      out += escapeHtml(v);
    } else if (n.t === 'raw') out += lookup(scopes, n.v) ?? '';
    else if (n.t === 'partial') {
      if (!(n.v in partials)) throw new Error(`Template: parcial "${n.v}" não encontrado`);
      out += render(parse(tokenize(partials[n.v]))[0], scopes, partials);
    } else if (n.t === 'each') {
      const list = lookup(scopes, n.v) || [];
      list.forEach((item, idx) => {
        out += render(n.body, [{ '@index': idx, '@num': idx + 1 }, item, ...scopes], partials);
      });
    } else if (n.t === 'if') {
      out += render(truthy(lookup(scopes, n.v)) ? n.body : n.alt, scopes, partials);
    }
  }
  return out;
}

export function renderTemplate(src, data, partials = {}) {
  return render(parse(tokenize(src))[0], [data], partials);
}
