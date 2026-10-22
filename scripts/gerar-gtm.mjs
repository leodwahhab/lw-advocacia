// Gera integrations/gtm-container.json, importável no Google Tag Manager (Admin > Importar contêiner).
// Rode: node scripts/gerar-gtm.mjs   Depois de importar, troque as constantes G-XXXXXXXXXX e o ID do Pixel.
import { writeFile } from 'node:fs/promises';

const ids = { acc: '0', cont: '0' };
let n = 0;
const nextId = () => String(++n);
const base = () => ({ accountId: ids.acc, containerId: ids.cont });
const T = (key, value) => ({ type: 'TEMPLATE', key, value });
const B = (key, value) => ({ type: 'BOOLEAN', key, value: String(value) });

// Gatilhos internos do GTM
const ALL_PAGES = '2147479553';
const INIT = '2147479573';

const variables = [
  { ...base(), variableId: nextId(), name: 'CONST - GA4 ID de medição', type: 'c', parameter: [T('value', 'G-XXXXXXXXXX')] },
  { ...base(), variableId: nextId(), name: 'CONST - Meta Pixel ID', type: 'c', parameter: [T('value', '000000000000000')] },
  ...['location', 'form_id', 'error_type', 'consent_marketing'].map((name) => ({
    ...base(), variableId: nextId(), name: `DLV - ${name}`, type: 'v',
    parameter: [{ type: 'INTEGER', key: 'dataLayerVersion', value: '2' }, B('setDefaultValue', false), T('name', name)],
  })),
];

const ce = (event, extra = []) => ({
  ...base(), triggerId: nextId(), name: `CE - ${event}`, type: 'CUSTOM_EVENT',
  customEventFilter: [{ type: 'EQUALS', parameter: [T('arg0', '{{_event}}'), T('arg1', event)] }],
  ...(extra.length ? { filter: extra } : {}),
});
const tWhats = ce('whatsapp_click');
const tPhone = ce('phone_click');
const tSubmit = ce('form_submit');
const tError = ce('form_error');
const tConsentMkt = ce('consent_update', [{ type: 'EQUALS', parameter: [T('arg0', '{{DLV - consent_marketing}}'), T('arg1', 'true')] }]);
const triggers = [tWhats, tPhone, tSubmit, tError, tConsentMkt];

const needsAds = { consentStatus: 'NEEDED', consentType: { type: 'LIST', list: [{ type: 'TEMPLATE', value: 'ad_storage' }] } };
const notSet = { consentStatus: 'NOT_SET' };

const ga4Event = (name, trigger, params) => ({
  ...base(), tagId: nextId(), name: `GA4 - evento - ${name}`, type: 'gaawe',
  parameter: [
    B('sendEcommerceData', false),
    T('eventName', name),
    T('measurementIdOverride', '{{CONST - GA4 ID de medição}}'),
    ...(params.length ? [{ type: 'LIST', key: 'eventSettingsTable', list: params.map((p) => ({ type: 'MAP', map: [T('parameter', p), T('parameterValue', `{{DLV - ${p}}}`)] })) }] : []),
  ],
  firingTriggerId: [trigger.triggerId], tagFiringOption: 'ONCE_PER_EVENT', consentSettings: notSet,
});

// Pixel: Custom HTML com verificação adicional de consentimento (ad_storage). Só dispara com marketing aceito.
const pixelBase = `<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
if(!window.__lwPixel){window.__lwPixel=1;fbq('init','{{CONST - Meta Pixel ID}}');fbq('track','PageView');}
</script>`;
const pixelEvent = (ev) => `<script>if(window.fbq){fbq('track','${ev}');}</script>`;

const tags = [
  { ...base(), tagId: nextId(), name: 'GA4 - Google tag', type: 'googtag',
    parameter: [T('tagId', '{{CONST - GA4 ID de medição}}')],
    firingTriggerId: [INIT], tagFiringOption: 'ONCE_PER_EVENT', consentSettings: notSet },
  ga4Event('whatsapp_click', tWhats, ['location']),
  ga4Event('phone_click', tPhone, ['location']),
  ga4Event('form_submit', tSubmit, ['form_id']),
  ga4Event('form_error', tError, ['form_id', 'error_type']),
  { ...base(), tagId: nextId(), name: 'Meta Pixel - base (PageView)', type: 'html',
    parameter: [T('html', pixelBase), B('supportDocumentWrite', false)],
    firingTriggerId: [ALL_PAGES, tConsentMkt.triggerId], tagFiringOption: 'ONCE_PER_LOAD', consentSettings: needsAds },
  { ...base(), tagId: nextId(), name: 'Meta Pixel - Contact (WhatsApp e telefone)', type: 'html',
    parameter: [T('html', pixelEvent('Contact')), B('supportDocumentWrite', false)],
    firingTriggerId: [tWhats.triggerId, tPhone.triggerId], tagFiringOption: 'ONCE_PER_EVENT', consentSettings: needsAds },
  { ...base(), tagId: nextId(), name: 'Meta Pixel - Lead (formulário)', type: 'html',
    parameter: [T('html', pixelEvent('Lead')), B('supportDocumentWrite', false)],
    firingTriggerId: [tSubmit.triggerId], tagFiringOption: 'ONCE_PER_EVENT', consentSettings: needsAds },
];

const container = {
  exportFormatVersion: 2,
  exportTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
  containerVersion: {
    path: `accounts/${ids.acc}/containers/${ids.cont}/versions/0`, ...base(), containerVersionId: '0',
    container: { path: `accounts/${ids.acc}/containers/${ids.cont}`, ...base(), name: 'LW Advocacia', publicId: 'GTM-XXXXXXX', usageContext: ['WEB'] },
    tag: tags,
    trigger: triggers,
    variable: variables,
    builtInVariable: [{ ...base(), type: 'EVENT', name: 'Event' }],
  },
};

await writeFile(new URL('../integrations/gtm-container.json', import.meta.url), JSON.stringify(container, null, 2) + '\n');
console.log(`gtm-container.json: ${tags.length} tags, ${triggers.length} acionadores, ${variables.length} variáveis`);
