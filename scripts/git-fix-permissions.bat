@echo off
echo Configurando permissoes do Git...

:: Verificar se esta sendo executado como administrador
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Este script precisa ser executado como administrador.
    echo Clique com o botao direito e selecione "Executar como administrador".
    pause
    exit /b 1
)

:: Corrigir permissoes
icacls "C:\Program Files\Git\bin\git.exe" /grant Everyone:RX
icacls "C:\Program Files\Git\bin\*" /grant Everyone:RX

:: Adicionar Git ao PATH do sistema
setx PATH "%PATH%;C:\Program Files\Git\bin" /M

echo Permissoes configuradas com sucesso. 