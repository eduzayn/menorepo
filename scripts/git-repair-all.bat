@echo off
echo Iniciando reparo completo da configuracao Git...

:: Verificar se esta sendo executado como administrador
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Este script precisa ser executado como administrador.
    echo Clique com o botao direito e selecione "Executar como administrador".
    pause
    exit /b 1
)

set GIT_PATH="C:\Program Files\Git\bin\git.exe"
set GIT_PAGER=

echo.
echo 1. Consertando permissoes...
icacls "C:\Program Files\Git\bin\git.exe" /grant Everyone:RX
icacls "C:\Program Files\Git\bin\*" /grant Everyone:RX

echo.
echo 2. Configurando paginacao e buffers...
%GIT_PATH% config --global core.pager ""
%GIT_PATH% config --global core.longpaths true
%GIT_PATH% config --global http.postBuffer 524288000
%GIT_PATH% config --global status.short true

echo.
echo 3. Configurando tratamento de fim de linha...
%GIT_PATH% config --global core.autocrlf true
%GIT_PATH% config --global core.eol native
%GIT_PATH% add --renormalize .

echo.
echo 4. Verificando e corrigindo hooks Git...
if exist ".husky" (
    icacls ".husky\*" /grant Everyone:RX
)
%GIT_PATH% config --local core.hooksPath .git/hooks.disabled

echo.
echo 5. Corrigindo problemas de autenticacao...
%GIT_PATH% credential reject
%GIT_PATH% config --global credential.helper manager-core

echo.
echo 6. Configurando informacoes do usuario...
%GIT_PATH% config --local user.name "Edunexia Developer"
%GIT_PATH% config --local user.email "dev@edunexia.com"

echo.
echo 7. Testando configuracao...
%GIT_PATH% status --short

echo.
echo Reparo completo da configuracao Git concluido com sucesso!
echo Para commit: pnpm run git:commit
echo Para push: pnpm run git:push 