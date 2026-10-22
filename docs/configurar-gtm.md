# Google Tag Manager, GA4 e Meta Pixel

O site tem **um único snippet**: o Google Tag Manager (GTM). O Google Analytics 4 e o Meta Pixel são configurados **dentro do GTM**, nunca no código. O site envia eventos ao `dataLayer` e respeita o consentimento de cookies (Consent Mode v2).

## Como o site se comporta

1. **Antes de qualquer tag**, o `<head>` define o consentimento padrão como **negado** (`analytics_storage`, `ad_storage`, `ad_user_data` e `ad_personalization`). Se a pessoa já escolheu antes, a escolha salva no `localStorage` (`lw_consent`, válida por 12 meses) é reaplicada imediatamente.
2. O banner de cookies atualiza o consentimento:

   | Escolha | analytics_storage | ad_storage, ad_user_data, ad_personalization |
   | --- | --- | --- |
   | Aceitar | granted | granted |
   | Recusar | denied | denied |
   | Preferências: Estatística | granted | denied |
   | Preferências: Marketing | (conforme a caixa) | granted |

   A cada escolha, o site também envia o evento `consent_update` com `consent_analytics` e `consent_marketing` (true/false).
3. **O GTM carrega depois da primeira interação** (toque, rolagem, clique ou tecla) **ou 3,5 s após o carregamento da página**, o que vier primeiro. Enquanto o ID for `GTM-XXXXXXX`, o GTM não é carregado.

### Trade-off do carregamento tardio

- **Ganho:** o GTM, o GA4 e o Pixel somam de 100 a 300 KB de JavaScript. Fora do caminho do carregamento, eles não atrasam o LCP nem o TBT, que são as métricas que mais pesam no PageSpeed mobile.
- **Custo:** quem sai do site em menos de 3,5 s sem tocar na tela não gera `page_view`. Na prática, são acessos que não seriam convertidos. Os eventos de clique não se perdem: ficam no `dataLayer` e o GTM os processa ao carregar.
- Para medir 100% das visitas mesmo com perda de desempenho, troque `3500` por `0` em `src/js/main.js` (função `loadGtm`).

## Eventos enviados ao dataLayer

| Evento | Quando | Parâmetros |
| --- | --- | --- |
| `whatsapp_click` | clique em qualquer link do WhatsApp | `location`: `hero`, `flutuante`, `rodape`, `contato` ou `erro-formulario` |
| `phone_click` | clique em link `tel:` | `location`: `hero`, `contato` ou `rodape` |
| `form_submit` | **só** quando o envio do formulário dá certo | `form_id`: `contato` |
| `form_error` | falha no envio | `form_id`, `error_type` (`rede`, `timeout`, `http_500`, `limite`...) |
| `consent_update` | escolha no banner de cookies | `consent_analytics`, `consent_marketing` |

Nenhum evento leva dados pessoais (nome, e-mail, telefone ou texto do caso).

---

## Opção A: importar o contêiner pronto (recomendado)

O arquivo `integrations/gtm-container.json` já traz tags, acionadores e variáveis. Ele é gerado por `node scripts/gerar-gtm.mjs`.

1. Crie a conta e o contêiner em **https://tagmanager.google.com** (plataforma **Web**). Anote o ID `GTM-XXXXXXX`.
2. No GTM: **Administrador → Importar contêiner** → escolha `gtm-container.json`, **Espaço de trabalho existente (Default)** e **Mesclar → Substituir tags, acionadores e variáveis conflitantes** → **Confirmar**.
3. Em **Variáveis**, edite:
   - `CONST - GA4 ID de medição`: o ID do GA4 (`G-...`), em GA4 → Administrador → Fluxos de dados;
   - `CONST - Meta Pixel ID`: o ID do Pixel, no Gerenciador de Eventos da Meta.
4. Em **Administrador → Configurações do contêiner**, marque **Ativar visão geral do consentimento**.
5. Teste em **Visualizar** (abaixo) e clique em **Enviar → Publicar**.
6. Coloque o ID `GTM-...` no site: painel do CMS → **Configurações do site → ID do Google Tag Manager** (ou `site.gtmId` no `content/site.json`) e rode `npm run build`.

> O arquivo segue o formato de exportação do GTM, mas não foi testado numa conta real. Se a importação reclamar de algum item, crie esse item à mão conforme a Opção B.

## Opção B: criar à mão

### Variáveis

| Nome | Tipo | Valor |
| --- | --- | --- |
| `CONST - GA4 ID de medição` | Constante | `G-XXXXXXXXXX` |
| `CONST - Meta Pixel ID` | Constante | ID do Pixel |
| `DLV - location` | Variável da camada de dados | `location` |
| `DLV - form_id` | Variável da camada de dados | `form_id` |
| `DLV - error_type` | Variável da camada de dados | `error_type` |
| `DLV - consent_marketing` | Variável da camada de dados | `consent_marketing` |

### Acionadores (Evento personalizado)

| Nome | Nome do evento | Condição |
| --- | --- | --- |
| `CE - whatsapp_click` | `whatsapp_click` | |
| `CE - phone_click` | `phone_click` | |
| `CE - form_submit` | `form_submit` | |
| `CE - form_error` | `form_error` | |
| `CE - consent_update` | `consent_update` | `DLV - consent_marketing` igual a `true` |

### Tags

| Tag | Tipo | Acionador | Consentimento |
| --- | --- | --- | --- |
| GA4 - Google tag | Google tag, ID `{{CONST - GA4 ID de medição}}` | Initialization - All Pages | Nenhum adicional (o GA4 respeita o Consent Mode nativamente) |
| GA4 - evento - whatsapp_click | Evento do GA4, parâmetro `location` = `{{DLV - location}}` | CE - whatsapp_click | idem |
| GA4 - evento - phone_click | Evento do GA4, parâmetro `location` | CE - phone_click | idem |
| GA4 - evento - form_submit | Evento do GA4, parâmetro `form_id` | CE - form_submit | idem |
| GA4 - evento - form_error | Evento do GA4, parâmetros `form_id` e `error_type` | CE - form_error | idem |
| Meta Pixel - base (PageView) | HTML personalizado (código em `gtm-container.json`) | All Pages **e** CE - consent_update | **Exigir consentimento adicional: `ad_storage`**. Disparo: uma vez por página |
| Meta Pixel - Contact | HTML: `fbq('track','Contact')` | CE - whatsapp_click e CE - phone_click | **Exigir `ad_storage`** |
| Meta Pixel - Lead | HTML: `fbq('track','Lead')` | CE - form_submit | **Exigir `ad_storage`** |

**Por que o Pixel tem dois acionadores:** se a pessoa aceita marketing *depois* de a página carregar, o "All Pages" já passou e foi bloqueado. O `consent_update` com marketing ativo inicializa o Pixel nesse momento. O código evita inicializar duas vezes.

### Conversões

- **GA4:** em Administrador → Eventos, marque `form_submit` e `whatsapp_click` (e, se quiser, `phone_click`) como **eventos-chave**. Os eventos aparecem na lista até 24 h depois do primeiro disparo.
- **Meta:** no Gerenciador de Eventos, os eventos `Lead` e `Contact` ficam disponíveis para otimização de campanhas.
- **Google Ads (opcional):** importe os eventos-chave do GA4 como conversões, ou crie tags "Acompanhamento de conversões do Google Ads" com os mesmos acionadores.

## Testar

1. No GTM, clique em **Visualizar** e informe o endereço do site (ou `http://localhost:8080` com `npm run dev`).
2. Ainda sem escolher nada no banner, as tags GA4 aparecem como disparadas (em modo sem cookies) e as do Pixel como **bloqueadas por consentimento**.
3. Clique em **Aceitar**: a aba **Consentimento** mostra tudo como `granted` e o Pixel dispara.
4. Clique no WhatsApp e confira `whatsapp_click` com o `location` certo. Depois, envie o formulário e confira `form_submit`.
5. No GA4, abra **Relatórios → Tempo real** para ver os eventos chegando.
