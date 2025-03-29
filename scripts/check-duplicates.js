/**
 * Script para verificar elementos duplicados no monorepo
 * 
 * Este script analisa o código fonte para identificar potenciais duplicações
 * de funções, tipos e outros elementos que deveriam ser centralizados.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Lista de elementos que devem ser verificados
const UTILS_FUNCTIONS = [
  'formatCurrency',
  'formatDate',
  'formatDateTime',
  'formatNumber',
  'isValidEmail',
  'isValidCPF', 
  'isValidCNPJ',
  'isValidPassword'
];

const SHARED_TYPES = [
  'UserRole',
  'User',
  'UserProfile',
  'AuthProvider',
  'AuthProviderProps'
];

// Funções que devem estar apenas no pacote @edunexia/api-client
const API_FUNCTIONS = [
  'createSupabaseClient',
  'createClient'
];

// Funções que devem estar apenas no pacote @edunexia/auth
const AUTH_FUNCTIONS = [
  'useAuth',
  'AuthProvider'
];

// Padrões de arquivos a verificar
const FILE_PATTERNS = [
  './apps/*/src/**/*.{ts,tsx}',
  './packages/*/src/**/*.{ts,tsx}'
];

// Exceções - arquivos que não devem ser verificados
const EXCEPTIONS = [
  './packages/utils/src/**/*.ts',  // Pacote centralizado de utilitários
  './packages/auth/src/**/*.ts',   // Pacote centralizado de autenticação
  './packages/api-client/src/**/*.ts',  // Pacote centralizado de API
  './packages/shared-types/src/**/*.ts', // Pacote centralizado de tipos
  '**/__tests__/**'  // Arquivos de teste
];

/**
 * Verifica se um caminho corresponde a algum dos padrões de exceção
 */
function isExceptionPath(filePath) {
  return EXCEPTIONS.some(pattern => {
    const regex = new RegExp(pattern.replace(/\*/g, '.*').replace(/\//g, '\\\\?'));
    return regex.test(filePath);
  });
}

/**
 * Encontra arquivos correspondentes a um padrão glob
 */
function findFiles(pattern) {
  try {
    const result = execSync(`find ${pattern.replace(/\{ts,tsx\}/g, "{ts,tsx}")} -type f`, { 
      encoding: 'utf-8',
      shell: true
    });
    return result.trim().split('\n').filter(Boolean);
  } catch (error) {
    console.error(`Erro ao procurar arquivos com padrão ${pattern}:`, error.message);
    return [];
  }
}

/**
 * Verifica implementações duplicadas de funções utilitárias
 */
function checkDuplicateUtils() {
  console.log('\n### Verificando funções utilitárias duplicadas ###');
  
  const duplicates = [];
  
  for (const funcName of UTILS_FUNCTIONS) {
    // Busca por declarações de funções
    try {
      const command = `grep -r "export\\s\\+\\(const\\|function\\)\\s\\+${funcName}\\|export\\s\\+function\\s\\+${funcName}" --include="*.ts" --include="*.tsx" ./apps ./packages`;
      const result = execSync(command, { encoding: 'utf-8', shell: true, stdio: 'pipe' }).trim();
      
      if (result) {
        const matches = result.split('\n')
          .filter(line => !isExceptionPath(line.split(':')[0]));
          
        if (matches.length > 0) {
          duplicates.push({ function: funcName, matches });
        }
      }
    } catch (error) {
      // grep retorna código 1 quando não encontra nada, o que não é um erro para nós
      if (error.status !== 1) {
        console.error(`Erro ao procurar por ${funcName}:`, error.message);
      }
    }
  }
  
  if (duplicates.length === 0) {
    console.log('✅ Nenhuma função utilitária duplicada encontrada.');
    return true;
  }
  
  console.log('❌ Funções utilitárias duplicadas encontradas:');
  for (const { function: func, matches } of duplicates) {
    console.log(`\n• ${func}:`);
    matches.forEach(match => console.log(`  - ${match}`));
  }
  
  return false;
}

/**
 * Verifica definições duplicadas de tipos compartilhados
 */
function checkDuplicateTypes() {
  console.log('\n### Verificando tipos compartilhados duplicados ###');
  
  const duplicates = [];
  
  for (const typeName of SHARED_TYPES) {
    // Busca por declarações de tipos
    try {
      const command = `grep -r "export\\s\\+\\(type\\|interface\\)\\s\\+${typeName}" --include="*.ts" --include="*.tsx" ./apps ./packages`;
      const result = execSync(command, { encoding: 'utf-8', shell: true, stdio: 'pipe' }).trim();
      
      if (result) {
        const matches = result.split('\n')
          .filter(line => !isExceptionPath(line.split(':')[0]));
          
        if (matches.length > 0) {
          duplicates.push({ type: typeName, matches });
        }
      }
    } catch (error) {
      // grep retorna código 1 quando não encontra nada, o que não é um erro para nós
      if (error.status !== 1) {
        console.error(`Erro ao procurar por ${typeName}:`, error.message);
      }
    }
  }
  
  if (duplicates.length === 0) {
    console.log('✅ Nenhum tipo compartilhado duplicado encontrado.');
    return true;
  }
  
  console.log('❌ Tipos compartilhados duplicados encontrados:');
  for (const { type, matches } of duplicates) {
    console.log(`\n• ${type}:`);
    matches.forEach(match => console.log(`  - ${match}`));
  }
  
  return false;
}

/**
 * Verifica implementações duplicadas de funções de API
 */
function checkDuplicateApiFunctions() {
  console.log('\n### Verificando funções de API duplicadas ###');
  
  const duplicates = [];
  
  for (const funcName of API_FUNCTIONS) {
    // Busca por declarações de funções
    try {
      const command = `grep -r "export\\s\\+\\(const\\|function\\)\\s\\+${funcName}\\|export\\s\\+function\\s\\+${funcName}" --include="*.ts" --include="*.tsx" ./apps ./packages`;
      const result = execSync(command, { encoding: 'utf-8', shell: true, stdio: 'pipe' }).trim();
      
      if (result) {
        const matches = result.split('\n')
          .filter(line => !isExceptionPath(line.split(':')[0]));
          
        if (matches.length > 0) {
          duplicates.push({ function: funcName, matches });
        }
      }
    } catch (error) {
      // grep retorna código 1 quando não encontra nada, o que não é um erro para nós
      if (error.status !== 1) {
        console.error(`Erro ao procurar por ${funcName}:`, error.message);
      }
    }
  }
  
  if (duplicates.length === 0) {
    console.log('✅ Nenhuma função de API duplicada encontrada.');
    return true;
  }
  
  console.log('❌ Funções de API duplicadas encontradas:');
  for (const { function: func, matches } of duplicates) {
    console.log(`\n• ${func}:`);
    matches.forEach(match => console.log(`  - ${match}`));
  }
  
  return false;
}

/**
 * Verifica implementações duplicadas de funções de autenticação
 */
function checkDuplicateAuthFunctions() {
  console.log('\n### Verificando funções de autenticação duplicadas ###');
  
  const duplicates = [];
  
  for (const funcName of AUTH_FUNCTIONS) {
    // Busca por declarações de funções
    try {
      const command = `grep -r "export\\s\\+\\(const\\|function\\|class\\)\\s\\+${funcName}\\|export\\s\\+function\\s\\+${funcName}" --include="*.ts" --include="*.tsx" ./apps ./packages`;
      const result = execSync(command, { encoding: 'utf-8', shell: true, stdio: 'pipe' }).trim();
      
      if (result) {
        const matches = result.split('\n')
          .filter(line => !isExceptionPath(line.split(':')[0]));
          
        if (matches.length > 0) {
          duplicates.push({ function: funcName, matches });
        }
      }
    } catch (error) {
      // grep retorna código 1 quando não encontra nada, o que não é um erro para nós
      if (error.status !== 1) {
        console.error(`Erro ao procurar por ${funcName}:`, error.message);
      }
    }
  }
  
  if (duplicates.length === 0) {
    console.log('✅ Nenhuma função de autenticação duplicada encontrada.');
    return true;
  }
  
  console.log('❌ Funções de autenticação duplicadas encontradas:');
  for (const { function: func, matches } of duplicates) {
    console.log(`\n• ${func}:`);
    matches.forEach(match => console.log(`  - ${match}`));
  }
  
  return false;
}

/**
 * Função principal
 */
function main() {
  console.log('=== Verificação de duplicações no monorepo ===');
  
  const utilsOk = checkDuplicateUtils();
  const typesOk = checkDuplicateTypes();
  const apiOk = checkDuplicateApiFunctions();
  const authOk = checkDuplicateAuthFunctions();
  
  console.log('\n=== Resultado da verificação ===');
  
  if (utilsOk && typesOk && apiOk && authOk) {
    console.log('✅ Nenhuma duplicação encontrada.');
    process.exit(0);
  } else {
    console.log('❌ Foram encontradas duplicações que precisam ser corrigidas.');
    console.log('   Consulte docs/correcao-duplicacoes.md para mais informações.');
    process.exit(1);
  }
}

// Executa a função principal
main(); 