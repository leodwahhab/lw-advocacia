# Publicação (para quando for ao ar)

O projeto é **só local** por enquanto. Este guia explica o que fazer quando for publicar: hospedagem, domínio, SSL e o painel de edição online. Nada disso está configurado ainda.

## Visão geral

O site é **estático**: `npm run build` gera a pasta `dist/` com HTML, CSS, JS, imagens e fontes. Qualquer hospedagem de arquivos estáticos serve. O painel (Decap CMS) edita o `content/site.json` **no repositório Git**, e a hospedagem refaz o build a cada alteração.

```
Painel (navegador) → commit no GitHub → hospedagem roda "npm run build" → site atualizado
```

## Checklist antes de publicar

- [ ] Todos os placeholders de `docs/pendencias.md` preenchidos.
- [ ] `site.url` com o domínio final, com `https://` e sem barra no final. Ele alimenta o canonical, o Open Graph, o `sitemap.xml`, o `robots.txt` e o JSON-LD.
- [ ] `npm run build` passando, inclusive o `check-oab`.
- [ ] Formulário ligado (`docs/configurar-formulario.md`) e testado.
- [ ] GTM configurado (`docs/configurar-gtm.md`).
- [ ] Política de Privacidade revisada por advogado(a), com o aviso "Rascunho para revisão jurídica" apagado.

---

## 1. Colocar o projeto no GitHub

1. Crie uma conta em https://github.com e um repositório **privado**, por exemplo `lw-advocacia`.
2. Na pasta do projeto:
   ```sh
   git init
   git add .
   git commit -m "Site LW Advocacia"
   git branch -M main
   git remote add origin https://github.com/USUARIO/lw-advocacia.git
   git push -u origin main
   ```
   O `.gitignore` já deixa de fora `node_modules/` e `dist/`.

## 2. Hospedagem: opção recomendada, Netlify

A Netlify tem plano gratuito, SSL automático e o **Git Gateway**, que permite editar pelo painel com login por e-mail, sem que quem edita precise de conta no GitHub.

1. Em https://app.netlify.com: **Add new site → Import an existing project → GitHub** e escolha o repositório.
2. Configurações de build:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** em *Environment variables*, crie `NODE_VERSION` = `22` (ou superior).
3. **Deploy.** O arquivo `dist/_headers`, gerado pelo build, já configura o cache longo dos arquivos com hash e os cabeçalhos de segurança.

### Painel online (Decap + Git Gateway)

1. Na Netlify: **Site configuration → Identity → Enable Identity**.
2. Em **Registration**, escolha **Invite only**.
3. Em **Services → Git Gateway**, clique em **Enable Git Gateway**.
4. Em **Identity → Invite users**, convide o e-mail de quem vai editar.
5. Em `src/admin/config.yml`:
   - mantenha `backend: name: git-gateway` e `branch: main`;
   - troque `site_url` e `display_url` pelo domínio final.
6. Em `src/admin/index.html`, antes do script do Decap, acrescente o widget de login da Netlify:
   ```html
   <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
   ```
7. Publique (commit + push). O painel fica em `https://seudominio.com.br/admin/`.

> Para continuar editando no computador, basta `npm run dev`: o `local_backend: true` tem prioridade em `localhost`. Depois de editar localmente, faça commit e push para publicar.

## 3. Alternativas de hospedagem

| Hospedagem | Build | Painel (Decap) | Observação |
| --- | --- | --- | --- |
| **Cloudflare Pages** | `npm run build`, saída `dist` | backend `github` + um servidor OAuth (ex.: Cloudflare Worker "decap-cms-oauth") | Lê o `_headers` igual à Netlify. Excelente CDN no Brasil. |
| **Vercel** | `npm run build`, saída `dist` | backend `github` + servidor OAuth | Os cabeçalhos vão no `vercel.json` (o `_headers` é ignorado). |
| **GitHub Pages** | GitHub Actions rodando `npm ci && npm run build` | backend `github` + servidor OAuth | Não permite cabeçalhos próprios: o cache fica no padrão (10 min). |
| **Hospedagem comum (cPanel/FTP)** | rode `npm run build` no seu computador e envie o conteúdo de `dist/` para `public_html` | só local (`npm run dev`) e reenvio por FTP | Configure cache e compressão no `.htaccess` (abaixo). |

Para o backend `github`, troque o bloco em `src/admin/config.yml` pelo que está comentado (`name: github`, `repo: usuario/lw-advocacia`, `base_url` do servidor OAuth).

### `.htaccess` para Apache (hospedagem comum)

```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json image/svg+xml application/manifest+json
</IfModule>
<IfModule mod_headers.c>
  <FilesMatch "\.(css|js|avif|webp|jpg|png|woff2)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  <FilesMatch "\.html$">
    Header set Cache-Control "public, max-age=0, must-revalidate"
  </FilesMatch>
  Header set X-Content-Type-Options "nosniff"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

## 4. Domínio

1. Registre o domínio `.com.br` em https://registro.br, com o CPF/CNPJ do titular.
2. Na hospedagem, adicione o domínio (Netlify: **Domain management → Add a domain**).
3. No Registro.br, em **DNS**, aponte conforme a hospedagem indicar:
   - **Netlify:** registro `A` de `@` para `75.2.60.5` e `CNAME` de `www` para `seu-site.netlify.app`. Ou use os servidores DNS da Netlify.
   - Outras: siga as instruções do painel da hospedagem.
4. Escolha a versão principal (com ou sem `www`) e redirecione a outra para ela. Use **a mesma** em `site.url`.

## 5. SSL (https)

Netlify, Cloudflare Pages, Vercel e GitHub Pages emitem o certificado **automaticamente** (Let's Encrypt) assim que o DNS propaga, o que leva de minutos a 24 h. Ative **Force HTTPS**. Em hospedagem comum, ative o "AutoSSL" ou "Let's Encrypt" no cPanel; o `.htaccess` acima força o https.

## 6. Depois de publicar

1. **Google Search Console** (https://search.google.com/search-console): adicione o domínio, verifique pelo DNS e envie `https://seudominio.com.br/sitemap.xml`.
2. **Perfil da Empresa no Google** (Google Maps): crie ou reivindique o perfil com o mesmo nome, endereço e telefone do site (NAP idêntico ao JSON-LD).
3. **PageSpeed Insights** (https://pagespeed.web.dev): teste o endereço final. A referência local está no README.
4. **GTM em modo Visualizar**: confira o consentimento e os eventos no domínio real.
5. **Formulário:** envie um contato de teste e confira a planilha e o e-mail.
6. **Apps Script:** troque `SITE_URL` no `Code.gs` pelo domínio final e publique uma **nova versão** (veja `configurar-formulario.md`).
