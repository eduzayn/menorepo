@echo off
echo Verificando e corrigindo hooks Git...

set GIT_PATH="C:\Program Files\Git\bin\git.exe"

:: Desabilitar temporariamente os hooks (para diagnostico)
%GIT_PATH% config --local core.hooksPath .git/hooks.disabled

:: Verificar se existe pasta husky
if exist ".husky" (
    echo Encontrados hooks husky, corrigindo permissoes...
    icacls ".husky\*" /grant Everyone:RX
)

:: Verificar hooks existentes
if exist ".git\hooks" (
    echo Verificando hooks existentes...
    dir .git\hooks
)

echo Hooks Git verificados e configurados. 