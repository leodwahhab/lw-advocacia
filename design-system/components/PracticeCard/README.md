# PracticeCard

Card de área de atuação: ícone de traço fino em dourado, título em serifa, descrição curta e link com seta que cobre o card.

**Anatomia.** `article.practice-card` › `svg.icon.icon--32.practice-card__icon` + `h3.t-h3` + `p.practice-card__text` + `a.link-arrow` (o `::after` do link cobre o card inteiro, então o card todo é clicável e só há um link no foco).

**Tokens.** `--radius-card` (24px), `--color-border` → `--color-border-strong` no hover, `--color-accent-on-light` (ícone), `--text-h3`, `--text-body-sm`, `--color-text-muted`, `--space-6` / `--space-8`, `--duration-base`, `--ease-out`. Sem sombra.

**Variações.** Sobre `--color-bg`, fundo transparente. Dentro de `.section--alt`, o card ganha fundo `--color-bg` para destacar do pergaminho escurecido.

**Microinteração 2: hover.** `translateY(-2px)` + borda que escurece, 240ms. Também em `:focus-within`. Sem tilt, sem spotlight, sem sombra. Com movimento reduzido, só a borda muda.

**Estados.** Default, hover, focus-visible (anel marinho em volta do card, via o link), active (igual ao hover). Não há disabled.

**Grade.** `.card-grid`: 1 coluna no celular, 2 a partir de 640px, 3 a partir de 960px. Gap 16 → 24px. Prefira 3 ou 6 áreas, para a última linha não ficar com um card sozinho.

**Acessibilidade.** Títulos `h3` dentro da seção `h2`. Ícone `aria-hidden`. O rótulo do link precisa fazer sentido sozinho: "Saiba mais sobre Direito de Família" (o trecho extra pode ir em `.visually-hidden`).
