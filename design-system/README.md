# LW Advocacia

Design system da landing page do escritório LW Advocacia. Sóbrio, editorial e com autoridade: canvas de pergaminho, títulos em serifa peso 400, um único acento de ação (o marinho do logo) e o dourado só como ornamento.

A página será construída em **HTML semântico + CSS puro + JS vanilla mínimo**. Tudo aqui é implementável nessa stack, sem React, Tailwind ou bibliotecas de animação. Meta: PageSpeed mobile ≥ 80.

**Arquivos**

- `tokens.css`: custom properties em `:root`, com primitivos separados dos semânticos. É a fonte para a página.
- `components.css`: estilos de todos os componentes, mobile-first.
- `DESIGN.md`: regras de uso, Faça / Não faça, uso do logo e pendências.
- Prévia da composição (celular 390px e desktop 1440px): https://claude.ai/artifact/SpNVkZTFhNCDT3NwiPE7tv

Os componentes usam só tokens semânticos (`--color-text`, `--color-action`…), nunca primitivos (`--navy-900`) nem hex soltos.

## Marca

O logo e o emblema são JPEG com fundo `#172639` embutido, sem versão clara ou transparente. Por isso **o logo só aparece sobre `--color-surface-inverse` (`#172639`)**, no header e no rodapé. As regras completas e o recorte estão em `DESIGN.md` e na ficha **Header**.

Cores amostradas dos arquivos (média dos pixels da área útil): fundo `#172639` (variação de JPEG ±2), dourado `#C19D64`, cinza-azulado `#6E7881`. Mantivemos os valores de referência `#C39E65` e `#707C86`, que ficam dentro dessa variação.

## Cores

Só tema claro. O marinho aparece como superfície invertida (header, CTA final, rodapé), não como dark mode.

**Primitivos**

| Escala | Tons |
| --- | --- |
| Marinho | `navy-950 #0f1a28` · `navy-900 #172639` (logo) · `navy-800 #24384f` · `navy-700 #2c4058` · `navy-600 #3a5170` |
| Cinza-azulado | `slate-300 #a9b2ba` · `slate-500 #707c86` (logo) · `slate-600 #5a6570` |
| Dourado | `gold-200 #e9dcc3` · `gold-400 #c39e65` (logo) · `gold-600 #8a6a2e` · `gold-700 #7a5d27` |
| Pergaminho e cinzas quentes | `white` · `parchment-100 #f5f2ea` · `parchment-200 #ece7da` · `warm-300 #d9d2c3` · `warm-400 #c4bba9` · `warm-500 #8f8676` · `warm-700 #5c564b` |
| Estados | `red-50 #f6e9e6` · `red-700 #9b3d33` · `green-50 #e8efe9` · `green-700 #3f6b4f` |

**Semânticos**

| Token | Primitivo | Uso |
| --- | --- | --- |
| `--color-bg` | parchment-100 | Fundo das seções. Nunca branco puro. |
| `--color-bg-alt` | parchment-200 | Seções alternadas. |
| `--color-surface` | white | Só superfícies elevadas: card do formulário, banner de cookies, campos. |
| `--color-surface-inverse` | navy-900 | Header, CTA final, rodapé. Única superfície do logo. |
| `--color-text` | navy-900 | Texto principal. |
| `--color-text-muted` | warm-700 | Texto secundário. |
| `--color-text-inverse` / `-inverse-muted` | parchment-100 / slate-300 | Texto sobre marinho. |
| `--color-eyebrow` / `-inverse` | slate-600 / gold-400 | Eyebrows. |
| `--color-border` / `-strong` / `-input` / `-inverse` | warm-300 / warm-400 / warm-500 / navy-700 | Hairlines, hover de card, campos, divisores no marinho. |
| `--color-action` / `-hover` / `-active` / `-text` | navy-900 / navy-800 / navy-950 / white | Botão primário. Única cor de ação. |
| `--color-accent` | gold-400 | Ornamento sobre marinho. |
| `--color-accent-on-light` | gold-700 | Ornamento sobre claro: ícones, números dos passos, sublinhado de link. |
| `--color-focus` / `-inverse` | navy-900 / gold-400 | Anel de foco no claro / no marinho. |
| `--color-error` / `-bg` | red-700 / red-50 | Erro de campo e de envio. |
| `--color-success` / `-bg` | green-700 / green-50 | Envio confirmado. |

**Contraste (WCAG 2.x, calculado)**

| Par | Razão | Uso | AA |
| --- | --- | --- | --- |
| navy-900 sobre parchment-100 | 13,67 | Texto | ✓ |
| navy-900 sobre parchment-200 | 12,39 | Texto | ✓ |
| navy-900 sobre white | 15,30 | Texto no formulário | ✓ |
| warm-700 sobre parchment-100 | 6,50 | Texto secundário | ✓ |
| warm-700 sobre parchment-200 | 5,89 | Texto secundário | ✓ |
| warm-700 sobre white | 7,27 | Dicas de campo | ✓ |
| slate-600 sobre parchment-100 | 5,32 | Eyebrow | ✓ |
| slate-600 sobre parchment-200 | 4,82 | Eyebrow | ✓ |
| gold-700 sobre parchment-100 | 5,48 | Ícones, números, links | ✓ |
| gold-700 sobre parchment-200 | 4,97 | Ícones, números | ✓ |
| white sobre navy-900 | 15,30 | Botão primário | ✓ |
| white sobre navy-800 | 11,98 | Botão primário em hover | ✓ |
| parchment-100 sobre navy-900 | 13,67 | Texto no marinho | ✓ |
| slate-300 sobre navy-900 | 7,11 | Texto secundário no marinho | ✓ |
| gold-400 sobre navy-900 | 6,12 | Eyebrow e ícones no marinho | ✓ |
| red-700 sobre white / parchment-100 | 6,75 / 6,04 | Erro | ✓ |
| green-700 sobre white / parchment-100 | 6,13 / 5,48 | Sucesso | ✓ |
| warm-500 sobre white / parchment-100 | 3,60 / 3,21 | Borda de campo e botão secundário (UI, ≥ 3:1) | ✓ |
| gold-400 sobre parchment-100 | 2,23 | **Proibido** | ✗ |
| gold-600 sobre parchment-100 | 4,49 | Só ícone grande (≥ 3:1), nunca texto | — |
| slate-500 sobre parchment-100 | 3,82 | Só decorativo ou texto ≥ 24px | — |
| warm-300 sobre parchment-100 | 1,34 | Hairline decorativa, não é limite de controle | — |

O dourado do logo (`gold-400`) só existe sobre o marinho. No claro, use sempre `--color-accent-on-light`.

## Tipografia

Duas famílias, que ecoam o wordmark (serifa clássica + sans com tracking largo).

- **Títulos: Source Serif 4, peso 400.** Escolhida em vez de Cormorant Garamond pela legibilidade no celular. A Cormorant tem altura-x muito baixa e hairlines finíssimas, que somem a 400 em telas pequenas e em títulos de 28px. A Source Serif 4 tem eixo de tamanho óptico (`opsz`): em tamanho display, o contraste do traço aumenta e se aproxima do "LW" estilo Trajan; em 21–26px, o traço fica robusto. Itálico 400 opcional para uma palavra de destaque.
- **Corpo, UI, botões e rótulos: Inter 400 e 500.** Não usamos 600.

**Carregamento (no máximo 4 arquivos).** Hospede localmente 3 woff2 com subset latin (cobre o português): Source Serif 4 Roman (variável, `opsz` + 400), Source Serif 4 Italic (só se usar o itálico) e Inter variável (400–500). Use `font-display: swap` e faça preload só do Source Serif 4 Roman, que é a fonte do título do hero:

```html
<link rel="preload" href="/fonts/source-serif-4-latin.woff2" as="font" type="font/woff2" crossorigin>
```

Para protótipos, o Google Fonts serve o mesmo conjunto: `family=Inter:wght@400;500&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;1,8..60,400&display=swap`.

**Escala fluida** (mínimo em 390px, máximo em 1440px)

| Nível | Token | Mín → máx | Line-height | Tracking | Família |
| --- | --- | --- | --- | --- | --- |
| display | `--text-display` | 40 → 72px | 1.12 | -0.02em | Serif 400 |
| h1 | `--text-h1` | 34 → 56px | 1.15 | -0.02em | Serif 400 |
| h2 | `--text-h2` | 28 → 44px | 1.18 | -0.02em | Serif 400 |
| h3 | `--text-h3` | 21 → 26px | 1.25 | -0.01em | Serif 400 |
| body-lg | `--text-body-lg` | 18 → 20px | 1.6 | 0 | Inter 400 |
| body | `--text-body` | 16 → 17px | 1.65 | 0 | Inter 400 |
| body-sm | `--text-body-sm` | 14 → 15px | 1.55 | 0 | Inter 400 / 500 |
| caption | `--text-caption` | 13px | 1.45 | 0.01em | Inter 400 |
| eyebrow | `--text-eyebrow` | 12 → 13px | 1.3 | 0.14em, caixa alta | Inter 500 |

Largura de leitura: `--measure` (65ch). Títulos com `text-wrap: balance`. Títulos nunca em negrito: a autoridade vem do contraste do traço.

## Layout e grid

- Mobile-first. Breakpoints: **640px** (2 colunas de cards, ações lado a lado), **960px** (2 colunas no hero e no Sobre, nav visível, passos na horizontal), **1200px** (só ajustes finos).
- Container: `--container` 1160px + gutter. Gutter: `--gutter`, 16px no celular → 32px no desktop, somado a `env(safe-area-inset-*)`.
- Grade de 8px (`--space-1` 4px para ajustes finos). Seções: `--section-y`, 48px no celular → 80px no desktop.
- **Ritmo de fundos:** hero (`bg`) → áreas (`bg-alt`) → sobre (`bg`) → como funciona (`bg-alt`) → FAQ (`bg`) → contato/CTA final (`surface-inverse`) → rodapé (`surface-inverse`, separado por divisor `navy-700`).

## Espaço, raios, bordas e sombras

| Token | Valor | Uso |
| --- | --- | --- |
| `--radius-pill` | 9999px | Todos os botões |
| `--radius-card` | 24px | Cards e card do formulário |
| `--radius-panel` | 16px | Banner de cookies |
| `--radius-image` | 16px | Fotos e mapa |
| `--radius-input` | 12px | Campos, selo da OAB, avisos |
| `--border-width` | 1px | Toda borda é hairline |
| `--shadow-1` | duas camadas, 6–8% | Só card do formulário e banner de cookies |
| `--shadow-2` | duas camadas, 16–18% | Só botão flutuante de WhatsApp |

Cards não têm sombra: a elevação vem da borda e do contraste de superfície.

## Movimento

Tokens: `--duration-fast` 150ms, `--duration-base` 240ms, `--duration-slow` 400ms, `--ease-out` `cubic-bezier(0.2, 0.8, 0.2, 1)`, `--stagger` 60ms. Só `transform`, `opacity` e `filter`, exceto a altura do FAQ (pedida explicitamente, e com fallback).

| # | Microinteração | Implementação | Ficha |
| --- | --- | --- | --- |
| 1 | Revelação do título do hero | Palavras em `<span>`, `opacity` + `blur(8px)` + `translateY`, 400ms, 60ms entre palavras, uma vez na carga | Hero |
| 2 | Hover do card de área | `translateY(-2px)` + borda escurece, 240ms; sem tilt nem spotlight | PracticeCard |
| 3 | Abertura do FAQ | `<details>` + `::details-content` com `block-size` e `interpolate-size`; ícone gira 45° | Faq |
| 4 | Label flutuante | `:placeholder-shown` / `:focus`, `translateY` + `scale`, 150ms | ContactForm |
| 5 | Pulso único do WhatsApp | Anel dourado, 400ms, uma vez, 6s após a carga | WhatsAppFab |

**Contador numérico: removido.** A página não tem número informativo confirmado e permitido pela OAB. Se houver (anos de atuação, por exemplo), ele entra no lugar do pulso, para manter o limite de 5.

Com `prefers-reduced-motion: reduce`, revelação, elevação do card, altura do FAQ, deslize do label e pulso ficam desligados; só as mudanças de cor permanecem. Proibido: WebGL, shaders, light-rays, gradientes animados, partículas, parallax, marquee, texto embaralhado ou máquina de escrever, animação em loop e animação disparada a cada scroll.

## Ícones

Lucide em SVG inline (sprite com `<symbol>`), traço 1.5px, 20/24/32px. Mapa por área de atuação e lista de interface na ficha **Icons**. Sem martelo, sem balança, sem tribunal.

## Imagens

- **Retrato real** do(a) advogado(a): luz natural, fundo neutro ou do escritório, tratamento quente e levemente dessaturado (puxe o branco para o pergaminho, reduza a saturação em 10–15%). Nada de fundo recortado em branco.
- **Bancos gratuitos** só para ambientação: escritório, mãos, documentos, reunião. **Proibido:** martelo, balança literal, estátua da justiça, aperto de mão posado.
- **Proporções:** hero 4:3 no celular e 4:5 no desktop; Sobre 4:5; mapa 16:10. Cards de área sem foto.
- **Raio** `--radius-image` (16px) em toda foto.
- **Formatos:** `<picture>` com AVIF e WebP + JPEG de fallback; `srcset` com 480, 800 e 1200px de largura e `sizes` coerente com a coluna. `width` e `height` sempre declarados.
- **Carregamento:** `fetchpriority="high"` e sem lazy no hero; `loading="lazy"` e `decoding="async"` em tudo abaixo da dobra.
- **`alt` obrigatório**, descrevendo a pessoa ou a cena. Imagem puramente decorativa leva `alt=""`.

## Acessibilidade

- Contraste AA em todos os pares (tabela acima).
- `:focus-visible` com anel 2px: marinho no claro, dourado no marinho, marinho de novo dentro do card branco do formulário.
- Áreas de toque de no mínimo 44×44px (`--tap-min`).
- Um único `h1` (hero), `h2` por seção, `h3` em cards, passos e no nome do Sobre.
- Campos com `<label>` real; erros ligados por `aria-describedby` e `aria-invalid`.
- Funciona sem JS: FAQ com `<details>`, formulário com `action` + `method="post"` e validação nativa. O JS só melhora.
- Link "Pular para o conteúdo" antes do header.

## Componentes

Header, Hero, Button, PracticeCard, About, Steps, Faq, ContactForm, WhatsAppFab, CookieBanner, Footer, OabNotice, SectionHeader e Icons. Cada ficha traz anatomia, tokens, variações, estados, comportamento no celular e no desktop, e notas de acessibilidade.

**Fora do sistema por regra da OAB (Provimento 205/2021):** depoimentos, preços e promoções, "resultados de processos", contadores de casos e selos do tipo "melhor escritório".

## Checklist conferido

- Logo só sobre `#172639`: header e rodapé, com container de fundo `navy-900`. ✓
- Dourado nunca é fundo de botão nem texto corrido. ✓
- Títulos sem negrito (Source Serif 4 400). ✓
- Nenhuma cor vibrante: o botão de WhatsApp não usa o verde da marca. ✓
- Duas famílias de fonte, até 3 arquivos. ✓
- 5 microinterações, todas desligadas com `prefers-reduced-motion`. ✓
- Nenhum componente proibido pela OAB. ✓
- Contraste AA em todos os pares de texto e de UI. ✓
