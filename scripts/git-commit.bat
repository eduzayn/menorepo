@echo off
echo Realizando commit das alterações...

set GIT_PAGER=
set GIT_PATH="C:\Program Files\Git\bin\git.exe"

%GIT_PATH% commit -m "chore: Padronização de ESLint e Prettier em todo o monorepo"

echo.
echo Commit realizado. Para fazer push, use: pnpm run git:push 