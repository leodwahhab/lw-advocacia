# Footer

Rodapé sobre `#172639` com logo, nome e OAB, contatos, mapa sob demanda, redes sociais, Política de Privacidade e o aviso informativo da OAB.

**Anatomia.** `footer.site-footer.on-dark` › `.container` › `.site-footer__grid` (3 colunas: marca, contato, mapa) + `.site-footer__bottom` (aviso OAB + links legais).

**Tokens.** `--color-surface-inverse`, `--color-text-inverse`, `--color-text-inverse-muted` (endereço, 7,1:1), `--color-accent` (ícones), `--color-border-inverse` (divisor e contorno das redes), `--radius-image` (mapa), `--text-body-sm`, `--text-caption`.

**Mapa.** Nunca carregue o iframe do Google Maps na abertura da página: ele pesa e derruba o PageSpeed. O `.map-slot` mostra uma imagem estática leve (ou o placeholder) com o botão "Ver no mapa". O iframe só é criado ao clicar, ou quando o slot entra na tela (IntersectionObserver com `rootMargin: 200px`). Sem JS, o link abre o Google Maps em nova aba.

**Logo.** `.logo.logo--footer` (56px de altura), mesmo recorte do header. O fundo do rodapé é exatamente `#172639`, então a emenda do JPEG não aparece.

**Celular e desktop.** Celular: colunas empilhadas, gap 40px. Desktop (≥ 960px): 4fr / 3fr / 5fr; a faixa de baixo divide aviso e links em duas colunas.

**Acessibilidade.** Endereço em `<address>`. Ícones de rede com `aria-label` no link. Telefone e e-mail aparecem como texto selecionável, com `tel:` e `mailto:` como conveniência.
