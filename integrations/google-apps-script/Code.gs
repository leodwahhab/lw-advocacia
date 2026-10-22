/**
 * LW Advocacia: recebe o formulário do site, grava na planilha e avisa o escritório por e-mail.
 *
 * Como instalar: veja docs/configurar-formulario.md (passo a passo sem programação).
 * Este script deve ser criado DENTRO da planilha (Extensões > Apps Script), assim ele grava nela.
 *
 * Aceita dois formatos:
 *  - JSON em text/plain (envio pelo JavaScript da página): responde JSON { ok: true } ou { ok: false, error }.
 *  - Formulário comum (navegador sem JavaScript): responde uma página simples de confirmação.
 */

// ── Configuração: edite só este bloco ─────────────────────────────────────────
var CONFIG = {
  EMAIL_DESTINO: 'contato@seu-dominio.com.br',  // quem recebe o aviso de novo contato
  NOME_ABA: 'Contatos',                         // aba da planilha onde as linhas são gravadas
  ASSUNTO: 'Novo contato pelo site: ',          // o nome da pessoa é acrescentado ao final
  SITE_URL: 'https://seu-dominio.com.br/',      // para o link "voltar ao site" no envio sem JavaScript
  WHATSAPP_URL: 'https://wa.me/5500000000000',
  LIMITE_POR_HORA: 5                            // envios por e-mail/telefone por hora (antispam simples)
};
// ──────────────────────────────────────────────────────────────────────────────

var COLUNAS = [
  'Data/hora', 'Nome', 'Telefone', 'E-mail', 'Descrição do caso', 'Consentimento',
  'Data do consentimento', 'Versão da política', 'Origem (página)',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'
];

function doPost(e) {
  var semJs = !!(e && e.postData && /x-www-form-urlencoded|multipart/.test(e.postData.type));
  try {
    var d = lerDados_(e);

    // Honeypot preenchido = robô. Responde "ok" para não dar pistas, mas não grava.
    if (d.website) return responder_(semJs, true);

    var erro = validar_(d);
    if (erro) return responder_(semJs, false, erro);

    if (excedeuLimite_(d)) return responder_(semJs, false, 'limite');

    gravar_(d);
    avisar_(d);
    return responder_(semJs, true);
  } catch (err) {
    console.error(err);
    return responder_(semJs, false, 'erro_interno');
  }
}

// Abrir a URL do Web App no navegador mostra se ele está no ar.
function doGet() {
  return ContentService.createTextOutput(JSON.stringify({ ok: true, servico: 'formulario-lw-advocacia' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function lerDados_(e) {
  var p = {};
  if (e && e.postData && e.postData.contents && !/x-www-form-urlencoded|multipart/.test(e.postData.type)) {
    p = JSON.parse(e.postData.contents);
  } else if (e && e.parameter) {
    p = e.parameter;
  }
  var txt = function (k, max) { return String(p[k] == null ? '' : p[k]).trim().slice(0, max || 200); };
  return {
    nome: txt('nome', 120),
    telefone: txt('telefone', 20),
    email: txt('email', 160).toLowerCase(),
    descricao: txt('descricao', 2000),
    consentimento: p.consentimento === true || p.consentimento === 'sim' || p.consentimento === 'on',
    consentimento_data: txt('consentimento_data', 40) || new Date().toISOString(),
    politica_versao: txt('politica_versao', 40),
    origem: txt('origem', 500),
    utm_source: txt('utm_source'), utm_medium: txt('utm_medium'), utm_campaign: txt('utm_campaign'),
    utm_term: txt('utm_term'), utm_content: txt('utm_content'),
    website: txt('website')
  };
}

function validar_(d) {
  if (d.nome.length < 2) return 'nome';
  var digitos = d.telefone.replace(/\D/g, '');
  if (digitos.length < 10 || digitos.length > 11) return 'telefone';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) return 'email';
  if (d.descricao.length < 10) return 'descricao';
  if (!d.consentimento) return 'consentimento';
  return '';
}

// Antispam simples: no máximo N envios por hora para o mesmo e-mail ou telefone.
function excedeuLimite_(d) {
  var cache = CacheService.getScriptCache();
  var chave = 'k_' + Utilities.base64EncodeWebSafe(d.email + '|' + d.telefone.replace(/\D/g, '')).slice(0, 200);
  var n = Number(cache.get(chave) || 0);
  if (n >= CONFIG.LIMITE_POR_HORA) return true;
  cache.put(chave, String(n + 1), 3600);
  return false;
}

function gravar_(d) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var planilha = SpreadsheetApp.getActiveSpreadsheet();
    var aba = planilha.getSheetByName(CONFIG.NOME_ABA) || planilha.insertSheet(CONFIG.NOME_ABA);
    if (aba.getLastRow() === 0) {
      aba.appendRow(COLUNAS);
      aba.setFrozenRows(1);
      aba.getRange(1, 1, 1, COLUNAS.length).setFontWeight('bold');
    }
    aba.appendRow([
      new Date(), d.nome, d.telefone, d.email, d.descricao, d.consentimento ? 'Sim' : 'Não',
      d.consentimento_data, d.politica_versao, d.origem,
      d.utm_source, d.utm_medium, d.utm_campaign, d.utm_term, d.utm_content
    ].map(seguro_));
  } finally {
    lock.releaseLock();
  }
}

// Impede que um texto começando com = + - @ vire fórmula na planilha.
function seguro_(v) {
  return typeof v === 'string' && /^[=+\-@]/.test(v) ? "'" + v : v;
}

function avisar_(d) {
  var esc = function (s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };
  var linhas = [
    ['Nome', d.nome], ['Telefone', d.telefone], ['E-mail', d.email], ['Descrição', d.descricao],
    ['Consentimento LGPD', (d.consentimento ? 'Sim' : 'Não') + ' (' + d.consentimento_data + ', política ' + d.politica_versao + ')'],
    ['Origem', d.origem], ['Campanha', [d.utm_source, d.utm_medium, d.utm_campaign].filter(String).join(' / ') || '(direto)']
  ];
  var html = '<p>Novo contato recebido pelo site:</p><table cellpadding="6" style="border-collapse:collapse">' +
    linhas.map(function (l) {
      return '<tr><td style="color:#5c564b;vertical-align:top"><b>' + l[0] + '</b></td><td style="white-space:pre-wrap">' + esc(l[1]) + '</td></tr>';
    }).join('') + '</table><p style="color:#5c564b">Responda este e-mail para falar direto com a pessoa.</p>';
  MailApp.sendEmail({
    to: CONFIG.EMAIL_DESTINO,
    replyTo: d.email,
    subject: CONFIG.ASSUNTO + d.nome,
    htmlBody: html,
    body: linhas.map(function (l) { return l[0] + ': ' + l[1]; }).join('\n')
  });
}

function responder_(semJs, ok, erro) {
  if (!semJs) {
    return ContentService.createTextOutput(JSON.stringify(ok ? { ok: true } : { ok: false, error: erro }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  var msg = ok
    ? '<h1>Mensagem enviada.</h1><p>Obrigado pelo contato. O escritório vai retornar em breve, em horário comercial.</p>'
    : '<h1>Não foi possível enviar.</h1><p>Confira se todos os campos foram preenchidos e se a caixa de consentimento foi marcada. ' +
      'Se preferir, <a href="' + CONFIG.WHATSAPP_URL + '">fale com o escritório pelo WhatsApp</a>.</p>';
  return HtmlService.createHtmlOutput(
    '<div style="font-family:system-ui,sans-serif;max-width:36rem;margin:3rem auto;padding:0 1rem;color:#172639">' + msg +
    '<p><a href="' + CONFIG.SITE_URL + '">Voltar ao site</a></p></div>'
  ).setTitle('LW Advocacia');
}

// Rode esta função uma vez pelo editor (botão "Executar") para autorizar planilha e e-mail e testar.
function testar() {
  var r = doPost({ postData: { type: 'text/plain', contents: JSON.stringify({
    nome: 'Teste do site', telefone: '(11) 91234-5678', email: CONFIG.EMAIL_DESTINO,
    descricao: 'Mensagem de teste enviada pelo editor do Apps Script.', consentimento: true,
    politica_versao: 'teste', origem: 'editor'
  }) } });
  console.log(r.getContent());
}
