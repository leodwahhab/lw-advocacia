# Hero

Abertura da página: eyebrow, título display com revelação por palavra, subtítulo, dois CTAs e o retrato do(a) advogado(a).

**Anatomia.** `section.hero` › `.container.hero__grid` › `.hero__copy` (eyebrow, `h1.t-display.reveal`, `.hero__lead`, `.hero__actions`, `.hero__meta`) + `figure.hero__media` (img).

**Tokens.** `--text-display` (40 → 72px), `--leading-display`, `--tracking-heading`, `--text-body-lg`, `--color-text-muted`, `--radius-image`, `--space-10`/`--space-16`, `--duration-slow`, `--stagger`, `--ease-out`.

**Composição.**
- Celular (390px): uma coluna. Texto primeiro, foto abaixo em 4:3 com `object-position: 50% 25%` (rosto no terço superior). Os dois botões dividem a largura.
- Desktop (≥ 960px): duas colunas 7fr / 5fr, gap 64px, foto em 4:5. Padding vertical 64 / 80px.

**Microinteração 1: revelação do título.** Na carga, o JS envolve cada palavra em `<span class="w" style="--i:n">` e adiciona `.is-ready`. Cada palavra anima `opacity` 0 → 1, `filter: blur(8px)` → 0 e `translateY(.25em)` → 0, em 400ms, com 60ms de atraso entre palavras. Roda uma única vez. Sem JS, o título aparece direto. Com `prefers-reduced-motion: reduce`, não anima.

**Imagem.** `<img fetchpriority="high" decoding="async">` com AVIF/WebP via `<picture>` e `srcset` (480, 800, 1200 px de largura). Nunca `loading="lazy"` no hero. `alt` descreve a pessoa ("Retrato de [nome], advogado(a)").

**Acessibilidade.** Único `h1` da página. O título ganha `aria-label` com o texto inteiro, para o leitor de tela não ler palavra por palavra. CTAs com rótulos que dizem o destino.

**Não use.** Contadores de casos, "resultados", selos de premiação ou depoimentos (Provimento 205/2021).
