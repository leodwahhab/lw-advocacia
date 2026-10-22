@echo off
rem Duplo clique: inicia o site e o painel de edicao e abre o navegador.
rem Para encerrar, feche esta janela.
cd /d "%~dp0"
if not exist node_modules (
  echo Instalando o necessario pela primeira vez. Isso leva um minuto...
  call npm install
)
start "" http://localhost:8080/admin/
call npm run dev
