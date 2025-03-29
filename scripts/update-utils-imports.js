/**
 * Script para centralizar as funções utilitárias e remover duplicações
 * 
 * Este script procura por implementações duplicadas de funções utilitárias e
 * atualiza as importações para usar o pacote @edunexia/utils centralizado
 */

const fs = require('fs');
const path = require('path');

// Lista das funções utilitárias que foram centralizadas
const UTIL_FUNCTIONS = [
  'formatCurrency',
  'formatDate',
  'formatDateTime',
  'formatNumber',
  'formatCPF',
  'formatCNPJ',
  'formatPhone',
  'formatCEP',
  'formatPercentage',
  'truncateText',
  'formatName',
  'formatFileSize',
  'formatDuration',
  'formatRelativeTime',
  'isValidEmail',
  'isValidCPF',
  'isValidCNPJ',
  'isValidUrl',
  'isValidCEP',
  'isValidPhone',
  'isValidPassword',
  'isValidDate',
  'isFutureDate',
  'isPastDate',
  'isAlphaOnly',
  'isAlphanumeric',
  'cn',
  'generateId',
  'delay',
  'slugify',
  'removeNullValues',
  'groupBy',
  'sortBy',
  'deepMerge',
  'debounce',
  'throttle',
  'shuffle',
  'uniqueArray',
  'removeAccents'
];

// Padrões de arquivos que contêm implementações de funções utilitárias
const FORMATTER_FILES_PATTERNS = [
  './apps/*/src/utils/formatters.ts',
  './apps/*/src/utils/format.ts',
  './apps/*/src/utils/formatter.ts',
  './packages/*/src/utils/formatters.ts',
  './packages/core/src/utils/index.ts',
  './packages/api-client/src/utils.ts'
];

// Padrão de arquivos que contêm importações de funções utilitárias
const IMPORT_FILES_PATTERNS = [
  './apps/*/src/**/*.{ts,tsx}',
  './packages/*/src/**/*.{ts,tsx}'
];

// Exceções - arquivos que não devem ser modificados
const EXCEPTIONS = [
  './packages/utils/src/**/*.ts'
];

/**
 * Verifica se um arquivo deve ser ignorado
 */
function shouldIgnore(file) {
  return EXCEPTIONS.some(pattern => {
    const regex = new RegExp(pattern.replace(/\*/g, '.*').replace(/\//g, '\\\\?'));
    return regex.test(file);
  });
}

/**
 * Encontra todos os arquivos que correspondem a um padrão (substitui o glob)
 */
function findFiles(pattern) {
  // Converte o padrão glob para regex
  const parts = pattern.split('*');
  let regexParts = parts.map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  let regexPattern = '^' + regexParts.join('.*') + '$';
  regexPattern = regexPattern.replace(/\\\.\{ts,tsx\}$/, '\\.(ts|tsx)$');
  const regex = new RegExp(regexPattern.replace(/\//g, '\\\\'));

  // Arrays para armazenar os resultados
  const results = [];
  
  // Determina o diretório base
  let baseDir = './';
  if (pattern.startsWith('./apps/')) {
    baseDir = './apps';
  } else if (pattern.startsWith('./packages/')) {
    baseDir = './packages';
  }
  
  // Função recursiva para procurar arquivos
  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name).replace(/\\/g, '/');
      
      // Ignora node_modules
      if (entry.name === 'node_modules') {
        continue;
      }
      
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (regex.test(fullPath)) {
        results.push(fullPath);
      }
    }
  }
  
  try {
    scanDir(baseDir);
  } catch (error) {
    console.error(`Erro ao ler diretório ${baseDir}:`, error);
  }
  
  return results;
}

/**
 * Verifica se um arquivo contém implementações de funções utilitárias
 */
async function findDuplicateImplementations() {
  console.log('Procurando implementações duplicadas de funções utilitárias...');
  
  let files = [];
  
  // Encontra todos os arquivos que correspondem aos padrões
  for (const pattern of FORMATTER_FILES_PATTERNS) {
    const matches = findFiles(pattern);
    files = [...files, ...matches];
  }
  
  const duplicates = [];
  
  // Verifica cada arquivo
  for (const file of files) {
    if (shouldIgnore(file)) continue;
    
    const content = fs.readFileSync(file, 'utf-8');
    
    // Procura por declarações de função
    for (const funcName of UTIL_FUNCTIONS) {
      const regex = new RegExp(`(export\\s+(const|function)\\s+${funcName}|export\\s+function\\s+${funcName}|function\\s+${funcName}\\s*\\()`, 'g');
      if (regex.test(content)) {
        duplicates.push({ file, funcName });
      }
    }
  }
  
  if (duplicates.length === 0) {
    console.log('Nenhuma implementação duplicada encontrada.');
    return [];
  }
  
  console.log(`Encontradas ${duplicates.length} implementações duplicadas:`);
  const groupedByFile = {};
  
  duplicates.forEach(({ file, funcName }) => {
    if (!groupedByFile[file]) {
      groupedByFile[file] = [];
    }
    groupedByFile[file].push(funcName);
  });
  
  Object.entries(groupedByFile).forEach(([file, funcs]) => {
    console.log(`- ${file}: ${funcs.join(', ')}`);
  });
  
  return duplicates;
}

/**
 * Atualiza as importações de funções utilitárias em um arquivo
 */
function updateImportsInFile(file, duplicates) {
  if (shouldIgnore(file)) return false;
  
  let content = fs.readFileSync(file, 'utf-8');
  let modified = false;
  
  // Conjunto de funções que precisam ser importadas de @edunexia/utils
  const functionsToImport = new Set();
  
  // Mapa de arquivos locais para funções importadas
  const localImports = {};
  
  // Encontra importações de arquivos locais que contêm implementações duplicadas
  duplicates.forEach(({ file: duplicateFile, funcName }) => {
    const relativePath = path.relative(path.dirname(file), duplicateFile)
      .replace(/\\/g, '/')
      .replace(/\.ts$/, '');
    
    // Identifica importações de arquivos com implementações duplicadas
    const importRegex = new RegExp(`import\\s+{([^}]*${funcName}[^}]*)}\\s+from\\s+['"]([^'"]*(?:utils|formatters|format|formatter)[^'"]*)['"]`, 'g');
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      const importedFunctions = match[1].split(',').map(f => f.trim());
      const importPath = match[2];
      
      // Verifica se é uma importação local ou já da biblioteca centralizada
      if (importPath === '@edunexia/utils') continue;
      
      // Para cada função importada
      for (const importedFunc of importedFunctions) {
        const cleanFunc = importedFunc.split(' as ')[0].trim();
        
        // Se a função está na lista de funções centralizadas
        if (UTIL_FUNCTIONS.includes(cleanFunc)) {
          functionsToImport.add(cleanFunc);
          
          if (!localImports[match[0]]) {
            localImports[match[0]] = [];
          }
          
          localImports[match[0]].push(cleanFunc);
          modified = true;
        }
      }
    }
  });
  
  // Substitui as importações locais por importações de @edunexia/utils
  if (modified) {
    // Primeiro, remove as importações locais de funções que serão importadas de @edunexia/utils
    Object.entries(localImports).forEach(([importStatement, functions]) => {
      // Remove apenas as funções que serão importadas de @edunexia/utils
      const importRegex = /import\s+{([^}]*)}\s+from\s+['"]([^'"]*)['"]/;
      const match = importStatement.match(importRegex);
      
      if (match) {
        const importedFunctions = match[1].split(',').map(f => f.trim());
        const remainingFunctions = importedFunctions.filter(f => {
          const cleanFunc = f.split(' as ')[0].trim();
          return !functions.includes(cleanFunc);
        });
        
        if (remainingFunctions.length === 0) {
          // Remove toda a importação se não restarem funções
          content = content.replace(importStatement, '');
        } else {
          // Substitui a importação apenas com as funções restantes
          const newImport = `import { ${remainingFunctions.join(', ')} } from '${match[2]}'`;
          content = content.replace(importStatement, newImport);
        }
      }
    });
    
    // Então, adiciona a importação de @edunexia/utils
    if (functionsToImport.size > 0) {
      const existingUtilsImport = content.match(/import\s+{([^}]*)}\s+from\s+['"]@edunexia\/utils['"]/);
      
      if (existingUtilsImport) {
        // Adiciona as funções à importação existente
        const existingFunctions = existingUtilsImport[1].split(',').map(f => f.trim());
        const newFunctions = [...new Set([...existingFunctions, ...functionsToImport])];
        const newImport = `import { ${newFunctions.join(', ')} } from '@edunexia/utils'`;
        content = content.replace(existingUtilsImport[0], newImport);
      } else {
        // Adiciona uma nova importação
        const newImport = `import { ${[...functionsToImport].join(', ')} } from '@edunexia/utils';\n`;
        
        // Adiciona após a última importação ou no início do arquivo
        const lastImport = content.lastIndexOf('import ');
        const lastImportEnd = content.indexOf('\n', lastImport);
        
        if (lastImport !== -1) {
          content = content.slice(0, lastImportEnd + 1) + newImport + content.slice(lastImportEnd + 1);
        } else {
          content = newImport + content;
        }
      }
    }
    
    // Salva o arquivo modificado
    fs.writeFileSync(file, content, 'utf-8');
  }
  
  return modified;
}

/**
 * Atualiza todas as importações de funções utilitárias
 */
async function updateAllImports(duplicates) {
  console.log('\nAtualizando importações...');
  
  let files = [];
  
  // Encontra todos os arquivos que correspondem aos padrões
  for (const pattern of IMPORT_FILES_PATTERNS) {
    const matches = findFiles(pattern);
    files = [...files, ...matches];
  }
  
  let modifiedCount = 0;
  
  // Atualiza cada arquivo
  for (const file of files) {
    const modified = updateImportsInFile(file, duplicates);
    if (modified) {
      modifiedCount++;
      console.log(`Atualizado: ${file}`);
    }
  }
  
  console.log(`\nTotal de ${modifiedCount} arquivos atualizados.`);
}

/**
 * Cria arquivos com implementações vazias para manter compatibilidade
 */
function createCompatibilityFiles(duplicates) {
  console.log('\nCriando arquivos de compatibilidade...');
  
  const fileGroups = {};
  
  // Agrupa duplicatas por arquivo
  duplicates.forEach(({ file, funcName }) => {
    if (!fileGroups[file]) {
      fileGroups[file] = [];
    }
    
    if (!fileGroups[file].includes(funcName)) {
      fileGroups[file].push(funcName);
    }
  });
  
  // Cria arquivos de compatibilidade para cada arquivo com duplicatas
  Object.entries(fileGroups).forEach(([file, functions]) => {
    const fileContent = `/**
 * DEPRECATED: Este arquivo está mantido apenas para compatibilidade.
 * Por favor, importe estas funções de '@edunexia/utils' em vez disso.
 */

// Re-exporta as funções de @edunexia/utils
import { ${functions.join(', ')} } from '@edunexia/utils';

export {
  ${functions.join(',\n  ')}
};
`;
    
    fs.writeFileSync(file, fileContent, 'utf-8');
    console.log(`Criado arquivo de compatibilidade: ${file}`);
  });
}

/**
 * Adiciona o pacote utils como dependência nos projetos
 */
function addUtilsDependency() {
  console.log('\nAdicionando @edunexia/utils como dependência...');
  
  // Procura arquivos package.json em apps e packages
  const appPackages = findFiles('./apps/*/package.json');
  const libPackages = findFiles('./packages/*/package.json')
    .filter(file => !file.includes('packages/utils/package.json'));
  
  const packageJsonFiles = [...appPackages, ...libPackages];
  
  let modifiedCount = 0;
  
  for (const file of packageJsonFiles) {
    const packageJson = JSON.parse(fs.readFileSync(file, 'utf-8'));
    
    // Já tem a dependência
    if (packageJson.dependencies && packageJson.dependencies['@edunexia/utils']) {
      continue;
    }
    
    // Adiciona a dependência
    if (!packageJson.dependencies) {
      packageJson.dependencies = {};
    }
    
    packageJson.dependencies['@edunexia/utils'] = 'workspace:*';
    
    // Ordena as dependências
    const sortedDependencies = {};
    Object.keys(packageJson.dependencies).sort().forEach(key => {
      sortedDependencies[key] = packageJson.dependencies[key];
    });
    
    packageJson.dependencies = sortedDependencies;
    
    // Salva o arquivo
    fs.writeFileSync(file, JSON.stringify(packageJson, null, 2), 'utf-8');
    
    modifiedCount++;
    console.log(`Atualizado: ${file}`);
  }
  
  console.log(`\nTotal de ${modifiedCount} arquivos package.json atualizados.`);
}

/**
 * Função principal
 */
async function main() {
  console.log('==== Centralização de Funções Utilitárias ====\n');
  
  try {
    // Encontra implementações duplicadas
    const duplicates = await findDuplicateImplementations();
    
    if (duplicates.length === 0) {
      console.log('\nNão há necessidade de atualizar importações.');
      return;
    }
    
    // Atualiza importações
    await updateAllImports(duplicates);
    
    // Cria arquivos de compatibilidade
    createCompatibilityFiles(duplicates);
    
    // Adiciona @edunexia/utils como dependência nos projetos
    addUtilsDependency();
    
    console.log('\n==== Centralização Concluída com Sucesso! ====');
    console.log('\nRecomendações:');
    console.log('1. Execute "pnpm install" para atualizar as dependências');
    console.log('2. Execute "pnpm build" para verificar se não há problemas');
    console.log('3. Remova os arquivos de compatibilidade quando possível');
    
  } catch (error) {
    console.error('Erro durante a centralização:', error);
    process.exit(1);
  }
}

// Executa a função principal
main(); 