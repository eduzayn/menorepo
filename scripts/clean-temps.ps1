# Script para remover arquivos temporários e de log do projeto
Write-Host "Iniciando limpeza de arquivos temporários..." -ForegroundColor Green

# Contador de arquivos removidos
$removedCount = 0

# Encontra e remove diretórios .temp, evitando node_modules
Get-ChildItem -Path "." -Directory -Filter ".temp" -Force -Recurse -ErrorAction SilentlyContinue | 
    Where-Object { $_.FullName -notmatch "node_modules" } | 
    ForEach-Object {
        Write-Host "Removendo diretório: $($_.FullName)" -ForegroundColor Yellow
        Remove-Item -Path $_.FullName -Recurse -Force -ErrorAction SilentlyContinue
        $removedCount++
    }

# Encontra e remove arquivos temporários e logs
$patterns = @("*.temp", "*.tmp", "*.log", "npm-debug.log*", "pnpm-debug.log*", "yarn-debug.log*", "yarn-error.log*", "*.bak")
foreach ($pattern in $patterns) {
    Get-ChildItem -Path "." -File -Filter $pattern -Force -Recurse -ErrorAction SilentlyContinue | 
        Where-Object { $_.FullName -notmatch "node_modules" } | 
        ForEach-Object {
            Write-Host "Removendo arquivo: $($_.FullName)" -ForegroundColor Yellow
            Remove-Item -Path $_.FullName -Force -ErrorAction SilentlyContinue
            $removedCount++
        }
}

# Remover arquivos temporários específicos do macOS
Get-ChildItem -Path "." -File -Filter ".DS_Store" -Force -Recurse -ErrorAction SilentlyContinue | 
    Where-Object { $_.FullName -notmatch "node_modules" } | 
    ForEach-Object {
        Write-Host "Removendo arquivo: $($_.FullName)" -ForegroundColor Yellow
        Remove-Item -Path $_.FullName -Force -ErrorAction SilentlyContinue
        $removedCount++
    }

Write-Host "Limpeza concluída!" -ForegroundColor Green
Write-Host "Total de arquivos removidos: $removedCount" -ForegroundColor Cyan 