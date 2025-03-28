@echo off
echo Criando arquivo .gitattributes para padronizar EOL...

(
echo # Configuracao padrao para normalizacao de fim de linha
echo * text=auto eol=lf
echo.
echo # Arquivos de texto especificos que devem manter LF
echo *.ts text eol=lf
echo *.tsx text eol=lf
echo *.js text eol=lf
echo *.jsx text eol=lf
echo *.json text eol=lf
echo *.md text eol=lf
echo *.css text eol=lf
echo *.scss text eol=lf
echo *.html text eol=lf
echo.
echo # Scripts shell sempre com LF
echo *.sh text eol=lf
echo.
echo # Scripts Windows sempre com CRLF
echo *.bat text eol=crlf
echo *.cmd text eol=crlf
echo *.ps1 text eol=crlf
echo.
echo # Binarios que nao devem ser modificados
echo *.png binary
echo *.jpg binary
echo *.jpeg binary
echo *.gif binary
echo *.ico binary
echo *.zip binary
echo *.pdf binary
) > .gitattributes

echo Arquivo .gitattributes criado com sucesso. 