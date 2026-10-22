# Prompt — Design System da landing page LW Advocacia

> Uso: cole este prompt no Claude (claude.ai → Design System) e anexe os dois arquivos de marca:
> `assets/lw-advocacia-logo-wordmark.jpg` e `assets/lw-advocacia-emblema.jpg`.

---

## Papel e objetivo

Você é um designer de sistemas visuais sênior. Crie o **design system** da landing page do escritório **LW Advocacia**. Eu mesmo vou construir a página depois, em **HTML semântico + CSS puro + JS vanilla mínimo** (sem React, Tailwind ou bibliotecas de animação). Por isso, tudo o que você definir precisa ser implementável nessa stack.

O escopo é **só visual**: tokens, tipografia, cores, espaçamento, componentes, estados, movimento, iconografia e diretrizes de imagem. Não escreva os textos da página. Use textos de exemplo neutros e curtos.

## Contexto do projeto

- A landing page de um escritório de advocacia recebe tráfego de anúncios e do perfil no Google. O objetivo é transmitir credibilidade e gerar contatos qualificados, via WhatsApp, formulário e telefone.
- Prioridade para o **celular** (mobile-first). A meta é **PageSpeed mobile ≥ 80**: fontes enxutas, nenhuma dependência pesada, animações baratas (só `transform`, `opacity` e `filter`).
- O tom deve ser sóbrio, elegante e com autoridade, **sem aparência de template genérico**, sem cores vibrantes e sem excesso de animação.
- Respeite as regras de publicidade da OAB (Provimento 205/2021). O sistema **não terá** componentes de depoimento, de preço ou promoção, nem de "resultados de processos" ou selos do tipo "melhor escritório".

## Marca (arquivos anexos)

- **Logo horizontal** (`lw-advocacia-logo-wordmark.jpg`, JPEG 1376×768, opaco). À esquerda, um emblema monoline: escudo, balança da justiça e monograma LW. À direita, o wordmark em duas linhas: "LW" em serifa clássica dourada (estilo Trajan) e "ADVOCACIA" em sans geométrica, caixa alta, tracking largo e duas cores (cinza-azulado e dourado). A área útil fica em x 252–1116, y 228–540, e o restante é margem azul.
- **Emblema** (`lw-advocacia-emblema.jpg`, JPEG 1024×1024, opaco): só o símbolo. Use-o como favicon e avatar, recortado.
- **Restrição técnica importante:** os dois arquivos são **JPEG com fundo azul-marinho embutido** e não existe versão clara nem transparente. O logo **só pode aparecer sobre superfícies exatamente `#172639`**, que são o header e o rodapé, para a emenda não aparecer. Ele **nunca** vai sobre fundo claro. Especifique o container do logo (cor exata, `object-fit`, recorte) e registre "vetorizar o logo e criar versão clara" como pendência futura, fora deste escopo.
- **Antes de fixar os tokens, amostre os hex exatos dos arquivos anexos.** Valores medidos como ponto de partida:
  - Azul-marinho (fundo do logo): `#172639`
  - Dourado: `#C39E65`
  - Cinza-azulado: `#707C86`

## Direção visual (referências: Monad e Steep)

Herde destas duas referências editoriais a linguagem abaixo, adaptada à advocacia:

- **Canvas quente:** as seções de conteúdo usam um off-white pergaminho (ponto de partida `#F5F2EA`), **nunca branco puro** como fundo de página. O branco fica reservado para superfícies elevadas, como o card do formulário.
- **Títulos em serifa peso 400**, nunca negrito, com tracking negativo (≈ -0.02em) e line-height ≈ 1.15–1.2. A serifa carrega autoridade pelo contraste do traço, não pelo peso.
- **Botões em pílula** (`border-radius: 9999px`).
- **Bordas hairline** de 1px em cinza quente para cards, divisores e itens do FAQ.
- **Cards** com raio de 24px e **sem sombra**. A elevação vem de borda e contraste de superfície. Sombra suave só no card do formulário e no botão flutuante de WhatsApp.
- **Respiro generoso:** grade de 8px, seções com 64–80px de espaçamento vertical no desktop e 48–56px no celular.
- **Um único acento cromático funcional:** o azul-marinho é a cor de ação (botão primário). O dourado é só ornamento: filetes, ícones, numeração dos passos e o sublinhado de links em hover. Nunca é fundo de botão nem texto corrido.

## Paleta (tokens semânticos obrigatórios)

Monte a paleta a partir de marinho, cinza-azulado, dourado e pergaminho, com tokens **semânticos** (`--color-bg`, `--color-surface`, `--color-surface-inverse`, `--color-text`, `--color-text-muted`, `--color-border`, `--color-action`, `--color-action-hover`, `--color-accent`, `--color-accent-on-light`, `--color-focus`, `--color-error`, `--color-success`) mapeados para uma escala primitiva de cada cor.

- Inclua um **dourado escurecido para uso sobre fundo claro** (ponto de partida ≈ `#8A6A2E`), porque `#C39E65` sobre pergaminho tem contraste ≈ 2,3:1.
- Defina a escala de cinzas **quentes** para bordas e texto secundário.
- **Valide WCAG AA** em todos os pares texto/fundo usados (4,5:1 para texto normal, 3:1 para texto grande e componentes de UI) e apresente uma tabela de contraste.
- Inclua cores de erro e sucesso dessaturadas, coerentes com a sobriedade da paleta.
- Só tema claro. O azul-marinho aparece como superfície invertida, não como dark mode.

## Tipografia

O sistema usa duas famílias, que ecoam o wordmark (serifa clássica + sans com tracking largo):

- **Títulos:** uma serifa do Google Fonts próxima da serifa do "LW". Escolha entre **Cormorant Garamond** e **Source Serif 4** e justifique a escolha, considerando legibilidade no celular. Use só peso 400; um itálico é opcional para uma palavra de destaque.
- **Corpo, UI, botões e rótulos:** **Inter**, nos pesos 400 e 500 (600 só se for indispensável).
- **Eyebrows** (rótulos acima dos títulos de seção, como "ÁREAS DE ATUAÇÃO" e "COMO FUNCIONA"): Inter em caixa alta, 12–13px, tracking largo (≈ 0.12–0.16em), em cinza-azulado ou dourado escurecido. É o eco do "ADVOCACIA" do logo.
- Use no máximo **2 famílias e 4 arquivos de fonte**, com `font-display: swap`, preload da fonte do título do hero e subset latin.
- Entregue uma **escala tipográfica fluida** com `clamp()`, nos níveis display, h1, h2, h3, body-lg, body, body-sm, caption e eyebrow. Para cada nível, indique tamanho mínimo e máximo, line-height e tracking. O corpo tem no mínimo 16px no celular, e a largura de leitura fica em ~65ch.

## Layout e grid

- Mobile-first, com breakpoints sugeridos em 640, 960 e 1200px. Container máximo ≈ 1120–1200px e gutter lateral de 16px no celular.
- Defina tokens de espaçamento (escala de 4/8px), de raio (pílula, card 24px, input 12–16px, imagem 12–16px), de borda e de sombra (no máximo 2 níveis).
- Defina o ritmo entre seções e a alternância de fundos: pergaminho / superfície levemente mais escura / bloco azul-marinho para o CTA final e o rodapé.

## Componentes (especificar todos, com anatomia, tokens, variações e estados)

Para cada componente, documente: anatomia, tokens usados, variações, estados (**default, hover, focus-visible, active, disabled, erro** quando aplicável), comportamento no celular e no desktop, e notas de acessibilidade.

1. **Header:** sobre `#172639`, com logo horizontal à esquerda, CTA de contato à direita e no máximo 3–4 âncoras. No celular, só logo e CTA (ou menu simples). Fica sticky com transição discreta.
2. **Hero:** título de impacto, subtítulo, CTA primário (contato) e secundário (WhatsApp ou telefone), e foto profissional. Especifique as composições do celular (foto abaixo ou recortada) e do desktop (2 colunas).
3. **Botões:** primário (marinho), secundário (ghost com borda), botão WhatsApp e link com seta (→). Área de toque mínima de 44×44px.
4. **Card de área de atuação:** ícone de traço fino em dourado, título em serifa e descrição curta. Grade de 1 coluna no celular, 2 no tablet e 3 no desktop.
5. **Bloco "Sobre o escritório e o(a) advogado(a)":** foto, nome, formação, **número da OAB em destaque legível** e lista de diferenciais.
6. **Passo a passo (4 etapas):** contato, análise do caso, estratégia e acompanhamento. Números ou ícones em dourado, ligados por uma linha. Vertical no celular, horizontal no desktop.
7. **FAQ / accordion:** baseado em `<details>/<summary>`, com pergunta em serifa, ícone de expandir e divisores hairline.
8. **Formulário de contato:** campos nome, telefone, e-mail e descrição do caso (textarea), mais o **checkbox de consentimento LGPD** com link para a Política de Privacidade. Fica em card branco elevado. Especifique labels flutuantes, mensagens de erro inline, estados de envio (loading, sucesso, erro) e o tipo de teclado de cada campo no celular.
9. **Botão flutuante de WhatsApp:** fixo no canto inferior direito, respeitando `safe-area-inset`. Não pode cobrir o banner de cookies nem o botão de envio do formulário.
10. **Banner de cookies (LGPD):** discreto, fixo no rodapé da tela, com ações "Aceitar", "Recusar" e "Preferências".
11. **Rodapé:** sobre `#172639`, com logo, endereço, área do mapa (placeholder com carregamento preguiçoso), redes sociais, nome do(a) advogado(a) com OAB e link para a Política de Privacidade.
12. **Aviso informativo OAB:** linha discreta no rodapé informando o caráter informativo da página.
13. **Eyebrow + título de seção:** padrão reutilizável de cabeçalho de seção.
14. **Ícones:** **Lucide**, como SVG inline, com traço de 1.5px, tamanhos de 20/24/32px e cor dourada sobre o escuro ou dourado escurecido sobre o claro. Liste o ícone sugerido para cada área de atuação genérica (família, trabalhista, cível, previdenciário, consumidor, empresarial). Evite clichês como martelo e balança.

## Movimento (máximo de 5 microinterações)

Reimplemente em **CSS puro e JS vanilla** (IntersectionObserver), **sem React, sem framer-motion e sem dependências**, os conceitos destes componentes de referência:

| Microinteração | Referência de movimento | Implementação esperada |
|---|---|---|
| Revelação do título do hero | Spell UI `blur-reveal` (https://spell.sh/docs/blur-reveal) | `opacity` + `filter: blur()` + `translateY`, com escalonamento por palavra ou linha, uma única vez no carregamento |
| Hover dos cards de área de atuação | Spell `tilt-card` **sem o 3D** / Cult UI `minimal-card` | elevação sutil (`translateY(-2px)`) + borda que escurece; nada de tilt nem spotlight |
| Abertura do FAQ | Cult UI `expandable` | `<details>` com altura animada (`grid-template-rows: 0fr → 1fr` ou `interpolate-size`) e ícone girando |
| Campos do formulário | Spell UI `label-input` (https://spell.sh/docs/label-input) | label flutuante via `:placeholder-shown` / `:focus-within` |
| Contador numérico (opcional) | Cult UI `rolling-number` | **só se houver número informativo permitido pela OAB** (ex.: anos de atuação); se não houver, remova |

Regras de movimento:

- Durações entre 150 e 400ms, com easing `cubic-bezier(0.2, 0.8, 0.2, 1)` ou similar. Defina tokens de duração e de easing.
- Nada de animação em loop contínuo. O botão de WhatsApp pode ter **um único** pulso discreto após alguns segundos e para de animar depois disso.
- Respeite `prefers-reduced-motion: reduce`, que desliga as revelações e mantém só as mudanças de cor.
- **Proibido:** WebGL, shaders, light-rays, gradientes animados, partículas, parallax, marquee, texto embaralhado ou máquina de escrever, e animações disparadas a cada scroll.

## Imagens

- Use um retrato real do(a) advogado(a), com luz natural, fundo neutro ou do escritório, e tratamento de cor quente e levemente dessaturado, coerente com a paleta.
- Bancos gratuitos só para ambientação (escritório, mãos, documentos, reunião). **Proibido:** martelo, balança literal, estátua da justiça e apertos de mão posados.
- Especifique proporções (hero, sobre, cards se houver), raio, `alt` obrigatório, formatos AVIF/WebP com `srcset`, `loading="lazy"` abaixo da dobra e `fetchpriority="high"` na imagem do hero.

## Acessibilidade

Exija contraste WCAG AA, `:focus-visible` com anel visível em marinho ou dourado conforme o fundo, áreas de toque de 44px e hierarquia de títulos semântica (um único `h1`). Os campos precisam de labels reais e erros associados por `aria-describedby`. A página precisa funcionar sem JS: FAQ com `<details>` e formulário com fallback.

## Entregáveis

1. **Design system** (página de referência navegável) com todas as seções acima: paleta com tabela de contraste, escala tipográfica, espaçamentos, raios, sombras, tokens de movimento, todos os componentes em todos os estados, e exemplos no celular e no desktop.
2. **`tokens.css`**: custom properties em `:root`, separando primitivos de semânticos e com nomes em inglês (`--color-*`, `--font-*`, `--text-*`, `--space-*`, `--radius-*`, `--shadow-*`, `--duration-*`, `--ease-*`).
3. **`DESIGN.md`**: regras de uso em português, com uma seção **"Faça / Não faça"** no estilo das referências Monad e Steep, regras de uso do logo e a lista de pendências (vetorização do logo, versão clara).
4. **Uma prévia da composição da landing** (hero → áreas de atuação → sobre → como funciona → FAQ → formulário → rodapé) aplicando o sistema, em celular (390px) e desktop (1440px), com textos de exemplo neutros.

Antes de finalizar, confira a página contra este checklist e corrija o que falhar:

- logo só sobre `#172639`;
- dourado nunca como fundo de botão nem texto corrido;
- títulos sem negrito;
- nenhuma cor vibrante;
- no máximo 2 famílias de fonte;
- no máximo 5 animações, todas desligadas com `prefers-reduced-motion`;
- nenhum componente proibido pela OAB;
- contraste AA em todos os pares.
