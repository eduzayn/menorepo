@echo off
setlocal

echo.
echo ===================================================================
echo           Verificando dependências circulares no monorepo
echo ===================================================================
echo.

echo Verificando pacotes (packages)...
echo.
call pnpm circular:check

echo.
echo Verificando aplicações (apps)...
echo.
call pnpm circular:check:apps

echo.

REM Verificar se o Graphviz está instalado
where gvpr > nul 2>&1
if %ERRORLEVEL% == 0 (
    echo Gerando imagem do grafo de dependências...
    echo.
    call pnpm circular:image
    echo Grafo de dependências gerado em dependency-graph.png
) else (
    echo Graphviz não encontrado! Não é possível gerar o grafo de dependências.
    echo.
    echo Para gerar o grafo visual de dependências, instale o Graphviz:
    echo   1. Visite https://graphviz.org/download/
    echo   2. Baixe e instale a versão para Windows
    echo   3. Adicione o diretório bin do Graphviz ao PATH do sistema
    echo   4. Reinicie o terminal e execute este script novamente
    echo.
    echo Alternativamente, você pode instalar via chocolatey:
    echo   choco install graphviz
    echo.
)

echo.
echo ===================================================================
echo                    Verificação concluída!
echo ===================================================================
echo.
echo LEMBRE-SE: Dependências circulares podem causar problemas de compilação
echo            e devem ser evitadas sempre que possível.
echo.
echo Se encontradas dependências circulares, considere:
echo - Extrair a funcionalidade compartilhada para um terceiro pacote
echo - Reestruturar as importações para evitar ciclos
echo - Utilizar injeção de dependência onde apropriado
echo.

endlocal 