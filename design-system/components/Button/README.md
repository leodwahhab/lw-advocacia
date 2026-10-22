# Button

Botões em pílula com uma única cor de ação, o marinho; o dourado nunca é fundo de botão.

**Anatomia.** `.btn` + variação. Ícone Lucide opcional à esquerda (20px), rótulo em Inter 500, 14–15px. Altura mínima 48px (`.btn--sm`: 44px). `.link-arrow` é texto + seta.

**Tokens.** `--radius-pill`, `--color-action`, `--color-action-hover`, `--color-action-active`, `--color-action-text`, `--color-border-input`, `--color-bg-alt`, `--color-accent-on-light` (ícones e sublinhado), `--color-focus`, `--duration-fast`, `--ease-out`.

**Variações.**
- `.btn--primary`: marinho, texto branco (15,3:1). Uma ação principal por bloco: contato.
- `.btn--secondary`: ghost com borda `warm-500` (3,2:1 no pergaminho). Telefone e ações de apoio.
- `.btn--whatsapp`: superfície branca, borda e ícone `message-circle` em dourado escurecido. Sem verde do WhatsApp: o ícone e o rótulo bastam para reconhecer.
- `.btn--inverse`: pergaminho sobre marinho, para o CTA final e o header.
- `.link-arrow`: sublinhado transparente que vira dourado no hover.

**Estados.** Default, hover (`:hover`), focus-visible (anel 2px marinho, offset 3px; dourado sobre marinho), active (marinho mais escuro), disabled (`warm-300` + texto `warm-700`, `cursor: not-allowed`) e loading (`aria-busy="true"` + `aria-disabled="true"`, rótulo "Enviando…"; sem spinner girando, porque animação em loop é proibida). Só a cor muda entre estados.

**Celular e desktop.** No hero do celular, os dois botões dividem a linha (`flex: 1 1 12rem`) e quebram para baixo se faltar espaço. A partir de 640px, largura pelo conteúdo. Área de toque nunca menor que 44×44px.

**Acessibilidade.** Use `<a>` para navegar (WhatsApp, telefone, âncoras) e `<button>` para ações. Ícone decorativo leva `aria-hidden="true"`. O link do WhatsApp abre em nova aba com `rel="noopener"` e avisa no rótulo ou em `.visually-hidden` ("abre o WhatsApp").
