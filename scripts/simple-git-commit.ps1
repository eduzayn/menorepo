$gitPath = "C:\Program Files\Git\bin\git.exe"
$commitMessage = "chore: Padronização de ESLint e Prettier em todo o monorepo"

# Fazer commit das alterações
& $gitPath commit -m $commitMessage

Write-Output "Comando de commit executado. Verifique a saída acima para confirmar o resultado." 