# About

Bloco "Sobre o escritório e o(a) advogado(a)": foto, nome, formação, número da OAB em destaque e lista de diferenciais.

**Anatomia.** `.about` › `figure.about__media` + `.about__body` (section-head, `h3.about__name`, `.about__role`, `p.oab-id`, parágrafo `.prose`, `ul.check-list`).

**Tokens.** `--radius-image`, `--color-border-strong` e `--color-surface` (selo da OAB), `--radius-input`, `--text-body-lg` + peso 500 + `tabular-nums` (número da OAB), `--color-accent-on-light` (ícone `check`), `--space-6`, `--space-16`.

**Selo da OAB.** Rótulo "Inscrição na OAB" em caption + número em 18–20px, peso 500, sobre superfície branca com borda. É o dado mais importante do bloco para a credibilidade, então nunca vai em cinza claro nem em fonte pequena. Formato: `OAB/UF 000.000`.

**Diferenciais.** Fatos verificáveis sobre o atendimento (formato, horário, região). Nada de "o melhor", "100% de êxito" ou números de casos ganhos.

**Celular e desktop.** Celular: foto (até 28rem, 4:5) acima do texto. Desktop (≥ 960px): duas colunas 5fr / 7fr, gap 64px. A seção usa `.section--alt` para alternar o fundo.

**Acessibilidade.** Nome como `h3`. A foto tem `alt` com o nome. `loading="lazy"` e `decoding="async"` (está abaixo da dobra).
