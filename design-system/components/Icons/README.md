# Icons

Ícones Lucide em SVG inline, com traço de 1.5px, em dourado sobre o marinho ou em dourado escurecido sobre o claro.

**Regras.** `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="1.5"`, pontas e junções arredondadas (classe `.icon`). Tamanhos: 20px (botões, listas, links), 24px (padrão), 32px (cards de área). Cor por `currentColor`: `.icon--accent` aplica `--color-accent-on-light` no claro e `--color-accent` dentro de `.on-dark`. Decorativo leva `aria-hidden="true"`; ícone sozinho num controle precisa de `aria-label` no controle.

**Áreas de atuação.**

| Área | Ícone | Por quê |
| --- | --- | --- |
| Família | `users-round` | Pessoas, sem clichê de casal ou coração |
| Trabalhista | `briefcase` | Trabalho, sem ferramentas ou capacetes |
| Cível | `file-text` | Contratos e documentos |
| Previdenciário | `calendar-clock` | Tempo de contribuição |
| Consumidor | `shopping-bag` | Relação de compra |
| Empresarial | `building-2` | Empresa |

**Interface.** `message-circle` (WhatsApp; o Lucide não tem marcas), `phone`, `mail`, `map-pin`, `arrow-right`, `check`, `plus` (FAQ), `circle-alert` (erro), `circle-check` (sucesso), `instagram` e `linkedin` (rodapé).

**Evite.** `gavel` (martelo), `scale` (balança), `landmark` (tribunal) e `handshake`. A balança já está no emblema; repetir vira clichê.

**Performance.** Copie só os SVGs usados para um `<svg>` sprite inline no topo do `<body>` (`<symbol id="i-...">` + `<use href="#i-...">`). Não carregue o pacote do Lucide.
