@echo off
echo Configurando o Git para resolver problemas de paginação...

set GIT_PAGER=
set GIT_PATH="C:\Program Files\Git\bin\git.exe"

%GIT_PATH% config --global core.pager ""
%GIT_PATH% config --global core.longpaths true
%GIT_PATH% config --global status.short true
%GIT_PATH% config --local user.name "Edunexia Developer"
%GIT_PATH% config --local user.email "dev@edunexia.com"

echo Git configurado com sucesso.
echo Para fazer um commit, use: pnpm run git:commit
echo Para fazer push, use: pnpm run git:push 