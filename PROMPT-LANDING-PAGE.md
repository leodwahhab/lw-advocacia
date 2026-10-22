# Prompt — Desenvolvimento da landing page LW Advocacia

> Uso: rode no Claude Code, dentro da pasta `lw-advocacia`. Antes de colar, substitua `<LINK_DO_DESIGN_SYSTEM>` pelo link do design system publicado no Claude Design.

---

## Papel e objetivo

Você é um desenvolvedor front-end sênior. Construa a landing page do escritório **LW Advocacia** nesta pasta, aplicando **fielmente** o design system que já existe no Claude Design: `<LINK_DO_DESIGN_SYSTEM>`.

O projeto é **apenas local** por enquanto: não configure domínio, hospedagem, SSL nem deploy. Deixe tudo pronto para publicar depois e documente esse passo.

## Passo 0 — Ler o design system antes de qualquer código

1. Leia o design system no link acima com a ferramenta Artifact (`action: "read"`) e, se ele tiver arquivos publicados, liste e baixe `tokens.css` e `DESIGN.md`.
2. **Os tokens e as regras do design system são a fonte da verdade.** Não invente cores, fontes, raios, sombras ou animações fora deles. Se faltar algo, derive dos tokens existentes e registre a decisão em `docs/decisoes.md`.
3. Leia também `PROMPT-DESIGN-SYSTEM.md` para entender as restrições que geraram o sistema: logo só sobre `#172639`, dourado só como ornamento, títulos sem negrito, no máximo 5 microinterações e proibições da OAB.
4. Antes de codar, me mostre um resumo curto do que extraiu (tokens principais, fontes, componentes e animações) e a estrutura de pastas que vai criar.

## Stack e arquitetura

- **HTML semântico + CSS puro + JS vanilla.** Sem React, Tailwind, jQuery, framer-motion ou bibliotecas de UI.
- **O conteúdo fica separado do layout.** Todo texto, imagem, link, telefone, endereço e dado do(a) advogado(a) mora em `content/site.json`. Nada editável fica hardcoded no template.
- **Build mínimo em Node, sem framework:** `scripts/build.mjs` lê `content/site.json` e `src/template.html` (ou partials em `src/partials/`) e gera `dist/index.html` e `dist/politica-de-privacidade.html`. Ele também copia e otimiza assets. Use template literals ou um mini-substituidor próprio. As dependências permitidas são `sharp` (para gerar AVIF/WebP e variantes de `srcset`) e `decap-server` (dev).
- **CMS:** o **Decap CMS**, em `dist/admin/` (`index.html` + `config.yml`), edita `content/site.json` com campos amigáveis em português: textos, listas de áreas de atuação, FAQ, passos, fotos, contatos e redes. Use `local_backend: true` para funcionar localmente com `npx decap-server`. Deixe o bloco `backend` comentado, com instruções para trocar por `git-gateway`/GitHub quando houver hospedagem.
- **Scripts npm:**
  - `npm run dev`: build, watch, servidor estático local e decap-server.
  - `npm run build`
  - `npm run cms`
- **Estrutura sugerida:** `src/` (template, `css/`, `js/`), `content/`, `assets/` (originais), `scripts/`, `dist/` (gerado, no `.gitignore`) e `docs/`.

## Estrutura da página (nesta ordem)

1. **Header:** sobre `#172639`, com o logo horizontal (`assets/lw-advocacia-logo-wordmark.jpg`, recortado na área útil x 252–1116, y 228–540), CTA de contato e no máximo 3–4 âncoras.
2. **Hero:** `h1` de impacto, subtítulo explicativo, CTA primário (formulário ou WhatsApp), CTA secundário (telefone) e foto profissional.
3. **Áreas de atuação:** cards com ícone Lucide (SVG inline), título e breve descrição.
4. **Sobre o escritório e o(a) advogado(a):** foto, nome, formação, **número da OAB** e diferenciais.
5. **Como funciona o atendimento:** 4 passos (contato, análise do caso, estratégia e acompanhamento).
6. **Perguntas frequentes:** `<details>/<summary>`.
7. **Formulário de contato:** nome, telefone, e-mail, breve descrição do caso e checkbox de consentimento LGPD.
8. **Rodapé:** sobre `#172639`, com logo, endereço, mapa, redes sociais, nome com OAB, link para a Política de Privacidade e aviso informativo da OAB.
9. **Fixos:** botão flutuante de WhatsApp e banner de cookies.
10. **Página separada `politica-de-privacidade.html`**, no mesmo layout.

Use favicon e ícones gerados a partir de `assets/lw-advocacia-emblema.jpg`, recortado.

## Conteúdo e copywriting

- Escreva a copy em `content/site.json`, em pt-BR claro, acessível e persuasivo, **sem juridiquês excessivo**. Toda a copy é rascunho para minha aprovação, então gere também `docs/copy-para-revisao.md` com todos os textos em ordem de leitura.
- Dados que não conheço viram **placeholders explícitos** entre colchetes: `[Nome do(a) advogado(a)]`, `[OAB/UF 000.000]`, `[Endereço]`, `[(00) 00000-0000]`, `[Área de atuação 1]` etc. Liste todos em `docs/pendencias.md`.
- Proponha 6 áreas de atuação genéricas como exemplo editável (família, trabalhista, cível, previdenciário, consumidor e empresarial).
- **Regras da OAB (Código de Ética e Provimento 205/2021). Não negociáveis:**
  - Caráter **informativo**, sem promessa de resultado ou garantia de êxito.
  - Proibido: "melhor advogado", "causa ganha", "ganhe sua causa", superlativos e comparações com outros escritórios.
  - Sem preços, valores, promoções, descontos ou "consulta grátis".
  - Sem depoimentos de clientes e sem resultados ou números de processos.
  - O nome do(a) advogado(a) e o número da OAB ficam visíveis.
  - CTAs neutros, como "Fale com o escritório" e "Envie seu caso para análise", nunca "Garanta seus direitos agora!".
- Ao final, rode uma checagem automatizada (`scripts/check-oab.mjs`) que procure termos proibidos no `site.json` e no HTML gerado, e falhe o build se encontrar algum.

## Funcionalidades

### WhatsApp
- Botão flutuante com link `https://wa.me/<numero>?text=<mensagem pré-preenchida URL-encoded>`. O número e a mensagem vêm do `site.json`.
- Respeita `safe-area-inset` e não cobre o banner de cookies nem o botão de envio do formulário.

### Formulário → e-mail + Google Sheets
- Envio via `fetch` para um **Google Apps Script** publicado como Web App. A URL fica em `site.json` (placeholder).
- Gere `integrations/google-apps-script/Code.gs`. Ele recebe o POST, valida, grava uma linha na planilha (data/hora, nome, telefone, e-mail, descrição, consentimento, versão da política, origem/UTM) e envia e-mail ao escritório com `MailApp`.
- Gere `docs/configurar-formulario.md` com o passo a passo leigo: criar a planilha, colar o script, publicar e copiar a URL.
- No front:
  - validação HTML5 + JS;
  - máscara de telefone BR;
  - honeypot anti-spam;
  - estados de loading, sucesso e erro conforme o design system;
  - consentimento obrigatório;
  - captura das UTMs da URL em campos ocultos.
- Use `Content-Type: text/plain` no POST para evitar preflight CORS no Apps Script. Funciona sem JS com fallback de mensagem orientando o WhatsApp.

### Rastreamento e conversões
- **Google Tag Manager** como único snippet no HTML (ID em `site.json`, placeholder `GTM-XXXXXXX`). O GA4 e o Meta Pixel são configurados **dentro do GTM**, não hardcoded.
- **Consent Mode v2:** os padrões `denied` vêm antes do GTM. O banner de cookies atualiza o consentimento (`analytics_storage`, `ad_storage`, `ad_user_data` e `ad_personalization`) e salva a escolha em `localStorage`. O Pixel só dispara com consentimento de marketing.
- Faça `dataLayer.push` com estes eventos:

  | Evento | Quando |
  |---|---|
  | `whatsapp_click` | clique no botão do WhatsApp (com `location`: hero, flutuante ou rodapé) |
  | `phone_click` | clique em link `tel:` |
  | `form_submit` | **só no sucesso** do envio |
  | `form_error` | erro no envio |

- Gere `docs/configurar-gtm.md` com as tags, acionadores e variáveis a criar no GTM (GA4 Configuration, eventos GA4 marcados como conversão e eventos do Pixel `Contact`/`Lead`). Exporte também um `integrations/gtm-container.json` importável, se for viável.

### SEO on-page
- `<title>` e meta description vindos do `site.json`, `lang="pt-BR"`, canonical (placeholder), Open Graph e Twitter Card, e um único `h1` com hierarquia correta.
- `alt` em todas as imagens.
- JSON-LD `LegalService` / `Attorney` com nome, endereço, telefone e horário, sem avaliações nem preços.
- `robots.txt` e `sitemap.xml` com placeholder de domínio.

### LGPD
- Banner de cookies com "Aceitar", "Recusar" e "Preferências" (necessários / estatística / marketing).
- O texto da Política de Privacidade cobre: controlador, dados coletados no formulário, finalidade, base legal (consentimento e procedimentos preliminares a contrato), compartilhamento (Google e Meta), retenção, direitos do titular e contato do encarregado. Use placeholders e marque para revisão jurídica.
- O formulário coleta só o necessário e registra a data e a versão do consentimento.

## Performance (meta: PageSpeed mobile ≥ 80, mirar 90+)

- CSS crítico inline no `<head>` e o restante carregado sem bloquear. JS com `defer` e total abaixo de 15 KB, sem contar o GTM.
- Fontes do design system self-hosted em WOFF2, subset latin, `font-display: swap` e preload só da fonte do `h1`.
- Imagens:
  - AVIF/WebP com `srcset`/`sizes` gerados pelo build;
  - `width`/`height` explícitos;
  - `fetchpriority="high"` na foto do hero;
  - `loading="lazy"` no restante.
- **Mapa por fachada:** imagem estática ou botão "Ver no mapa" que só carrega o iframe do Google Maps ao clicar.
- O GTM carrega após a interação ou no `load`, sem atrasar o LCP. Documente o trade-off.
- Animações só com `transform`, `opacity` e `filter`, exatamente as do design system, todas desligadas em `prefers-reduced-motion`.

## Acessibilidade e responsividade

- Mobile-first, testado em 360, 390, 768, 1024 e 1440px, sem scroll horizontal.
- Contraste WCAG AA, `:focus-visible` visível, áreas de toque de 44px e link "Pular para o conteúdo".
- Labels reais nos campos, erros ligados por `aria-describedby` e `aria-live` na mensagem de envio.
- A página funciona sem JS, incluindo o FAQ e os links de WhatsApp e telefone.

## Verificação (obrigatória antes de dizer que terminou)

1. `npm run build` sem erros, com `check-oab` passando.
2. Use o **Playwright** para:
   - abrir `dist/index.html` servido localmente;
   - tirar screenshots em 390px e 1440px (salvos em `docs/screenshots/`) e compará-los com o design system;
   - testar o FAQ, a validação do formulário (com o endpoint mockado), o banner de cookies (aceitar e recusar) e o link do WhatsApp;
   - conferir no `dataLayer` os eventos `whatsapp_click`, `phone_click` e `form_submit`.
3. Rode o **Lighthouse** mobile local (`npx lighthouse`) e reporte as notas de Performance, Acessibilidade, Boas Práticas e SEO. Corrija o que estiver abaixo de 90 sempre que depender do código.
4. Teste o Decap CMS localmente: edite um texto pelo painel, rode o build e confirme a mudança na página.
5. Reporte o que foi verificado, o que falhou e o que ficou pendente. Não declare sucesso sem evidência.

## Entregáveis

- Código-fonte completo nesta pasta e `dist/` gerado.
- `README.md` com como rodar, editar e gerar o build.
- `docs/`:
  - `tutorial-edicao.md`: passo a passo **leigo**, com prints, para editar textos e imagens pelo CMS;
  - `configurar-formulario.md`;
  - `configurar-gtm.md`;
  - `publicacao.md`: orientação futura de hospedagem, domínio, SSL e backend do Decap;
  - `copy-para-revisao.md`;
  - `pendencias.md`;
  - `decisoes.md`;
  - `screenshots/`.
- `integrations/`: `Code.gs` do Apps Script e, se viável, o container do GTM.

Trabalhe em etapas e me mostre o resultado ao fim de cada uma:

1. Leitura do design system + estrutura.
2. Layout estático com conteúdo.
3. Formulário + integrações.
4. CMS.
5. Performance + verificação.
