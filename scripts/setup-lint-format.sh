#!/bin/bash

# Script para padronizar configurações de ESLint e Prettier em todos os módulos
echo "Configurando ESLint e Prettier em todos os módulos..."

# Certifique-se de que o diretório de templates existe
mkdir -p scripts/templates

# Copia os templates para cada pacote em apps/ e packages/
for dir in apps/* packages/*; do
  if [ -d "$dir" ]; then
    echo "Configurando $dir..."
    
    # Copia os arquivos .eslintrc.js e .prettierrc.js para cada diretório
    cp scripts/templates/eslintrc.js $dir/.eslintrc.js
    cp scripts/templates/prettierrc.js $dir/.prettierrc.js
    
    # Remove arquivos de configuração redundantes
    rm -f $dir/.eslintrc.json
    rm -f $dir/.prettierrc
    
    echo "✅ $dir configurado"
  fi
done

echo "Configuração concluída!"
echo "Lembre-se de verificar se todos os módulos têm '@edunexia/eslint-config' e '@edunexia/prettier-config' como dependências." 