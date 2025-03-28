# Script para facilitar operações comuns do Git
param (
    [Parameter(Position=0, Mandatory=$true)]
    [ValidateSet("status", "commit", "push", "pull", "log", "diff")]
    [string]$Command,
    
    [Parameter(Position=1, Mandatory=$false)]
    [string]$Message = ""
)

$gitPath = "C:\Program Files\Git\bin\git.exe"

# Desativar paginação temporariamente para este script
$env:GIT_PAGER = ""

function Show-Status {
    Write-Host "Status do repositório:" -ForegroundColor Cyan
    & $gitPath --no-pager status --short
}

function Show-Log {
    Write-Host "Últimos 5 commits:" -ForegroundColor Cyan
    & $gitPath --no-pager log -n 5 --oneline
}

function Show-Diff {
    Write-Host "Diferenças entre arquivos modificados:" -ForegroundColor Cyan
    & $gitPath --no-pager diff --name-status
}

function Do-Commit {
    param (
        [string]$CommitMessage
    )
    
    if ([string]::IsNullOrEmpty($CommitMessage)) {
        $CommitMessage = "chore: Atualização do projeto"
    }
    
    Write-Host "Realizando commit com a mensagem:" -ForegroundColor Yellow
    Write-Host "  $CommitMessage" -ForegroundColor Yellow
    
    $commitResult = & $gitPath --no-pager commit -m $CommitMessage 2>&1
    Write-Host "`nResultado do commit:" -ForegroundColor Cyan
    Write-Host $commitResult
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`nCommit realizado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "`nErro ao realizar commit. Código de saída: $LASTEXITCODE" -ForegroundColor Red
    }
}

function Do-Push {
    Write-Host "Realizando push..." -ForegroundColor Cyan
    $pushResult = & $gitPath --no-pager push 2>&1
    Write-Host "`nResultado do push:" -ForegroundColor Cyan
    Write-Host $pushResult
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`nPush realizado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "`nErro ao realizar push. Código de saída: $LASTEXITCODE" -ForegroundColor Red
    }
}

function Do-Pull {
    Write-Host "Realizando pull..." -ForegroundColor Cyan
    $pullResult = & $gitPath --no-pager pull 2>&1
    Write-Host "`nResultado do pull:" -ForegroundColor Cyan
    Write-Host $pullResult
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`nPull realizado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "`nErro ao realizar pull. Código de saída: $LASTEXITCODE" -ForegroundColor Red
    }
}

# Executar o comando solicitado
switch ($Command) {
    "status" { Show-Status }
    "log"    { Show-Log }
    "diff"   { Show-Diff }
    "commit" { Do-Commit -CommitMessage $Message }
    "push"   { Do-Push }
    "pull"   { Do-Pull }
}

# Exemplos de uso:
# .\git-helper.ps1 status
# .\git-helper.ps1 commit "Mensagem do commit"
# .\git-helper.ps1 push
# .\git-helper.ps1 pull
# .\git-helper.ps1 log
# .\git-helper.ps1 diff 