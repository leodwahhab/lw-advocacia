# Faq

Accordion de perguntas frequentes feito com `<details>/<summary>`: pergunta em serifa, ícone `+` que gira e divisores hairline.

**Anatomia.** `div.faq` › `details.faq__item` › `summary.faq__q` (texto + `svg.icon` plus) + `div.faq__a`.

**Tokens.** `--color-border` (hairline entre itens), `--font-serif` 18–20px, `--color-accent-on-light` (ícone), `--color-action-hover` (pergunta no hover), `--color-text-muted` (resposta), `--measure`, `--duration-base`, `--ease-out`.

**Microinteração 3: abertura.** A altura anima via `::details-content` com `block-size: 0 → auto` e `interpolate-size: allow-keywords` (240ms). O ícone gira 45° e vira um ×. Em navegadores sem suporte, o item abre sem animação, o que é aceitável. Com movimento reduzido, nada anima.

**Estados.** Fechado, aberto, hover (pergunta em marinho mais claro), focus-visible (anel marinho no `summary`).

**Celular e desktop.** Mesma estrutura; largura máxima 48rem, centralizada pelo container da seção. A área de toque do `summary` tem no mínimo 44px de altura.

**Acessibilidade.** Funciona sem JS. Não use `name` para fechar os outros itens automaticamente: a pessoa pode querer comparar respostas. O `summary` já é focável e anunciado como expansível.
