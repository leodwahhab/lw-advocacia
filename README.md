# LW Advocacia: landing page

Landing page do escritório LW Advocacia em HTML semântico, CSS puro e JS vanilla, construída sobre o design system em https://claude.ai/artifact/SpNVkZTFhNCDT3NwiPE7tv. O conteúdo fica separado do layout (`content/site.json`) e é editável por um painel (Decap CMS).

🌐 **Site publicado:** https://leodwahhab.github.io/lw-advocacia/ (GitHub Pages)

**Status:** publicado no GitHub Pages como demonstração. O domínio próprio ainda **não** está configurado (veja `docs/publicacao.md`). ⚠️ O conteúdo usa **dados de exemplo propositalmente falsos** ("Fulana de Tal", OAB/BA 123.456, Xique-Xique/BA, domínio `example.com`). A lista completa para substituir está em `docs/pendencias.md`.

## Publicação (GitHub Pages)

| | |
| --- | --- |
| Site | https://leodwahhab.github.io/lw-advocacia/ |
| Política de Privacidade | https://leodwahhab.github.io/lw-advocacia/politica-de-privacidade.html |
| Repositório | https://github.com/leodwahhab/lw-advocacia |
| Deploys | https://github.com/leodwahhab/lw-advocacia/actions |

- **Todo push na `main` publica o site sozinho** pelo workflow `.github/workflows/deploy.yml` (`npm ci` → `npm run build` → GitHub Pages). Se o `check-oab` encontrar um termo proibido, o deploy é barrado e o site no ar continua o anterior.
- Para publicar uma alteração: edite (pelo painel local ou no `site.json`), depois `git add`, `git commit` e `git push`. O site atualiza em cerca de 1 minuto.
- O painel `/admin/` publicado **não** funciona no GitHub Pages: não há backend de login. Edite localmente com `npm run dev` e faça push. Para editar online, veja `docs/publicacao.md`.
- O GitHub Pages ignora o `dist/_headers`, então o cache fica no padrão do GitHub (10 min). Para cache longo e domínio próprio com mais controle, veja as opções em `docs/publicacao.md`.
- Os links canônicos, o sitemap e a imagem de compartilhamento usam o `site.url` do conteúdo, hoje `https://www.example.com`. Ao definir o endereço definitivo, atualize esse campo.

## Como rodar

Requisitos: **Node.js 20 ou superior**.

```sh
npm install        # uma vez
npm run dev        # site em http://localhost:8080 + painel em http://localhost:8080/admin/
```

No Windows, um duplo clique em **`editar-site.cmd`** faz o mesmo e abre o painel.

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Build + recompilação automática a cada alteração + servidor local (8080) + `decap-server` (8081, painel local) |
| `npm run build` | Gera `dist/` e roda o `check-oab`. **Falha se houver termo proibido pela OAB.** |
| `npm run preview` | Serve `dist/` como em produção (brotli/gzip + cache) em http://localhost:4173, para medir com o Lighthouse |
| `npm run cms` | Só o `decap-server` (se o site já estiver sendo servido de outra forma) |
| `npm run check:oab` | Só a checagem de termos proibidos |
| `npm run gtm:container` | Gera de novo `integrations/gtm-container.json` |

## Como editar

- **Pelo painel (recomendado):** veja `docs/tutorial-edicao.md`, um passo a passo com prints.
- **Direto no arquivo:** `content/site.json`. Todo texto, link, telefone, endereço, foto e dado do(a) advogado(a) está ali. O título do hero aceita uma palavra entre `*asteriscos*` (vira itálico).
- **Fotos:** envie pelo painel (vão para `assets/uploads/`) ou coloque em `assets/` e aponte o caminho no `site.json`. O build gera AVIF, WebP e JPEG em 480, 800 e 1200 px.
- **Layout:** `src/template.html` (página), `src/politica.html` e `src/partials/` (head, header, rodapé, botão flutuante e cookies).
- **Estilos:** `src/css/tokens.css` e `src/css/components.css` são **cópias fiéis do design system; não edite**. Ajustes vão em `src/css/site.css`, com a decisão registrada em `docs/decisoes.md`.

## Estrutura

```
content/site.json            conteúdo editável (fonte única)
src/template.html            página inicial · src/politica.html: Política de Privacidade
src/partials/                head, header, footer, fixos (WhatsApp + cookies)
src/css/                     tokens.css + components.css (design system) + site.css (ajustes)
src/js/main.js               microinterações, cookies/Consent Mode, formulário, dataLayer, GTM tardio
src/admin/                   Decap CMS (index.html + config.yml)
src/fonts/                   Source Serif 4 (normal e itálico) + Inter, woff2 latin
assets/                      logo, emblema, fotos originais, uploads do CMS
scripts/build.mjs            build (templates, CSS crítico, imagens, favicons, SEO, docs)
scripts/check-oab.mjs        checagem de termos proibidos (Provimento 205/2021)
scripts/dev.mjs · preview.mjs   servidores local e de preview
scripts/lib/                 motor de templates, imagens (sharp), ícones Lucide, geração de docs
integrations/                Apps Script do formulário + contêiner do GTM
docs/                        tutoriais, decisões, pendências, copy para revisão, screenshots
dist/                        gerado pelo build (fora do Git)
```

## O que o build gera

- `index.html` e `politica-de-privacidade.html`, com o **CSS crítico inline** (cerca de 17 KB) e o restante carregado sem bloquear a renderização (`css/site.<hash>.css`).
- `js/main.<hash>.js` (cerca de 10 KB; 4 KB com gzip) com `defer`.
- Imagens responsivas (`img/`), logo recortado (2 a 8 KB), favicons, `apple-touch-icon`, manifest e `og-image.jpg`.
- `robots.txt`, `sitemap.xml`, JSON-LD `LegalService` e `_headers` (cache e segurança).
- `admin/` (painel).
- `docs/copy-para-revisao.md` e a tabela de placeholders em `docs/pendencias.md`, sempre em sincronia com o conteúdo.

## Verificação (21/10/2026)

**Lighthouse mobile** (13.5.0, emulação padrão de celular, sobre `npm run preview`):

| Página | Performance | Acessibilidade | Boas práticas | SEO |
| --- | --- | --- | --- | --- |
| Início (5 execuções, domínio placeholder) | 98–99 | 100 | 100 | 85* |
| Início (3 execuções, com domínio real no `site.url`) | 98–99 | 100 | 100 | 100 |
| Início com os dados de exemplo (22/10/2026, 3 execuções) | 98–99 | 100 | 100 | 100 |
| Política de Privacidade (domínio real) | 100 | 100 | 100 | 100 |

Medianas na home: FCP 1,4 s · LCP 1,9 s · TBT 97 ms · CLS 0 · Speed Index 2,1 s.

\* Com o placeholder `https://[seu-dominio].com.br`, o canonical e o sitemap do `robots.txt` são URLs inválidas. A nota chega a 100 assim que `site.url` recebe o domínio (testado com `https://lwadvocacia.com.br`).

**Playwright** (Chromium, sobre o site local):

- **51/51 testes de funcionalidade:**
  - banner de cookies: aceitar, recusar, preferências, persistência e reabertura;
  - Consent Mode v2 com padrão negado;
  - eventos `whatsapp_click` (hero, flutuante e rodapé), `phone_click`, `form_submit` (só no sucesso) e `form_error`;
  - formulário: validação, máscara, foco no erro, consentimento obrigatório, honeypot, UTMs e POST `text/plain`, com o endpoint mockado em sucesso e erro 500;
  - FAQ;
  - página sem JavaScript.
- **13/13 checagens finais:**
  - movimento reduzido;
  - teclado: link de pular conteúdo e `:focus-visible`;
  - áreas de toque ≥ 44 px;
  - sem scroll horizontal em 360 px;
  - h1 único;
  - `alt` em todas as imagens;
  - prioridade e lazy loading das imagens.
- **Sem scroll horizontal** em 360, 390, 768, 1024 e 1440 px.
- **CMS:** texto editado pelo painel chega ao `site.json` e ao site; foto enviada pelo painel é processada pelo build.

Telas em `docs/screenshots/` (`final-390.png`, `final-1440.png`, `final-politica-*.png`).

## Documentação

| Arquivo | Para quê |
| --- | --- |
| `docs/tutorial-edicao.md` | Editar textos e fotos pelo painel (leigo, com prints) |
| `docs/configurar-formulario.md` | Ligar o formulário à planilha e ao e-mail (Google Apps Script) |
| `docs/configurar-gtm.md` | GTM, GA4, Meta Pixel, consentimento e conversões |
| `docs/publicacao.md` | Hospedagem, domínio, SSL e painel online (futuro) |
| `docs/copy-para-revisao.md` | Todos os textos em ordem de leitura, para aprovação |
| `docs/pendencias.md` | O que falta preencher, revisar ou configurar |
| `docs/decisoes.md` | Onde a implementação derivou ou completou o design system, e por quê |
