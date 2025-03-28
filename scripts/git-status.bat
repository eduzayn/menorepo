@echo off
echo Verificando status do repositório...

set GIT_PAGER=
set GIT_PATH="C:\Program Files\Git\bin\git.exe"

%GIT_PATH% status --short

echo.
echo Status apresentado acima. 