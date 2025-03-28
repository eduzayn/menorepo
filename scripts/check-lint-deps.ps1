# Script para verificar e reportar dependências de ESLint e Prettier
Write-Host "Verificando dependências de ESLint e Prettier em todos os módulos..." -ForegroundColor Green

$dirs = @(Get-ChildItem -Path "apps" -Directory) + @(Get-ChildItem -Path "packages" -Directory)
$modulosComFalta = @()

foreach ($dir in $dirs) {
    $packageJsonPath = Join-Path -Path $dir.FullName -ChildPath "package.json"
    
    if (Test-Path $packageJsonPath) {
        $packageContent = Get-Content -Path $packageJsonPath -Raw
        
        if (-not $packageContent.Contains('"@edunexia/eslint-config"')) {
            $packageJsonObj = ConvertFrom-Json -InputObject $packageContent
            $name = $packageJsonObj.name
            
            $modulosComFalta += @{
                Name = $name
                Path = $dir.FullName
                Missing = '@edunexia/eslint-config'
            }
        }
    }
}

if ($modulosComFalta.Count -gt 0) {
    Write-Host "`nMódulos que precisam de dependências:" -ForegroundColor Yellow
    foreach ($modulo in $modulosComFalta) {
        Write-Host "  - $($modulo.Name) ($($modulo.Path))" -ForegroundColor Yellow
        Write-Host "    Faltando: $($modulo.Missing)" -ForegroundColor Yellow
        Write-Host "    Comando: pnpm add -D $($modulo.Missing) --filter $($modulo.Name)" -ForegroundColor Cyan
        Write-Host ""
    }
} else {
    Write-Host "`nTodos os módulos têm as dependências necessárias!" -ForegroundColor Green
}

Write-Host "Verificação concluída!" -ForegroundColor Green 