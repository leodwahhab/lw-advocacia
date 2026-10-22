# Decisões

Pontos em que a implementação derivou, completou ou interpretou o design system (https://claude.ai/artifact/SpNVkZTFhNCDT3NwiPE7tv). Os tokens e o `components.css` foram copiados sem alteração para `src/css/`. Todo ajuste fica em `src/css/site.css`.

## Fonte da verdade

- `src/css/tokens.css` e `src/css/components.css` são cópias idênticas das publicadas no design system (conferido por `diff` em 21/10/2026). Para atualizar o sistema, substitua os dois arquivos. Não edite esses arquivos à mão.

## Layout e componentes

| # | Decisão | Por quê |
| --- | --- | --- |
| 1 | **CTAs do hero:** primário = WhatsApp (`btn--primary` com ícone e rótulo "WhatsApp"), secundário = telefone (`btn--secondary`). | O prompt pede CTA primário (formulário ou WhatsApp) e secundário (telefone). O design system permite um único primário por bloco. A prévia mostrava "Agendar conversa" + WhatsApp; seguimos o prompt. |
| 2 | **Logo recortado no build**, não no CSS. O `sharp` extrai a área útil + 16px (x 236–1132, y 212–556) e gera variantes de 250 e 375px em AVIF, WebP e JPEG. O `site.css` só zera o deslocamento (`.logo img { width: 100%; margin: 0 }`). | Mesmo resultado visual do recorte do design system, com 2 a 8 KB por arquivo em vez dos 361 KB do JPEG original. O container `.logo` (fundo `#172639`, `aspect-ratio 896/344`, alturas de 40, 48 e 56px) não mudou. |
| 3 | **`[hidden] { display: none !important }`** na base. | O `.cookie` do sistema declara `display: grid`, o que anula o atributo `hidden`. |
| 4 | **Título do hero oculto até o JS preparar a revelação** (`.js .reveal:not(.is-ready)`), com fallback de 3 s se o JS falhar e exceção para `prefers-reduced-motion`. | Evita o "pisca" (texto aparece, some e reaparece) da prévia. É a mesma microinteração 1; nenhuma animação nova. |
| 5 | **Botão flutuante some (sem animação)** enquanto o formulário está visível. | O prompt pede que ele não cubra o botão de envio. Usamos `visibility: hidden`, sem transição, para não criar uma 6ª microinteração. |
| 6 | **Folga no fim do rodapé** (72px a mais no celular, 56px no desktop). | Sem ela, o botão flutuante cobria o aviso da OAB no fim da rolagem. |
| 7 | **Mapa por fachada**: o slot usa o mesmo tratamento do `.media-placeholder` sobre marinho (`navy-800`, borda tracejada `navy-600`) e um `btn--inverse` "Ver no mapa". Sem JS, o botão abre o Google Maps numa aba nova. | Não há imagem estática de mapa sem chave de API. A fachada evita carregar cerca de 500 KB do iframe sem necessidade. |
| 8 | `.site-footer .btn--inverse { color: var(--color-text) }` | A regra `.site-footer a` do sistema pinta todo link do rodapé de claro, e o texto do botão invertido sumia. |
| 9 | **CTA do header compacto abaixo de 400px** (padding de 12px e texto de 13px). | Em 360px, "Fale com o escritório" encostava no logo. |
| 10 | **Painel de preferências de cookies** (`.cookie__panel`, `.cookie__opt`): checkboxes de 20px com `accent-color` de ação, título em Inter 500 e texto muted. | A ficha do CookieBanner descreve o painel, mas o `components.css` não traz o estilo. Foi derivado de `.consent` e `.check-list`. |
| 11 | **Página da Política**: coluna de 46rem, `h1` com `t-h1`, `h2` com `t-h3` e aviso de revisão com borda `--color-border-strong` sobre `--color-bg-alt`. | O sistema não tem um template de página de texto. Os valores foram derivados dos tokens existentes (`--measure`, raios e cores). |
| 12 | **Link "Pular para o conteúdo"** em pílula sobre pergaminho, visível só no foco. | O sistema pede o link, mas não define o estilo. |
| 13 | **Ícones extras no sprite:** `clock` (horário no rodapé), `house` e `shield-check` (opções para novas áreas no CMS), `facebook` e `youtube` (redes). | São todos Lucide de traço 1,5, dentro da regra da ficha Icons. O build só inclui na página os ícones usados de fato. |
| 14 | **Botão de WhatsApp na seção de contato** envia `location: "contato"` no evento. Um link no erro do formulário envia `location: "erro-formulario"`. | O prompt lista as origens hero, flutuante e rodapé; as duas novas origens só deixam o relatório mais preciso. |

## Formulário e integrações

| # | Decisão | Por quê |
| --- | --- | --- |
| 15 | **Sem JS, o formulário envia direto ao Apps Script** (`action` = URL do Web App) e o script responde uma página simples de confirmação. Há também um aviso `<noscript>` que indica WhatsApp e telefone. | O prompt pede que a página funcione sem JS com uma mensagem orientando o WhatsApp. As duas coisas convivem: quem consegue enviar, envia; quem prefere, tem o atalho. |
| 16 | **A validação nativa (`required`, `pattern`) fica no HTML** e o JS liga `noValidate` ao carregar. | Sem JS, o navegador valida sozinho; com JS, as mensagens são as do design system, no blur e no envio, e não a cada tecla. |
| 17 | **A descrição do caso é obrigatória** (mínimo de 10 caracteres). | Sem ela, o escritório não consegue fazer a triagem. É o mínimo necessário (LGPD). |
| 18 | **As UTMs ficam no `sessionStorage`** e acompanham a visita mesmo se a pessoa abrir a política e voltar. O campo `origem` guarda a URL de entrada. | Evita perder a campanha quando a pessoa navega antes de enviar. |
| 19 | **O honeypot finge sucesso**, sem enviar e sem disparar `form_submit`. O `Code.gs` verifica o honeypot de novo e limita 5 envios por hora por e-mail/telefone. | Não dá pista ao robô e não infla as conversões. |
| 20 | **O GTM carrega após a 1ª interação ou 3,5 s após o `load`**, e não carrega enquanto o ID for o placeholder. | Trade-off documentado em `configurar-gtm.md`. |
| 21 | **O GA4 usa o Consent Mode avançado** (dispara sem cookies enquanto `denied`). O Pixel tem verificação adicional de `ad_storage`. | O prompt exige que o Pixel só dispare com consentimento de marketing. Para o GA4, o modo avançado mantém a modelagem de conversões sem gravar cookies. Para o modo básico, basta exigir `analytics_storage` nas tags GA4. |
| 22 | **A escolha de cookies vale por 12 meses** (`lw_consent` no `localStorage`, com data). | A ficha do CookieBanner pede de 6 a 12 meses. O prompt pede `localStorage`, e não cookie. |
| 23 | **O minificador de JS é conservador**: só remove comentários de linha inteira e a indentação. | As únicas dependências permitidas são `sharp` e `decap-server`. O JS fica com cerca de 10 KB (4 KB com gzip), abaixo da meta de 15 KB. |

## CMS (Decap)

| # | Decisão | Por quê |
| --- | --- | --- |
| 24 | **Uma única entrada, "Conteúdo da página"**, com blocos recolhíveis na ordem da página, editando o `content/site.json` inteiro. | O Decap grava o arquivo completo a cada publicação. Dividir o mesmo arquivo em várias entradas faria uma apagar os campos da outra. O teste confirmou: editar um campo pelo painel muda só aquele campo. |
| 25 | **O bloco `backend` fica ativo como `git-gateway`**, com a opção GitHub comentada logo abaixo. | O Decap recusa a configuração sem `backend`. Localmente, o `local_backend: true` tem prioridade e o `git-gateway` não é usado. Ao publicar, basta manter (Netlify) ou trocar pelo bloco comentado (GitHub). |
| 26 | **Decap CMS carregado do unpkg com versão fixa** (`decap-cms@3.16.3`). | Só o painel usa, e nunca o site público. A versão fixa evita mudanças inesperadas. |
| 27 | **Fotos enviadas pelo painel vão para `assets/uploads/`**, gravadas como `/assets/uploads/…`. O build remove a barra inicial e gera as variantes. O servidor de desenvolvimento serve `/assets/` direto da pasta do projeto. | Assim a prévia da imagem funciona no painel e o build continua processando a foto original. |
| 28 | **O Decap reordena as chaves do `site.json`** ao salvar. | Não altera nada no site: o build lê por nome de campo. Só deixa o diff do Git mais longo na primeira publicação pelo painel. |
| 29 | **Atalho `editar-site.cmd`** (Windows) instala as dependências na primeira vez, sobe site e painel e abre o navegador. | O tutorial é para leigos; um duplo clique é mais simples que o terminal. |
| 30 | **O `npm run dev` chama o `decap-server` direto pelo Node**, sem `npx` e sem shell. | Evita o aviso de segurança DEP0190 do Node 24 e uma camada a mais de processo. |

## Performance

| # | Decisão | Por quê |
| --- | --- | --- |
| 31 | **Fallbacks de fonte com métricas ajustadas** ("Inter Fallback" = Arial com `size-adjust: 106.28%`; "Source Serif 4 Fallback" = Times New Roman com `100.5%`, mais `ascent`/`descent-override`). O `site.css` redefine `--font-serif` e `--font-sans` só para inserir esses fallbacks logo após a fonte da web. | O design system pede preload só do Source Serif. Sem preload, a troca do Inter deslocava a foto do hero e o banner (CLS de 0,155). Com os fallbacks, o CLS caiu para 0. Os valores foram medidos no Chromium com `canvas.measureText` (largura de um texto em pt-BR e métricas de ascendente/descendente). No Android, sem Arial nem Times, vale o restante da pilha original. |
| 32 | **Leituras de layout no JS:** a do `scrollY` do header foi adiada para o `requestAnimationFrame`. A medição do banner para posicionar o botão flutuante continua síncrona. | A leitura do `scrollY` logo após montar o título forçava um reflow de cerca de 130 ms (CPU 4x). A do banner custa cerca de 4 ms, mas adiá-la fazia o botão "pular" (CLS de 0,027). |
| 33 | **A seção "Movimento reduzido" do `components.css` vai no CSS crítico e de novo no fim do CSS externo.** | A divisão crítico/restante mudava a ordem da cascata: as regras base dos cards e do FAQ (no CSS externo) anulavam o `prefers-reduced-motion` (no CSS inline). Foi encontrado no teste final. |
| 34 | **`npm run preview` e `dist/_headers`** com brotli/gzip, cache de 1 ano para arquivos com hash, imagens e fontes, HTML revalidado e cabeçalhos de segurança. | O servidor de desenvolvimento usa `no-store` e não comprime, o que distorce o Lighthouse. O preview reproduz a hospedagem; o `_headers` vale para Netlify e Cloudflare Pages (outras: `publicacao.md`). |

## Build

- **Mini motor de templates próprio** (`scripts/lib/template.mjs`), com variáveis, `each`, `if` e parciais. O conteúdo é sempre escapado; HTML cru só entra para valores gerados pelo próprio build.
- **CSS crítico**: as seções do `components.css` acima da dobra ou fixas (base, tipografia, layout, botões, logo, header, hero, botão flutuante, banner de cookies e movimento reduzido), mais as seções `[crítico]` do `site.css`, vão inline. O restante sai em `css/site.<hash>.css`, carregado com `media="print"` e `onload`, com `<noscript>` de fallback.
- **Nomes com hash** em CSS e JS, para cache longo na hospedagem.
- **A copy de revisão e a tabela de placeholders** são geradas pelo build e, por isso, nunca ficam desatualizadas.

## Conteúdo

- O título do hero aceita uma palavra entre `*asteriscos*`, que vira `<em>` (itálico permitido pelo design system: uma palavra, um título).
- A **foto provisória** é gerada por `scripts/gerar-placeholder.mjs` (4:5, pergaminho, silhueta neutra) para que o pipeline de `srcset` já funcione de ponta a ponta.
