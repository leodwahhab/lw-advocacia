# Regras de uso

Como aplicar o sistema na landing da LW Advocacia. Tokens e componentes estão no README e nas fichas; aqui ficam as decisões que valem para a página inteira.

## Princípios

1. **Autoridade pela tipografia, não pelo peso.** Serifa 400, tracking negativo, muito espaço em volta.
2. **Uma cor de ação.** O marinho leva a pessoa ao contato. Todo o resto é neutro.
3. **O dourado é joia, não tinta.** Aparece em filetes, ícones, números e sublinhados. Nunca preenche uma área.
4. **Bordas, não sombras.** Hairline de 1px separa áreas. Sombra só no formulário e no botão flutuante.
5. **Celular primeiro, leve sempre.** Nada que derrube o PageSpeed mobile abaixo de 80.

## Faça / Não faça

| Faça | Não faça |
| --- | --- |
| Use `--color-bg` (pergaminho) como fundo das seções. | Usar branco puro como fundo de página. |
| Reserve o branco para superfícies elevadas: formulário, banner de cookies. | Colocar cards de área em branco sobre pergaminho. |
| Títulos em Source Serif 4 peso 400, com `--tracking-heading`. | Títulos em negrito, em caixa alta ou em Inter. |
| Uma palavra em itálico no título do hero, se fizer sentido. | Itálico em frases inteiras ou em mais de um título por tela. |
| Botões sempre em pílula (`--radius-pill`). | Botões quadrados ou com raio de card. |
| Botão primário em marinho, um por bloco. | Botão com fundo dourado, ou dois primários lado a lado. |
| Dourado sobre marinho (`--color-accent`) ou dourado escurecido sobre claro (`--color-accent-on-light`). | `#C39E65` sobre pergaminho (2,2:1) ou dourado em texto corrido. |
| Eyebrow curto em caixa alta, 12–13px, tracking 0.14em. | Eyebrow com mais de 4 palavras, ou eyebrow sem título abaixo. |
| Cards com raio de 24px, hairline e sem sombra. | Sombras em cards, gradientes, bordas grossas ou barra colorida na lateral. |
| Seções com 48–56px de respiro no celular e 64–80px no desktop. | Seções coladas, ou espaço vertical diferente a cada seção. |
| Ícones Lucide de traço 1.5px, um por card. | Ícones preenchidos, emojis, martelo, balança ou estátua. |
| Fatos verificáveis no Sobre: formação, OAB, formato de atendimento. | Depoimentos, preços, "resultados", "melhor escritório", contadores de vitórias. |
| No máximo 5 microinterações, todas com `prefers-reduced-motion`. | Parallax, marquee, partículas, máquina de escrever, animação em loop. |
| WhatsApp reconhecível pelo ícone e pelo rótulo. | Verde vibrante do WhatsApp em botões grandes. |

## Logo

O logo horizontal (`lw-advocacia-logo-wordmark.jpg`, 1376×768) e o emblema (`lw-advocacia-emblema.jpg`, 1024×1024) são JPEG opacos com fundo azul-marinho embutido.

- **Superfície:** só sobre `--color-surface-inverse`, exatamente `#172639`. Na prática, só no header e no rodapé. Nunca sobre pergaminho, branco, foto ou qualquer outro azul.
- **Container:** `.logo` com `background: #172639`, `overflow: hidden` e `aspect-ratio: 896 / 344`. Ele recorta a área útil (x 252–1116, y 228–540) com 16px de folga. A imagem leva `width: 153.571%; max-width: none; margin-left: -26.339%; margin-top: -23.661%`. Não use `object-fit: contain` (sobra margem azul) nem `cover` sem recorte calculado (corta o emblema).
- **Tamanho:** 40px de altura no header do celular, 48px no desktop, 56px no rodapé. Abaixo de 32px o "ADVOCACIA" fica ilegível.
- **Área de proteção:** no mínimo a altura do "LW" livre em volta, já garantida pelos 16px de folga do recorte.
- **Emblema:** favicon e avatar. Recorte quadrado x/y 232–792 (`.emblem`), em círculo ou quadrado com o mesmo fundo. Gere `favicon.ico` 32px, `apple-touch-icon` 180px e ícone 512px a partir desse recorte.
- **Não faça:** recolorir, aplicar sombra ou filtro, esticar, girar, colocar sobre fundo claro, separar o wordmark do emblema numa composição nova.

## Pendências (fora deste escopo)

- [ ] **Vetorizar o logo e o emblema** em SVG, com cores exatas da paleta.
- [ ] **Criar versão clara** do logo (marinho + dourado escurecido sobre pergaminho), para uso fora do header e do rodapé.
- [ ] Versão monocromática (uma cor) para documentos e carimbos.
- [ ] Fotos reais do(a) advogado(a) e do escritório, no tratamento descrito no README.
- [ ] Revisão jurídica dos textos finais e do aviso do Provimento 205/2021.
- [ ] Confirmar se existe número informativo permitido (anos de atuação) para o contador opcional.
