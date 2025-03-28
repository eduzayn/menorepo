# Script para configurar o Git e resolver problemas de paginação
$gitPath = "C:\Program Files\Git\bin\git.exe"

# Definir variáveis de ambiente para desativar a paginação
$env:GIT_PAGER = ""

# Desabilitar o paginador globalmente
& $gitPath config --global core.pager ""

# Configurar para usar saídas mais concisas
& $gitPath config --global status.short true

# Aumentar o buffer de saída
& $gitPath config --global core.longpaths true
& $gitPath config --global http.postBuffer 524288000

# Configurar informações do usuário para commits
& $gitPath config --local user.name "Edunexia Developer"
& $gitPath config --local user.email "dev@edunexia.com"

Write-Host "Configurações do Git aplicadas com sucesso!" -ForegroundColor Green
Write-Host "Testando status do Git..." -ForegroundColor Cyan

# Testar status com --no-pager
& $gitPath --no-pager status --short

Write-Host "Pronto para realizar operações de commit e push." -ForegroundColor Green 