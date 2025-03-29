module.exports = {
  // Usar a configuração base do monorepo
  extends: ['@edunexia/eslint-config'],
  
  // Regras específicas do módulo
  rules: {
    // Qualquer regra específica do módulo de contabilidade pode ser adicionada aqui
  },
  
  // Configurações específicas do ambiente
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  
  // Ignorar arquivos específicos
  ignorePatterns: ['dist', 'node_modules', '.turbo', '*.d.ts']
}; 