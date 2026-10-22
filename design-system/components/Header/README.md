# Header

Barra sticky sobre `#172639` com o logo à esquerda, até 4 âncoras e o CTA de contato à direita.

**Anatomia.** `<header class="site-header on-dark">` › `.container.site-header__inner` › `a.logo` (img) + `nav.site-nav` + `a.btn.btn--inverse.btn--sm`.

**Tokens.** `--color-surface-inverse` (= `navy-900`, `#172639`, o fundo exato do JPEG), `--header-h` (64px; 76px a partir de 960px), `--color-text-inverse-muted` (links), `--color-accent` (sublinhado no hover), `--color-border-inverse` (filete após rolar), `--z-header`.

**Container do logo.** O JPEG 1376×768 tem margem azul embutida. O `.logo` recorta a área útil + 16px (x 236–1132, y 212–556), com `aspect-ratio: 896 / 344`, `overflow: hidden` e fundo `navy-900`. A imagem fica com `width: 153.571%`, `margin-left: -26.339%` e `margin-top: -23.661%`. Altura 40px no celular e 48px no desktop. Nunca use `object-fit: contain` com fundo de outra cor: a emenda aparece.

**Variações e estados.**
- Default: sem borda. Depois de 8px de rolagem, o JS adiciona `.is-scrolled` e surge um filete `navy-700`. A transição é só de cor (240ms).
- Links: cinza-azulado claro; no hover, pergaminho com sublinhado dourado; foco com anel dourado.

**Celular e desktop.** Abaixo de 960px, só logo e CTA, sem menu. A partir de 960px, as âncoras aparecem (gap 32px). O header usa `top: env(safe-area-inset-top)`.

**Acessibilidade.** O link do logo leva `aria-label="LW Advocacia, página inicial"` e a imagem `alt=""` (o nome já está no link). O `nav` leva `aria-label`. Adicione um link "Pular para o conteúdo" antes do header.
