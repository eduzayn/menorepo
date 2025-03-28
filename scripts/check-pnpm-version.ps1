# Script para verificar se está usando a versão correta do pnpm

# Versão esperada do pnpm
$DesiredVersion = "8.9.0"

Write-Host "Verificando a versão do pnpm..." -ForegroundColor Cyan

try {
    # Tentar obter a versão do pnpm
    $InstalledVersion = (pnpm --version) 2>&1
    
    # Verificar se o comando foi bem-sucedido
    if ($LASTEXITCODE -eq 0) {
        Write-Host "pnpm encontrado, versão: $InstalledVersion" -ForegroundColor Green
        
        # Comparar com a versão desejada
        if ($InstalledVersion -eq $DesiredVersion) {
            Write-Host "✅ Versão correta do pnpm ($DesiredVersion) está sendo usada!" -ForegroundColor Green
        } else {
            Write-Host "❌ Versão incorreta do pnpm! Esperado: $DesiredVersion, Encontrado: $InstalledVersion" -ForegroundColor Red
            Write-Host ""
            Write-Host "Para instalar a versão correta:" -ForegroundColor Yellow
            Write-Host "  Opção 1 (recomendada): Use corepack" -ForegroundColor White
            Write-Host "    corepack enable" -ForegroundColor White
            Write-Host "    corepack prepare pnpm@$DesiredVersion --activate" -ForegroundColor White
            Write-Host ""
            Write-Host "  Opção 2: Instale manualmente" -ForegroundColor White
            Write-Host "    npm install -g pnpm@$DesiredVersion" -ForegroundColor White
            Write-Host ""
            Write-Host "Consulte docs/gerenciamento-pacotes.md para mais informações." -ForegroundColor Cyan
        }
    } else {
        # pnpm não encontrado
        Write-Host "❌ pnpm não está instalado ou não está no PATH!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Para instalar o pnpm:" -ForegroundColor Yellow
        Write-Host "  Opção 1 (recomendada): Use corepack (requer Node.js 16.9+)" -ForegroundColor White
        Write-Host "    corepack enable" -ForegroundColor White
        Write-Host "    corepack prepare pnpm@$DesiredVersion --activate" -ForegroundColor White
        Write-Host ""
        Write-Host "  Opção 2: Instale manualmente" -ForegroundColor White
        Write-Host "    npm install -g pnpm@$DesiredVersion" -ForegroundColor White
        Write-Host ""
        Write-Host "Consulte docs/gerenciamento-pacotes.md para mais informações." -ForegroundColor Cyan
    }
} catch {
    # Erro ao executar o comando
    Write-Host "❌ Erro ao verificar a versão do pnpm: $_" -ForegroundColor Red
    Write-Host "pnpm não está instalado corretamente." -ForegroundColor Red
    Write-Host ""
    Write-Host "Para instalar o pnpm:" -ForegroundColor Yellow
    Write-Host "  Opção 1 (recomendada): Use corepack (requer Node.js 16.9+)" -ForegroundColor White
    Write-Host "    corepack enable" -ForegroundColor White
    Write-Host "    corepack prepare pnpm@$DesiredVersion --activate" -ForegroundColor White
    Write-Host ""
    Write-Host "  Opção 2: Instale manualmente" -ForegroundColor White
    Write-Host "    npm install -g pnpm@$DesiredVersion" -ForegroundColor White
    Write-Host ""
    Write-Host "Consulte docs/gerenciamento-pacotes.md para mais informações." -ForegroundColor Cyan
} 