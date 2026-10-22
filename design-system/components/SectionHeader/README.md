# SectionHeader

Cabeçalho reutilizável de seção: eyebrow em caixa alta, título em serifa e lead opcional.

**Anatomia.** `<header class="section-head">` com `.eyebrow` (p), `.t-h2` (h2) e `.section-head__lead` (p, opcional).

**Tokens.** `--text-eyebrow`, `--tracking-eyebrow`, `--color-eyebrow` (claro) / `--color-eyebrow-inverse` (marinho), `--text-h2`, `--tracking-heading`, `--leading-heading`, `--color-text-muted`, `--space-3`, `--space-10`/`--space-12`.

**Variações.**
- Padrão, alinhado à esquerda (seções de conteúdo).
- `.section-head--center` para o FAQ e o CTA final.
- Dentro de `.on-dark`, o eyebrow passa a dourado `--color-accent` e o lead a `--color-text-inverse-muted`.
- `.eyebrow--accent` usa o dourado escurecido no claro. Use em no máximo uma seção, para não diluir o acento.

**Celular e desktop.** O título encolhe pela escala fluida (28 → 44px). O espaço até o conteúdo vai de 40px a 48px a partir de 960px. O título fica com até ~44rem de largura.

**Acessibilidade.** O eyebrow é um `<p>`, não um título: a hierarquia continua sendo um único `h1` no hero e `h2` por seção. O texto do eyebrow é escrito normalmente e só fica em caixa alta pelo CSS (`text-transform`), para leitores de tela não soletrarem.
