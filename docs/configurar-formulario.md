# Como ligar o formulário à planilha e ao seu e-mail

Quando alguém preenche o formulário do site, os dados vão para uma **planilha do Google** e você recebe um **e-mail** com o contato. Tudo roda na sua conta Google, sem custo e sem servidor.

Leva uns 15 minutos. Você só precisa de uma conta Google (Gmail ou Google Workspace), de preferência a do escritório.

---

## 1. Criar a planilha

1. Acesse **https://sheets.new**, que abre uma planilha nova.
2. Clique em "Planilha sem título", no canto superior esquerdo, e dê um nome, por exemplo **Contatos do site LW Advocacia**.

Não precisa criar colunas. O script cria a aba **Contatos** e o cabeçalho sozinho no primeiro envio.

## 2. Colar o script

1. Na planilha, abra o menu **Extensões → Apps Script**. Uma nova aba se abre com um editor de código.
2. Apague todo o texto que já vem no editor (`function myFunction() {...}`).
3. Abra o arquivo `integrations/google-apps-script/Code.gs` deste projeto, copie **todo** o conteúdo e cole no editor.
4. No topo do código, no bloco **Configuração**, troque:
   - `EMAIL_DESTINO`: o e-mail que vai receber os avisos;
   - `SITE_URL`: o endereço do site (quando estiver publicado);
   - `WHATSAPP_URL`: o link do WhatsApp do escritório, por exemplo `https://wa.me/5511912345678`.
5. Clique no ícone de **disquete** (Salvar). Se pedir um nome de projeto, use "Formulário do site".

## 3. Autorizar e testar

1. Na barra de cima do editor, escolha a função **`testar`** na lista e clique em **Executar**.
2. O Google vai pedir autorização: clique em **Revisar permissões**, escolha sua conta e depois em **Avançado → Acessar Formulário do site (não seguro) → Permitir**.
   > O aviso de "não seguro" aparece porque o script é seu e não foi publicado na loja do Google. É normal.
3. Volte à planilha: deve aparecer a aba **Contatos**, com uma linha "Teste do site". Confira também se o e-mail de teste chegou. Depois, pode apagar a linha de teste.

## 4. Publicar como aplicativo da Web

1. No editor do Apps Script, clique em **Implantar → Nova implantação**.
2. Clique na engrenagem ao lado de "Selecionar tipo" e escolha **App da Web**.
3. Preencha:
   - **Descrição:** Formulário do site
   - **Executar como:** **Eu** (o seu e-mail)
   - **Quem pode acessar:** **Qualquer pessoa**
4. Clique em **Implantar** e copie a **URL do app da Web**. Ela termina em `/exec`, por exemplo `https://script.google.com/macros/s/AKfy.../exec`.

> "Qualquer pessoa" significa que qualquer um pode **enviar** dados para o script, que é o que um formulário público precisa. Ninguém consegue **ler** a planilha por essa URL.

## 5. Colocar a URL no site

1. Abra o painel do site (veja `docs/tutorial-edicao.md`), seção **Configurações do site**.
2. Cole a URL no campo **URL do formulário (Apps Script)** e salve.
3. Se preferir editar o arquivo direto, troque `formEndpoint` em `content/site.json`.
4. Rode `npm run build`. Pronto.

## 6. Testar de ponta a ponta

1. Abra o site, preencha o formulário com seus dados e envie.
2. Deve aparecer "Mensagem enviada.", e em alguns segundos a linha surge na planilha e o e-mail chega.

---

## Quando você alterar o script

Se mudar alguma coisa no `Code.gs` depois de publicado, vá em **Implantar → Gerenciar implantações**, clique no **lápis**, escolha **Nova versão** e clique em **Implantar**. Assim a URL continua a mesma. Se criar uma *nova implantação*, a URL muda e você precisa atualizar o site.

## O que o script faz

- Grava data e hora, nome, telefone, e-mail, descrição, consentimento (sim/não), data do consentimento, versão da Política de Privacidade, página de origem e parâmetros de campanha (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`).
- Envia um e-mail ao escritório. Basta clicar em **Responder** para escrever direto para a pessoa.
- Valida os dados de novo no servidor: nome, telefone com DDD, e-mail e consentimento obrigatório.
- Contra spam, tem um campo invisível que só robôs preenchem e um limite de 5 envios por hora para o mesmo e-mail ou telefone.
- Impede que textos começando com `=` virem fórmula na planilha.
- Também funciona sem JavaScript: o navegador envia o formulário normalmente e o script mostra uma página de confirmação.

## Problemas comuns

| Sintoma | Solução |
| --- | --- |
| O site mostra "Não foi possível enviar agora." | Confira se a URL colada termina em `/exec` e se o acesso está como **Qualquer pessoa**. |
| A linha aparece na planilha, mas o e-mail não chega | Veja a caixa de spam e o `EMAIL_DESTINO`. Contas gratuitas enviam até 100 e-mails por dia. |
| Mudei o script e nada mudou | Publique uma **nova versão** (veja "Quando você alterar o script"). |
| Quero ver os erros | No Apps Script, abra o menu à esquerda **Execuções**. |

## LGPD

A planilha guarda dados pessoais. Compartilhe só com quem precisa e apague os contatos que não viraram clientes depois do prazo definido na Política de Privacidade (hoje, `[12 meses]`).
