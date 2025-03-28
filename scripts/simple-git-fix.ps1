$gitPath = "C:\Program Files\Git\bin\git.exe"

# Configurações para resolver problemas de paginação
& $gitPath config --global core.pager ""
& $gitPath config --global core.longpaths true
& $gitPath config --global status.short true

# Configurar usuário para commits
& $gitPath config --local user.name "Edunexia Developer"
& $gitPath config --local user.email "dev@edunexia.com"

Write-Output "Git configurado para trabalhar sem paginador." 