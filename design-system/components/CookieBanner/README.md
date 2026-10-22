# CookieBanner

Aviso de cookies LGPD discreto, fixo na base da tela, com Aceitar, Recusar e Preferências.

**Anatomia.** `section.cookie` (`role="region"`, `aria-label`) › `p` (texto + link para a Política de Privacidade) + `.cookie__actions` (`btn--primary` Aceitar, `btn--secondary` Recusar, `button.cookie__prefs` Preferências).

**Tokens.** `--color-surface`, `--color-border`, `--radius-panel` (16px), `--shadow-1`, `--text-body-sm`, `--z-cookie`, `--space-3` (distância das bordas).

**Regras.**
- Aceitar e Recusar têm o mesmo tamanho e a mesma altura. Recusar não pode ser mais difícil que aceitar.
- Nenhum cookie não essencial (Analytics, pixels de anúncio) carrega antes do aceite.
- O banner não bloqueia a página nem escurece o fundo.
- Enquanto visível, empurra o botão flutuante de WhatsApp para cima (`--fab-offset`).

**Celular e desktop.** Celular: ocupa a largura, com 12px de margem das bordas e da safe area; as ações quebram em linha. A partir de 640px: canto inferior esquerdo, até 34rem de largura, longe do botão de WhatsApp (que fica à direita).

**Estados.** Visível, oculto (após escolha, salva em cookie próprio por 6–12 meses). Os botões têm os estados padrão do Button. "Preferências" abre um painel com categorias (essenciais travado em ligado, medição e marketing desligados por padrão).

**Acessibilidade.** Não rouba o foco ao aparecer. Fica no fim do DOM, mas é alcançável por teclado. Depois da escolha, devolve o foco para onde estava.
