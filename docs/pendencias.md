# Pendências

O que falta para o site ir ao ar. Marque `[x]` conforme for resolvendo.

## ⚠️ Dados fictícios (mock) em uso

O conteúdo usa **dados de exemplo propositalmente falsos** ("Fulana de Tal", Xique-Xique/BA, números 123.456, domínio `example.com`) para visualizar o site completo sem parecer real. Substitua todos antes de publicar (pelo painel ou no `content/site.json`).

| Campo | Valor de exemplo atual |
| --- | --- |
| Advogada (nome, cargo) | Fulana de Tal, Advogada |
| OAB | OAB/BA 123.456 |
| Formação | Direito · Universidade Exemplo · 2000 |
| Cidade | Xique-Xique/BA (eyebrow, SEO, FAQ, diferenciais, "OAB/BA" nos honorários) |
| Endereço | Rua Exemplo, 123, sala 45 · Centro · Xique-Xique/BA · 12345-678 (também no link e no embed do mapa) |
| Telefone | (12) 3456-7890 · discagem `+551234567890` |
| WhatsApp | `5512912345678` |
| E-mails | contato@example.com · privacidade@example.com |
| Redes | instagram.com/exemplo · linkedin.com/company/exemplo |
| Domínio (`site.url`) | https://www.example.com |
| Política | controladora "Fulana de Tal Sociedade Individual de Advocacia", CNPJ 12.345.678/0001-00, encarregada Fulana de Tal, retenção de 12 meses, hospedagem "Provedor Exemplo Ltda." |
| URL do formulário | `https://script.google.com/macros/s/EXEMPLO-123456/exec`: **não funciona**; o envio mostra a mensagem de erro com o link do WhatsApp até a URL real ser colada |
| ID do GTM | continua `GTM-XXXXXXX` de propósito: com esse valor o site não carrega o GTM |

## Conteúdo e dados do escritório

- [ ] Trocar todos os dados fictícios da tabela acima pelos reais (pelo painel do CMS ou no `content/site.json`).
- [ ] Aprovar a copy (`docs/copy-para-revisao.md`).
- [ ] Enviar o **retrato profissional** do(a) advogado(a) para o hero e o Sobre (retrato 4:5, luz natural, ver diretrizes do design system). Hoje há uma foto provisória (`assets/fotos/placeholder-retrato.jpg`).
- [ ] Confirmar as 6 áreas de atuação (dá para adicionar, remover ou reordenar pelo CMS).
- [ ] Número do WhatsApp em formato internacional, só dígitos (ex.: `5511912345678`), e telefone em `telefoneLink` (ex.: `+5511912345678`).
- [ ] Endereço para o mapa: trocar `[Endereço]` em `mapaLink` e `mapaEmbed` pelo endereço completo.

## Revisão jurídica

- [ ] Revisar a Política de Privacidade (controlador, CNPJ/CPF, encarregado, prazo de retenção, provedor de hospedagem).
- [ ] Revisar o aviso do Provimento 205/2021 no rodapé.
- [ ] Revisar a resposta sobre honorários no FAQ.

## Integrações e publicação

- [ ] **Formulário:** criar a planilha, publicar o Apps Script e colar a URL em `site.formEndpoint` (passo a passo em `docs/configurar-formulario.md`). Até lá, o envio mostra a mensagem de erro com o link do WhatsApp.
- [ ] **E-mail que recebe os contatos:** `EMAIL_DESTINO` no topo do `Code.gs`.
- [ ] **GTM:** criar o contêiner, importar `integrations/gtm-container.json`, preencher os IDs do GA4 (`G-XXXXXXXXXX`) e do Pixel, e trocar `GTM-XXXXXXX` em `site.gtmId` (ver `docs/configurar-gtm.md`).
- [ ] **Conversões:** marcar `form_submit` e `whatsapp_click` como eventos-chave no GA4.
- [ ] **CMS na hospedagem:** escolher Netlify + Git Gateway ou GitHub e ajustar o bloco `backend`, o `site_url` e o `display_url` em `src/admin/config.yml` (ver `docs/publicacao.md`).
- [ ] **Importação do GTM:** o `gtm-container.json` segue o formato de exportação, mas não foi validado numa conta real. Conferir ao importar.

## Verificações que dependem de dados ou contas reais

- [ ] PageSpeed Insights no domínio final (local: 98–99 / 100 / 100 / 100, veja o README).
- [ ] Envio real do formulário para a planilha e o e-mail (localmente, só com endpoint mockado).
- [ ] Importação do `gtm-container.json` e eventos no modo Visualizar do GTM.
- [ ] Painel online (Netlify Identity/Git Gateway ou GitHub), que só existe depois da publicação.
- [ ] Teste em aparelhos reais (iPhone e Android), sobretudo o banner de cookies com o botão flutuante e a área segura (notch).

## Placeholders encontrados no conteúdo

Tabela gerada automaticamente pelo build a cada execução (itens entre colchetes). Vazia enquanto os dados fictícios estiverem no lugar.

<!-- placeholders:inicio -->
| Placeholder | Onde aparece (campo no site.json) |
| --- | --- |

<!-- placeholders:fim -->
