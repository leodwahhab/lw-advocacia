/* LW Advocacia — main.js (vanilla, sem dependências). A página funciona sem ele; aqui só há melhorias. */
(function () {
  'use strict';
  var doc = document;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Microinteração 1: revelação do título, palavra por palavra, uma vez */
  $$('.reveal').forEach(function (el) {
    if (reduced) { el.classList.add('is-ready'); return; }
    var i = 0;
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    (function wrap(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var f = doc.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { f.appendChild(doc.createTextNode(part)); return; }
            var s = doc.createElement('span');
            s.className = 'w'; s.setAttribute('aria-hidden', 'true');
            s.style.setProperty('--i', i++); s.textContent = part;
            f.appendChild(s);
          });
          node.replaceChild(f, child);
        } else if (child.nodeType === 1) { wrap(child); }
      });
    })(el);
    requestAnimationFrame(function () { el.classList.add('is-ready'); });
  });

  /* Header: filete depois de 8px de rolagem */
  var header = $('[data-header]');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    requestAnimationFrame(onScroll); // ler scrollY já na carga forçaria um layout síncrono
  }

  /* Botão flutuante: pulso único após 6 s (microinteração 5) e saída enquanto o formulário está na tela */
  var fab = $('.fab');
  if (fab) {
    if (!reduced) setTimeout(function () { fab.classList.add('is-pulsing'); }, 6000);
    var formEl = $('[data-form]');
    if (formEl && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        fab.classList.toggle('is-hidden', entries[0].isIntersecting);
      }, { rootMargin: '0px 0px -10% 0px' }).observe(formEl);
    }
  }

  /* Mapa por fachada: o iframe do Google Maps só carrega no clique */
  $$('[data-map]').forEach(function (slot) {
    var link = $('[data-map-open]', slot);
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var frame = doc.createElement('iframe');
      frame.src = slot.getAttribute('data-map');
      frame.title = slot.getAttribute('data-map-title');
      frame.loading = 'lazy';
      frame.referrerPolicy = 'no-referrer-when-downgrade';
      frame.setAttribute('allowfullscreen', '');
      slot.textContent = '';
      slot.appendChild(frame);
      slot.classList.add('is-loaded');
    });
  });

  /* ── Rastreamento: só dataLayer. GA4 e Meta Pixel são configurados dentro do GTM. ── */
  var dl = window.dataLayer = window.dataLayer || [];
  function track(event, params) {
    var o = { event: event };
    for (var k in params) o[k] = params[k];
    dl.push(o);
  }
  doc.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    var loc = a.getAttribute('data-location') || 'outro';
    if (/^https:\/\/wa\.me\//.test(href)) track('whatsapp_click', { location: loc });
    else if (/^tel:/.test(href)) track('phone_click', { location: loc });
  });

  /* GTM depois da primeira interação ou 3,5 s após o load, o que vier antes (não disputa o LCP) */
  var cfg = window.__lw || {};
  var gtmLoaded = false;
  function loadGtm() {
    if (gtmLoaded) return;
    gtmLoaded = true;
    ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(function (t) { window.removeEventListener(t, loadGtm); });
    if (!/^GTM-[A-Z0-9]+$/.test(cfg.gtm || '') || cfg.gtm === 'GTM-XXXXXXX') return; // ID ainda é placeholder
    dl.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    var s = doc.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + cfg.gtm;
    doc.head.appendChild(s);
  }
  ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(function (t) { window.addEventListener(t, loadGtm, { once: true, passive: true }); });
  if (doc.readyState === 'complete') setTimeout(loadGtm, 3500);
  else window.addEventListener('load', function () { setTimeout(loadGtm, 3500); });

  /* ── Cookies (LGPD) + Consent Mode v2 ── */
  var KEY = 'lw_consent';
  var banner = $('[data-cookie]');
  var panel = $('[data-cookie-panel]');
  var prefsBtn = $('[data-cookie-prefs]');
  var lastFocus = null;
  function readConsent() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY));
      if (c && c.v === 1 && Date.now() - Date.parse(c.ts) < 365 * 864e5) return c; // vale por 12 meses
    } catch (err) { /* armazenamento indisponível: o banner aparece de novo */ }
    return null;
  }
  function saveConsent(analytics, marketing) {
    var c = { v: 1, analytics: !!analytics, marketing: !!marketing, ts: new Date().toISOString() };
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (err) { /* segue sem guardar */ }
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: c.analytics ? 'granted' : 'denied',
        ad_storage: c.marketing ? 'granted' : 'denied',
        ad_user_data: c.marketing ? 'granted' : 'denied',
        ad_personalization: c.marketing ? 'granted' : 'denied'
      });
    }
    track('consent_update', { consent_analytics: c.analytics, consent_marketing: c.marketing });
    hideBanner();
  }
  function fabOffset() {
    if (!fab) return;
    var on = banner && !banner.hidden && window.innerWidth < 640;
    fab.style.setProperty('--fab-offset', on ? (banner.offsetHeight + 12) + 'px' : '0px');
  }
  function showBanner() {
    if (!banner) return;
    var c = readConsent();
    if (panel) {
      panel.elements.analytics.checked = !!(c && c.analytics);
      panel.elements.marketing.checked = !!(c && c.marketing);
    }
    banner.hidden = false;
    fabOffset(); // síncrono de propósito: o botão já nasce acima do banner, sem deslocamento visível (CLS)
  }
  function hideBanner() {
    if (!banner) return;
    var hadFocus = banner.contains(doc.activeElement);
    banner.hidden = true;
    if (panel) { panel.hidden = true; prefsBtn.setAttribute('aria-expanded', 'false'); }
    fabOffset();
    if (hadFocus && lastFocus && doc.contains(lastFocus)) lastFocus.focus();
  }
  if (banner) {
    doc.addEventListener('focusin', function (e) { if (!banner.contains(e.target)) lastFocus = e.target; });
    $('[data-cookie-accept]', banner).addEventListener('click', function () { saveConsent(true, true); });
    $('[data-cookie-reject]', banner).addEventListener('click', function () { saveConsent(false, false); });
    prefsBtn.addEventListener('click', function () {
      panel.hidden = !panel.hidden;
      prefsBtn.setAttribute('aria-expanded', String(!panel.hidden));
      fabOffset();
    });
    panel.addEventListener('submit', function (e) {
      e.preventDefault();
      saveConsent(panel.elements.analytics.checked, panel.elements.marketing.checked);
    });
    window.addEventListener('resize', fabOffset, { passive: true });
    $$('[data-cookie-open], [data-cookie-open-sep]').forEach(function (el) { el.hidden = false; });
    $$('[data-cookie-open]').forEach(function (b) {
      b.addEventListener('click', function () { showBanner(); if (panel.hidden) prefsBtn.click(); prefsBtn.focus(); });
    });
    if (!readConsent()) showBanner();
  }

  /* ── Formulário de contato → Google Apps Script ── */
  var form = $('[data-form]');
  if (!form) return;
  form.noValidate = true; // a validação nativa fica só como fallback sem JS
  var status = $('[data-form-status]', form);
  var submit = $('button[type="submit"]', form);
  var label = submit.textContent;

  // UTMs: guardadas na sessão para sobreviver à navegação até a política e de volta
  var UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  var params = new URLSearchParams(location.search);
  var stored = {};
  try { stored = JSON.parse(sessionStorage.getItem('lw_utm')) || {}; } catch (err) { /* sem sessão */ }
  if (UTM.some(function (k) { return params.get(k); })) {
    stored = { origem: location.origin + location.pathname + location.search };
    UTM.forEach(function (k) { if (params.get(k)) stored[k] = params.get(k).slice(0, 200); });
    try { sessionStorage.setItem('lw_utm', JSON.stringify(stored)); } catch (err) { /* segue */ }
  }
  UTM.concat('origem').forEach(function (k) {
    form.elements[k].value = stored[k] || (k === 'origem' ? location.origin + location.pathname + location.search : '');
  });

  // Máscara de telefone BR: (11) 91234-5678 ou (11) 3123-4567
  var tel = form.elements.telefone;
  tel.addEventListener('input', function () {
    var d = tel.value.replace(/\D/g, '').slice(0, 11);
    var out = d;
    if (d.length > 2) out = '(' + d.slice(0, 2) + ') ' + (d.length > 10 ? d.slice(2, 7) + '-' + d.slice(7) : d.length > 6 ? d.slice(2, 6) + '-' + d.slice(6) : d.slice(2));
    else if (d.length) out = '(' + d;
    tel.value = out;
  });

  var RULES = {
    nome: function (v) { return v.trim().length >= 2; },
    telefone: function (v) { var n = v.replace(/\D/g, '').length; return n === 10 || n === 11; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
    descricao: function (v) { return v.trim().length >= 10; },
    consentimento: function (v, el) { return el.checked; }
  };
  function check(el) {
    var ok = RULES[el.name](el.value, el);
    var box = el.closest('.field') || el.closest('.consent-wrap');
    box.classList.toggle('is-invalid', !ok);
    if (ok) el.removeAttribute('aria-invalid'); else el.setAttribute('aria-invalid', 'true');
    return ok;
  }
  Object.keys(RULES).forEach(function (name) {
    var el = form.elements[name];
    el.addEventListener('blur', function () { if (el.value || el.type === 'checkbox') check(el); });
    // depois de marcado como inválido, o erro some assim que a pessoa corrige
    el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', function () {
      if (el.getAttribute('aria-invalid')) check(el);
    });
  });

  function show(kind) {
    status.innerHTML = '';
    status.appendChild($('template[data-msg="' + kind + '"]', form).content.cloneNode(true));
  }
  function busy(on) {
    submit.setAttribute('aria-busy', String(on));
    submit.disabled = on;
    submit.textContent = on ? submit.getAttribute('data-label-busy') : label;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (submit.disabled) return;
    var invalid = Object.keys(RULES).map(function (n) { return form.elements[n]; }).filter(function (el) { return !check(el); });
    if (invalid.length) { invalid[0].focus(); return; }
    status.innerHTML = '';

    var data = {};
    ['nome', 'telefone', 'email', 'descricao', 'politica_versao', 'website', 'origem'].concat(UTM).forEach(function (k) {
      data[k] = form.elements[k].value.trim();
    });
    data.consentimento = true;
    data.consentimento_data = new Date().toISOString();

    var done = function (ok, reason) {
      busy(false);
      show(ok ? 'success' : 'error');
      if (ok) {
        form.reset();
        UTM.concat('origem').forEach(function (k) { form.elements[k].value = data[k]; });
        track('form_submit', { form_id: 'contato' });
      } else {
        track('form_error', { form_id: 'contato', error_type: reason });
      }
    };
    // Honeypot preenchido: robô. Finge sucesso, sem enviar nem registrar conversão.
    if (data.website) { form.reset(); show('success'); return; }

    busy(true);
    var ctrl = 'AbortController' in window ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 15000);
    // text/plain evita o preflight de CORS, que o Apps Script não responde
    fetch(form.getAttribute('data-endpoint'), {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(data),
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (r) {
      if (!r.ok) throw new Error('http_' + r.status);
      return r.json();
    }).then(function (res) {
      clearTimeout(timer);
      if (res && res.ok) done(true); else done(false, (res && res.error) || 'resposta_invalida');
    }).catch(function (err) {
      clearTimeout(timer);
      done(false, err.name === 'AbortError' ? 'timeout' : (/^http_/.test(err.message) ? err.message : 'rede'));
    });
  });
})();
