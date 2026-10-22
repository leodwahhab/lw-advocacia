# ContactForm

Formulário de contato em card branco elevado: nome, telefone, e-mail, descrição do caso e consentimento LGPD, com labels flutuantes e erros inline.

**Anatomia.** `.form-card` › `form.form` › `.field` (input/textarea `.field__control` + `label.field__label` + `.field__hint` / `.field__error`) · `.consent` (checkbox + label com link) · `button.btn--primary.btn--block` · `.form-status` (região de retorno).

**Tokens.** `--color-surface` (único branco da página), `--shadow-1`, `--radius-card` (card), `--radius-input` (campos), `--color-border-input` (3,6:1 no branco), `--color-focus`, `--color-error` / `--color-error-bg`, `--color-success` / `--color-success-bg`, `--duration-fast`.

**Campos e teclado no celular.**

| Campo | Tipo | `inputmode` | `autocomplete` |
| --- | --- | --- | --- |
| Nome | `text` | — | `name` |
| Telefone | `tel` | `tel` | `tel` |
| E-mail | `email` | `email` | `email` |
| Descrição do caso | `textarea` | — | `off` |

Fonte de 16px nos campos para o iOS não dar zoom.

**Microinteração 4: label flutuante.** Cada campo tem `placeholder=" "`. Quando ele tem foco ou deixa de mostrar o placeholder (`:not(:placeholder-shown)`), o label sobe e encolhe (`translateY(-9px) scale(.78)`, 150ms). Com movimento reduzido, o label muda de posição sem transição.

**Estados.** Default, hover (borda marinho), focus (borda + anel 1px marinho), preenchido, erro (borda e label em `red-700` + mensagem com ícone `circle-alert`), disabled. Envio: loading (botão com `aria-busy`, rótulo "Enviando…"), sucesso (`role="status"`) e erro (`role="alert"`, sugere o WhatsApp como alternativa).

**Validação.** Valide no `blur` e no envio, nunca a cada tecla. Ao enviar com erros, mova o foco para o primeiro campo inválido. A mensagem diz o que corrigir.

**Celular e desktop.** Uma coluna no celular; telefone e e-mail lado a lado a partir de 640px. Padding do card: 24px → 40px.

**Acessibilidade.** Labels reais (`<label for>`), nunca só placeholder. Erros ligados por `aria-describedby` e `aria-invalid="true"`. O consentimento LGPD não vem marcado e tem área de toque de 44px.

**Sem JS.** O form tem `action` e `method="post"` para um endpoint do servidor e usa `required` nativo. O JS só melhora (envio assíncrono e mensagens).
