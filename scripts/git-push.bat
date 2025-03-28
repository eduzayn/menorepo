@echo off
echo Realizando push das alterações...

set GIT_PAGER=
set GIT_PATH="C:\Program Files\Git\bin\git.exe"

%GIT_PATH% push

echo.
echo Push realizado. 