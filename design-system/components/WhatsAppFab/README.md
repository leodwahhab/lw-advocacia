# WhatsAppFab

Botão circular fixo no canto inferior direito que abre a conversa no WhatsApp; marinho com anel dourado, para se separar tanto do pergaminho quanto do rodapé.

**Anatomia.** `a.fab` (56×56px) › `svg.icon` `message-circle` (24px). O `::after` é o anel do pulso.

**Tokens.** `--color-surface-inverse`, `--color-accent` (borda e anel), `--color-action-hover`, `--shadow-2`, `--z-fab`, `--space-4` (16px do canto no celular) / `--space-8` (32px no desktop), `--duration-slow`.

**Posição.** `right` e `bottom` somam o respiro com `env(safe-area-inset-right/bottom)`. A variável `--fab-offset` empurra o botão para cima:
- **Banner de cookies visível:** o JS mede a altura do banner e define `--fab-offset` com ela + 12px. Quando o banner some, volta a 0.
- **Formulário em tela:** um IntersectionObserver observa o botão de envio do formulário. Enquanto ele está visível, o FAB recebe `hidden`, para nunca cobrir o envio.

**Microinteração 5: pulso único.** 6 segundos após a carga, o JS adiciona `.is-pulsing` uma única vez: o anel dourado cresce para 1,35× e some em 400ms. Não se repete. Com movimento reduzido, não pulsa.

**Estados.** Default, hover (`navy-800`), focus-visible (anel marinho 2px, offset 3px), oculto (`hidden`).

**Acessibilidade.** `aria-label="Conversar no WhatsApp"` (o botão não tem texto visível). Abre em nova aba com `rel="noopener"`. O link `wa.me` leva uma mensagem inicial neutra, sem dados da pessoa.
