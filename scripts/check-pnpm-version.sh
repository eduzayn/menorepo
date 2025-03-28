#!/bin/bash

# Versão esperada do pnpm
DESIRED_VERSION="8.9.0"

echo "Verificando a versão do pnpm..."

# Verificar se o pnpm está instalado
if command -v pnpm &> /dev/null; then
    INSTALLED_VERSION=$(pnpm --version)
    echo "pnpm encontrado, versão: $INSTALLED_VERSION"
    
    # Comparar com a versão desejada
    if [ "$INSTALLED_VERSION" = "$DESIRED_VERSION" ]; then
        echo -e "\033[32m✅ Versão correta do pnpm ($DESIRED_VERSION) está sendo usada!\033[0m"
    else
        echo -e "\033[31m❌ Versão incorreta do pnpm! Esperado: $DESIRED_VERSION, Encontrado: $INSTALLED_VERSION\033[0m"
        echo
        echo -e "\033[33mPara instalar a versão correta:\033[0m"
        echo -e "  Opção 1 (recomendada): Use corepack"
        echo "    corepack enable"
        echo "    corepack prepare pnpm@$DESIRED_VERSION --activate"
        echo
        echo -e "  Opção 2: Instale manualmente"
        echo "    npm install -g pnpm@$DESIRED_VERSION"
        echo
        echo -e "\033[36mConsulte docs/gerenciamento-pacotes.md para mais informações.\033[0m"
    fi
else
    echo -e "\033[31m❌ pnpm não está instalado ou não está no PATH!\033[0m"
    echo
    echo -e "\033[33mPara instalar o pnpm:\033[0m"
    echo -e "  Opção 1 (recomendada): Use corepack (requer Node.js 16.9+)"
    echo "    corepack enable"
    echo "    corepack prepare pnpm@$DESIRED_VERSION --activate"
    echo
    echo -e "  Opção 2: Instale manualmente"
    echo "    npm install -g pnpm@$DESIRED_VERSION"
    echo
    echo -e "  Opção 3: Use o script de instalação oficial"
    echo "    curl -fsSL https://get.pnpm.io/install.sh | sh -"
    echo
    echo -e "\033[36mConsulte docs/gerenciamento-pacotes.md para mais informações.\033[0m"
    exit 1
fi 