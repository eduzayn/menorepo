# Script para verificar elementos duplicados no monorepo em ambiente Windows

# Lista de elementos que devem ser verificados
$UTILS_FUNCTIONS = @(
    'formatCurrency',
    'formatDate',
    'formatDateTime',
    'formatNumber',
    'isValidEmail',
    'isValidCPF',
    'isValidCNPJ',
    'isValidPassword'
)

$SHARED_TYPES = @(
    'UserRole',
    'User',
    'UserProfile',
    'AuthProvider',
    'AuthProviderProps'
)

# Funções que devem estar apenas no pacote @edunexia/api-client
$API_FUNCTIONS = @(
    'createSupabaseClient',
    'createClient'
)

# Funções que devem estar apenas no pacote @edunexia/auth
$AUTH_FUNCTIONS = @(
    'useAuth',
    'AuthProvider'
)

# Exceções - arquivos que não devem ser verificados
$EXCEPTIONS = @(
    '.*packages\\utils\\src\\.*',  # Pacote centralizado de utilitários
    '.*packages\\auth\\src\\.*',   # Pacote centralizado de autenticação
    '.*packages\\api-client\\src\\.*',  # Pacote centralizado de API
    '.*packages\\shared-types\\src\\.*', # Pacote centralizado de tipos
    '.*__tests__\\.*'  # Arquivos de teste
)

# Verifica se um caminho corresponde a algum dos padrões de exceção
function Test-IsExceptionPath {
    param (
        [string]$FilePath
    )
    
    foreach ($pattern in $EXCEPTIONS) {
        if ($FilePath -match $pattern) {
            return $true
        }
    }
    
    return $false
}

# Verifica implementações duplicadas de funções utilitárias
function Test-DuplicateUtils {
    Write-Host "`n### Verificando funções utilitárias duplicadas ###" -ForegroundColor Cyan
    
    $duplicates = @()
    
    foreach ($funcName in $UTILS_FUNCTIONS) {
        $pattern = "export\s+(const|function)\s+$funcName|export\s+function\s+$funcName"
        
        $files = Get-ChildItem -Path "./apps", "./packages" -Recurse -Include "*.ts", "*.tsx" | Where-Object {
            $content = Get-Content $_.FullName -Raw
            $content -match $pattern -and !(Test-IsExceptionPath $_.FullName)
        }
        
        if ($files.Count -gt 0) {
            $matchLocations = @()
            foreach ($file in $files) {
                $content = Get-Content $file.FullName
                $lineNumber = 0
                foreach ($line in $content) {
                    $lineNumber++
                    if ($line -match $pattern) {
                        $matchLocations += "$($file.FullName):$lineNumber`: $line"
                    }
                }
            }
            
            if ($matchLocations.Count -gt 0) {
                $duplicates += @{
                    "function" = $funcName
                    "matches" = $matchLocations
                }
            }
        }
    }
    
    if ($duplicates.Count -eq 0) {
        Write-Host "✅ Nenhuma função utilitária duplicada encontrada." -ForegroundColor Green
        return $true
    }
    
    Write-Host "❌ Funções utilitárias duplicadas encontradas:" -ForegroundColor Red
    foreach ($duplicate in $duplicates) {
        Write-Host "`n• $($duplicate.function):" -ForegroundColor Yellow
        foreach ($match in $duplicate.matches) {
            Write-Host "  - $match"
        }
    }
    
    return $false
}

# Verifica definições duplicadas de tipos compartilhados
function Test-DuplicateTypes {
    Write-Host "`n### Verificando tipos compartilhados duplicados ###" -ForegroundColor Cyan
    
    $duplicates = @()
    
    foreach ($typeName in $SHARED_TYPES) {
        $pattern = "export\s+(type|interface)\s+$typeName"
        
        $files = Get-ChildItem -Path "./apps", "./packages" -Recurse -Include "*.ts", "*.tsx" | Where-Object {
            $content = Get-Content $_.FullName -Raw
            $content -match $pattern -and !(Test-IsExceptionPath $_.FullName)
        }
        
        if ($files.Count -gt 0) {
            $matchLocations = @()
            foreach ($file in $files) {
                $content = Get-Content $file.FullName
                $lineNumber = 0
                foreach ($line in $content) {
                    $lineNumber++
                    if ($line -match $pattern) {
                        $matchLocations += "$($file.FullName):$lineNumber`: $line"
                    }
                }
            }
            
            if ($matchLocations.Count -gt 0) {
                $duplicates += @{
                    "type" = $typeName
                    "matches" = $matchLocations
                }
            }
        }
    }
    
    if ($duplicates.Count -eq 0) {
        Write-Host "✅ Nenhum tipo compartilhado duplicado encontrado." -ForegroundColor Green
        return $true
    }
    
    Write-Host "❌ Tipos compartilhados duplicados encontrados:" -ForegroundColor Red
    foreach ($duplicate in $duplicates) {
        Write-Host "`n• $($duplicate.type):" -ForegroundColor Yellow
        foreach ($match in $duplicate.matches) {
            Write-Host "  - $match"
        }
    }
    
    return $false
}

# Verifica implementações duplicadas de funções de API
function Test-DuplicateApiFunctions {
    Write-Host "`n### Verificando funções de API duplicadas ###" -ForegroundColor Cyan
    
    $duplicates = @()
    
    foreach ($funcName in $API_FUNCTIONS) {
        $pattern = "export\s+(const|function)\s+$funcName|export\s+function\s+$funcName"
        
        $files = Get-ChildItem -Path "./apps", "./packages" -Recurse -Include "*.ts", "*.tsx" | Where-Object {
            $content = Get-Content $_.FullName -Raw
            $content -match $pattern -and !(Test-IsExceptionPath $_.FullName)
        }
        
        if ($files.Count -gt 0) {
            $matchLocations = @()
            foreach ($file in $files) {
                $content = Get-Content $file.FullName
                $lineNumber = 0
                foreach ($line in $content) {
                    $lineNumber++
                    if ($line -match $pattern) {
                        $matchLocations += "$($file.FullName):$lineNumber`: $line"
                    }
                }
            }
            
            if ($matchLocations.Count -gt 0) {
                $duplicates += @{
                    "function" = $funcName
                    "matches" = $matchLocations
                }
            }
        }
    }
    
    if ($duplicates.Count -eq 0) {
        Write-Host "✅ Nenhuma função de API duplicada encontrada." -ForegroundColor Green
        return $true
    }
    
    Write-Host "❌ Funções de API duplicadas encontradas:" -ForegroundColor Red
    foreach ($duplicate in $duplicates) {
        Write-Host "`n• $($duplicate.function):" -ForegroundColor Yellow
        foreach ($match in $duplicate.matches) {
            Write-Host "  - $match"
        }
    }
    
    return $false
}

# Verifica implementações duplicadas de funções de autenticação
function Test-DuplicateAuthFunctions {
    Write-Host "`n### Verificando funções de autenticação duplicadas ###" -ForegroundColor Cyan
    
    $duplicates = @()
    
    foreach ($funcName in $AUTH_FUNCTIONS) {
        $pattern = "export\s+(const|function|class)\s+$funcName|export\s+function\s+$funcName"
        
        $files = Get-ChildItem -Path "./apps", "./packages" -Recurse -Include "*.ts", "*.tsx" | Where-Object {
            $content = Get-Content $_.FullName -Raw
            $content -match $pattern -and !(Test-IsExceptionPath $_.FullName)
        }
        
        if ($files.Count -gt 0) {
            $matchLocations = @()
            foreach ($file in $files) {
                $content = Get-Content $file.FullName
                $lineNumber = 0
                foreach ($line in $content) {
                    $lineNumber++
                    if ($line -match $pattern) {
                        $matchLocations += "$($file.FullName):$lineNumber`: $line"
                    }
                }
            }
            
            if ($matchLocations.Count -gt 0) {
                $duplicates += @{
                    "function" = $funcName
                    "matches" = $matchLocations
                }
            }
        }
    }
    
    if ($duplicates.Count -eq 0) {
        Write-Host "✅ Nenhuma função de autenticação duplicada encontrada." -ForegroundColor Green
        return $true
    }
    
    Write-Host "❌ Funções de autenticação duplicadas encontradas:" -ForegroundColor Red
    foreach ($duplicate in $duplicates) {
        Write-Host "`n• $($duplicate.function):" -ForegroundColor Yellow
        foreach ($match in $duplicate.matches) {
            Write-Host "  - $match"
        }
    }
    
    return $false
}

# Função principal
function Main {
    Write-Host "=== Verificação de duplicações no monorepo ===" -ForegroundColor Magenta
    
    $utilsOk = Test-DuplicateUtils
    $typesOk = Test-DuplicateTypes
    $apiOk = Test-DuplicateApiFunctions
    $authOk = Test-DuplicateAuthFunctions
    
    Write-Host "`n=== Resultado da verificação ===" -ForegroundColor Magenta
    
    if ($utilsOk -and $typesOk -and $apiOk -and $authOk) {
        Write-Host "✅ Nenhuma duplicação encontrada." -ForegroundColor Green
        return 0
    } else {
        Write-Host "❌ Foram encontradas duplicações que precisam ser corrigidas." -ForegroundColor Red
        Write-Host "   Consulte docs/correcao-duplicacoes.md para mais informações." -ForegroundColor Yellow
        return 1
    }
}

# Executa a função principal
$exitCode = Main
exit $exitCode 