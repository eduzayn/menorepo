# Script para executar operações Git de forma mais confiável
param (
    [Parameter(Mandatory=$true)]
    [string]$Command,
    
    [Parameter(Mandatory=$false)]
    [string]$Message = ""
)

$gitPath = "C:\Program Files\Git\cmd\git.exe"

function Execute-GitCommand {
    param (
        [string]$GitCommand
    )
    
    Write-Host "Executando: $GitCommand" -ForegroundColor Cyan
    
    try {
        if ($GitCommand -match "commit" -and $Message -ne "") {
            $output = & $gitPath $GitCommand -m $Message 2>&1
        } else {
            $output = & $gitPath $GitCommand 2>&1
        }
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Erro ao executar o comando Git:" -ForegroundColor Red
            Write-Host $output -ForegroundColor Red
            return $false
        } else {
            Write-Host "Comando executado com sucesso!" -ForegroundColor Green
            Write-Host $output
            return $true
        }
    } catch {
        Write-Host "Exceção ao executar o comando Git:" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        return $false
    }
}

switch ($Command) {
    "status" {
        Execute-GitCommand "status"
    }
    "add-all" {
        Execute-GitCommand "add ."
    }
    "commit" {
        if ($Message -eq "") {
            Write-Host "É necessário fornecer uma mensagem de commit" -ForegroundColor Red
            exit 1
        }
        Execute-GitCommand "commit" 
    }
    "push" {
        Execute-GitCommand "push origin main"
    }
    "pull" {
        Execute-GitCommand "pull origin main"
    }
    default {
        Write-Host "Comando '$Command' não reconhecido. Comandos disponíveis: status, add-all, commit, push, pull" -ForegroundColor Yellow
    }
} 