# Script para adicionar o comentário de desativação do spell checker em arquivos markdown
# Este script verifica todos os arquivos .md no projeto e adiciona o comentário <!-- cSpell:disable --> 
# no início de cada arquivo que ainda não possui esse comentário.

Write-Host "Iniciando a verificação de arquivos markdown para adicionar o comentário de desativação do spell checker..."

# Contadores para estatísticas
$totalFiles = 0
$updatedFiles = 0
$alreadyUpdatedFiles = 0

# Buscar todos os arquivos .md no projeto, excluindo a pasta node_modules
$markdownFiles = Get-ChildItem -Recurse -Path . -Filter *.md | Where-Object { $_.FullName -notlike '*node_modules*' }
$totalFiles = $markdownFiles.Count

Write-Host "Encontrados $totalFiles arquivos markdown para verificação."

foreach ($file in $markdownFiles) {
    # Verificar se o arquivo já possui o comentário de desativação
    $hasDisableComment = Select-String -Path $file.FullName -Pattern "<!-- cSpell:disable -->" -SimpleMatch -Quiet
    
    if (-not $hasDisableComment) {
        # Arquivo não possui o comentário, adicionar
        $content = Get-Content $file.FullName
        $updatedContent = @("<!-- cSpell:disable -->") + $content
        Set-Content -Path $file.FullName -Value $updatedContent
        $updatedFiles++
        Write-Host "Adicionado comentário de desativação ao arquivo: $($file.FullName)"
    } else {
        # Arquivo já possui o comentário
        $alreadyUpdatedFiles++
    }
}

Write-Host "Processamento concluído!"
Write-Host "Estatísticas:"
Write-Host "- Total de arquivos verificados: $totalFiles"
Write-Host "- Arquivos já com o comentário: $alreadyUpdatedFiles"
Write-Host "- Arquivos atualizados: $updatedFiles"

Write-Host "Verificando arquivos de configuração VS Code..."
$settingsFile = "./.vscode/settings.json"

if (Test-Path $settingsFile) {
    Write-Host "Verificando configurações do VS Code para ignorar arquivos .md no spell checker..."
    # Adicionar mais configurações se necessário
} else {
    Write-Host "Arquivo de configurações do VS Code não encontrado."
}

Write-Host "Script concluído com sucesso!" 