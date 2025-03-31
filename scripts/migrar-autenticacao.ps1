# PowerShell script para migrar o sistema de autenticação

$RED = 'Red'
$GREEN = 'Green'
$YELLOW = 'Yellow'

Write-Host "Iniciando migração do sistema de autenticação..." -ForegroundColor $YELLOW

# Verificar se o Node.js está instalado
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js não está instalado. Por favor, instale o Node.js para continuar." -ForegroundColor $RED
    exit 1
}

# Verificar se o PNPM está instalado
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "PNPM não está instalado. Por favor, instale o PNPM para continuar." -ForegroundColor $RED
    exit 1
}

# Instalar dependências necessárias
Write-Host "Instalando dependências necessárias..." -ForegroundColor $YELLOW
pnpm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Falha ao instalar dependências." -ForegroundColor $RED
    exit 1
}

# Executar o script de migração da autenticação
Write-Host "Executando script de migração da autenticação..." -ForegroundColor $YELLOW
pnpm tsx scripts/migrar-autenticacao.ts
if ($LASTEXITCODE -ne 0) {
    Write-Host "Falha ao executar o script de migração." -ForegroundColor $RED
    exit 1
}

# Reconstruir o pacote de autenticação
Write-Host "Reconstruindo o pacote de autenticação..." -ForegroundColor $YELLOW
Set-Location packages/auth
pnpm build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Falha ao reconstruir o pacote de autenticação." -ForegroundColor $RED
    Set-Location ../..
    exit 1
}
Set-Location ../..

# Atualizar dependências em todos os módulos
Write-Host "Atualizando dependências do pacote auth em todos os módulos..." -ForegroundColor $YELLOW
pnpm install @edunexia/auth -r
if ($LASTEXITCODE -ne 0) {
    Write-Host "Falha ao atualizar as dependências." -ForegroundColor $RED
    exit 1
}

# Reconstruir os pacotes afetados
Write-Host "Reconstruindo pacotes afetados..." -ForegroundColor $YELLOW
pnpm build --filter=...@edunexia/auth
if ($LASTEXITCODE -ne 0) {
    Write-Host "Falha ao reconstruir os pacotes afetados." -ForegroundColor $RED
    exit 1
}

Write-Host "Migração do sistema de autenticação concluída com sucesso!" -ForegroundColor $GREEN
Write-Host "" -ForegroundColor $YELLOW
Write-Host "Próximos passos:" -ForegroundColor $YELLOW
Write-Host "1. Execute 'pnpm dev' para iniciar os serviços em modo de desenvolvimento" -ForegroundColor $GREEN
Write-Host "2. Teste o novo sistema de autenticação nos diferentes módulos" -ForegroundColor $GREEN

exit 0 