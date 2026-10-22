# Steps

Passo a passo em 4 etapas (contato, análise do caso, estratégia, acompanhamento), com números em dourado ligados por uma linha.

**Anatomia.** `ol.steps` › `li.steps__item` › `span.steps__num` (círculo 40px) + `h3.steps__title` + `p.steps__text`. A linha é o `::after` de cada item, exceto o último.

**Tokens.** `--color-accent-on-light` (borda e número, 5,5:1), `--color-accent` (linha, decorativa), `--font-serif` (número), `--text-h3`, `--text-body-sm`, `--color-text-muted`, `--space-8`.

**Celular e desktop.** Celular: lista vertical, número à esquerda e linha vertical ligando os círculos. Desktop (≥ 960px): 4 colunas, número acima e linha horizontal entre os círculos.

**Estados.** Estático. Sem animação de desenho da linha, para manter o limite de 5 microinterações.

**Acessibilidade.** A ordem vem do `<ol>`, por isso o número visual leva `aria-hidden="true"`. Títulos `h3`.
