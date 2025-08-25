@echo off
echo ============================
echo  DEPLOY AUTOMÁTICO PARA GITHUB
echo ============================

:: Caminho do seu projeto (opcional: se o .bat estiver fora da pasta do projeto)
cd /d "C:\Users\MarioReys\Documents\GitHub\Mr-Store"

:: Adiciona todos os arquivos modificados
git add .

:: Cria um commit com data e hora
set DATAHORA=%DATE% %TIME%
git commit -m "Deploy automático em %DATAHORA%"

:: Faz push para o repositório remoto
git push origin main

echo.
echo Deploy concluído com sucesso!
pause
