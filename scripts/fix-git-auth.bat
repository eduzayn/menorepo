@echo off
echo Corrigindo problemas de autenticacao Git...

set GIT_PATH="C:\Program Files\Git\bin\git.exe"

:: Limpar credenciais armazenadas (forcar nova autenticacao)
%GIT_PATH% credential reject

:: Configurar cache de credenciais (aumentar tempo)
%GIT_PATH% config --global credential.helper "cache --timeout=86400"

:: Para Windows, usar o gerenciador de credenciais do Windows
%GIT_PATH% config --global credential.helper manager-core

echo.
echo Configuracoes de autenticacao Git atualizadas.
echo Na proxima operacao remota, voce podera precisar inserir suas credenciais novamente. 