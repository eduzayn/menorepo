# Script para padronizar configurações de ESLint e Prettier em todos os módulos
Write-Host "Configurando ESLint e Prettier em todos os módulos..." -ForegroundColor Green

# Certifique-se de que o diretório de templates existe
if (-not (Test-Path "scripts/templates")) {
    New-Item -Path "scripts/templates" -ItemType Directory -Force | Out-Null
}

# Copia os templates para cada pacote em apps/ e packages/
$dirs = @(Get-ChildItem -Path "apps" -Directory) + @(Get-ChildItem -Path "packages" -Directory)

foreach ($dir in $dirs) {
    Write-Host "Configurando $($dir.FullName)..." -ForegroundColor Cyan
    
    # Copia os arquivos .eslintrc.js e .prettierrc.js para cada diretório
    Copy-Item -Path "scripts/templates/eslintrc.js" -Destination "$($dir.FullName)\.eslintrc.js" -Force
    Copy-Item -Path "scripts/templates/prettierrc.js" -Destination "$($dir.FullName)\.prettierrc.js" -Force
    
    # Remove arquivos de configuração redundantes
    if (Test-Path "$($dir.FullName)\.eslintrc.json") {
        Remove-Item -Path "$($dir.FullName)\.eslintrc.json" -Force
    }
    if (Test-Path "$($dir.FullName)\.prettierrc") {
        Remove-Item -Path "$($dir.FullName)\.prettierrc" -Force
    }
    
    Write-Host "✅ $($dir.FullName) configurado" -ForegroundColor Green
}

Write-Host "Configuração concluída!" -ForegroundColor Green
Write-Host "Lembre-se de verificar se todos os módulos têm '@edunexia/eslint-config' e '@edunexia/prettier-config' como dependências." -ForegroundColor Yellow 