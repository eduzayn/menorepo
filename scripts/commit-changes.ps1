# Script para realizar commit e push das alterações
$gitPath = "C:\Program Files\Git\bin\git.exe"

# Desativar paginação temporariamente para este script
$env:GIT_PAGER = ""

# Mostrar status atual (formato curto)
Write-Host "Status atual do repositório:" -ForegroundColor Cyan
& $gitPath --no-pager status --short

# Solicitar mensagem de commit
$commitMessage = "chore: Padronização de ESLint e Prettier em todo o monorepo"

Write-Host "`nRealizando commit com a mensagem:" -ForegroundColor Yellow
Write-Host "  $commitMessage" -ForegroundColor Yellow

# Realizar o commit
$commitResult = & $gitPath --no-pager commit -m $commitMessage 2>&1
Write-Host "`nResultado do commit:" -ForegroundColor Cyan
Write-Host $commitResult

# Verificar se o commit foi bem-sucedido
if ($LASTEXITCODE -eq 0) {
    Write-Host "`nCommit realizado com sucesso!" -ForegroundColor Green
    
    # Perguntar se deve fazer push
    Write-Host "`nDeseja realizar push das alterações? (S/N)" -ForegroundColor Yellow
    $doPush = "S"
    
    if ($doPush -eq "S" -or $doPush -eq "s") {
        Write-Host "`nRealizando push..." -ForegroundColor Cyan
        $pushResult = & $gitPath --no-pager push 2>&1
        Write-Host "`nResultado do push:" -ForegroundColor Cyan
        Write-Host $pushResult
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`nPush realizado com sucesso!" -ForegroundColor Green
        } else {
            Write-Host "`nErro ao realizar push. Código de saída: $LASTEXITCODE" -ForegroundColor Red
            Write-Host "Você pode tentar realizar o push manualmente usando:"
            Write-Host "  & `"C:\Program Files\Git\bin\git.exe`" push"
        }
    } else {
        Write-Host "`nPush não realizado. Você pode fazer isso manualmente mais tarde." -ForegroundColor Yellow
    }
} else {
    Write-Host "`nErro ao realizar commit. Código de saída: $LASTEXITCODE" -ForegroundColor Red
    Write-Host "Verifique se há erros nas mensagens acima." -ForegroundColor Red
} 