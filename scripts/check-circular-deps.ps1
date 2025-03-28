# Script para verificar dependências circulares no monorepo

Write-Host ""
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "           Verificando dependências circulares no monorepo" -ForegroundColor Cyan
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Verificando pacotes (packages)..." -ForegroundColor Yellow
Write-Host ""
pnpm circular:check

Write-Host ""
Write-Host "Verificando aplicações (apps)..." -ForegroundColor Yellow
Write-Host ""
pnpm circular:check:apps

# Verificar se o Graphviz está instalado
$graphvizInstalled = $false
try {
    $gvPath = Get-Command "gvpr" -ErrorAction SilentlyContinue
    $graphvizInstalled = $null -ne $gvPath
} catch {
    $graphvizInstalled = $false
}

Write-Host ""
if ($graphvizInstalled) {
    Write-Host "Gerando imagem do grafo de dependências..." -ForegroundColor Yellow
    Write-Host ""
    pnpm circular:image
    Write-Host "Grafo de dependências gerado em dependency-graph.png" -ForegroundColor Green
} else {
    Write-Host "Graphviz não encontrado! Não é possível gerar o grafo de dependências." -ForegroundColor Red
    Write-Host ""
    Write-Host "Para gerar o grafo visual de dependências, instale o Graphviz:" -ForegroundColor Yellow
    Write-Host "  1. Visite https://graphviz.org/download/" -ForegroundColor White
    Write-Host "  2. Baixe e instale a versão para Windows" -ForegroundColor White
    Write-Host "  3. Adicione o diretório bin do Graphviz ao PATH do sistema" -ForegroundColor White
    Write-Host "  4. Reinicie o terminal e execute este script novamente" -ForegroundColor White
    Write-Host ""
    Write-Host "Alternativamente, você pode instalar via chocolatey:" -ForegroundColor Yellow
    Write-Host "  choco install graphviz" -ForegroundColor White
    Write-Host ""
}

Write-Host ""
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "                    Verificação concluída!" -ForegroundColor Cyan
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "LEMBRE-SE: Dependências circulares podem causar problemas de compilação" -ForegroundColor Red
Write-Host "           e devem ser evitadas sempre que possível." -ForegroundColor Red
Write-Host ""
Write-Host "Se encontradas dependências circulares, considere:" -ForegroundColor Yellow
Write-Host "- Extrair a funcionalidade compartilhada para um terceiro pacote" -ForegroundColor White
Write-Host "- Reestruturar as importações para evitar ciclos" -ForegroundColor White
Write-Host "- Utilizar injeção de dependência onde apropriado" -ForegroundColor White
Write-Host "" 