/**
 * Script para verificar se as importações seguem o padrão definido
 * 
 * Este script verifica se todos os módulos estão importando funcionalidades
 * dos pacotes compartilhados corretamente, conforme as diretrizes de
 * padronização de importações.
 */

const fs = require('fs');
const path = require('path');

// Definição dos pacotes compartilhados e suas funções/componentes
const SHARED_PACKAGES = {
  '@edunexia/utils': [
    // Formatters
    'formatCurrency', 'formatDate', 'formatDateTime', 'formatNumber',
    'formatCPF', 'formatCNPJ', 'formatPhone', 'formatCEP',
    'formatPercentage', 'truncateText', 'formatName', 'formatFileSize',
    'formatDuration', 'formatRelativeTime',
    // Validators
    'isValidEmail', 'isValidCPF', 'isValidCNPJ', 'isValidUrl',
    'isValidCEP', 'isValidPhone', 'isValidPassword', 'isValidDate',
    'isFutureDate', 'isPastDate', 'isAlphaOnly', 'isAlphanumeric',
    // Utils
    'cn', 'generateId', 'delay', 'slugify', 'removeNullValues',
    'groupBy', 'sortBy', 'deepMerge', 'debounce', 'throttle', 
    'shuffle', 'uniqueArray', 'removeAccents'
  ],
  '@edunexia/ui-components': [
    'Button', 'Card', 'TextField', 'Select', 'Checkbox', 'Radio',
    'Dropdown', 'Table', 'Modal', 'Tabs', 'Accordion', 'Alert',
    'Badge', 'Avatar', 'Tooltip', 'Popover', 'Menu', 'Breadcrumb',
    'Pagination', 'Progress', 'Spinner', 'Toast', 'FormGroup',
    'FormLabel', 'FormControl', 'FormHelperText', 'FormError'
  ],
  '@edunexia/auth': [
    'useAuth', 'AuthProvider', 'requireAuth', 'withAuth',
    'useCurrentUser', 'useLogin', 'useLogout', 'useSignUp',
    'useForgotPassword', 'useResetPassword', 'isAuthenticated',
    'hasPermission', 'getAuthToken', 'parseAuthToken'
  ],
  '@edunexia/api-client': [
    'api', 'useFetch', 'useMutation', 'useQuery', 'useInfiniteQuery',
    'createClient', 'handleApiError', 'parseResponse', 'apiRoutes'
  ]
};

// Padrões de arquivos a serem verificados
const FILES_PATTERN = [
  './apps/*/src/**/*.{ts,tsx}',
  './packages/*/src/**/*.{ts,tsx}',
];

// Exceções - arquivos que não devem ser verificados
const EXCEPTIONS = [
  './packages/utils/src/**/*.ts',
  './packages/ui-components/src/**/*.ts',
  './packages/auth/src/**/*.ts',
  './packages/api-client/src/**/*.ts',
  '**/*.d.ts',
  '**/*.test.{ts,tsx}',
  '**/*.spec.{ts,tsx}',
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
 * Encontra todos os arquivos que correspondem a um padrão
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
    try {
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
    } catch (error) {
      console.error(`Erro ao ler diretório ${dir}:`, error);
    }
  }
  
  scanDir(baseDir);
  
  return results;
}

/**
 * Verifica se um arquivo está usando importações corretas
 */
function checkFile(file) {
  if (shouldIgnore(file)) return { file, issues: [] };
  
  const content = fs.readFileSync(file, 'utf-8');
  const issues = [];
  
  // Verifica cada pacote compartilhado
  for (const [packageName, exportedItems] of Object.entries(SHARED_PACKAGES)) {
    // Pula a verificação se o arquivo estiver dentro do próprio pacote
    if (file.includes(packageName.replace('@edunexia/', 'packages/'))) {
      continue;
    }
    
    // Verifica se o arquivo está importando do pacote compartilhado
    const packageImportRegex = new RegExp(`import\\s+{([^}]*)}\\s+from\\s+['"]${packageName}['"]`, 'g');
    let packageImported = false;
    let importedItems = [];
    
    let match;
    while ((match = packageImportRegex.exec(content)) !== null) {
      packageImported = true;
      const items = match[1].split(',').map(item => item.trim().split(' as ')[0].trim());
      importedItems.push(...items);
    }
    
    // Verifica importações locais que poderiam usar o pacote compartilhado
    for (const exportedItem of exportedItems) {
      // Pula se o item já está sendo importado do pacote compartilhado
      if (importedItems.includes(exportedItem)) {
        continue;
      }
      
      // Verifica importações locais
      const localImportRegex = new RegExp(`import\\s+{([^}]*${exportedItem}[^}]*)}\\s+from\\s+['"]([^'"]*(?:utils|components|hooks|formatters|validators|auth|api)[^'"]*)['"]`, 'g');
      
      while ((match = localImportRegex.exec(content)) !== null) {
        const importedLocalItems = match[1].split(',').map(item => item.trim().split(' as ')[0].trim());
        const importPath = match[2];
        
        // Verifica se o exportedItem está sendo importado localmente
        if (importedLocalItems.includes(exportedItem) && !importPath.includes('node_modules')) {
          issues.push({
            type: 'local-import',
            item: exportedItem,
            importPath,
            recommendation: `Importe "${exportedItem}" de "${packageName}" em vez de "${importPath}"`
          });
        }
      }
      
      // Verifica declarações de funções/componentes que duplicam os compartilhados
      const declarationRegex = new RegExp(`(export\\s+(const|function)\\s+${exportedItem}|export\\s+function\\s+${exportedItem}|function\\s+${exportedItem}\\s*\\()`, 'g');
      
      if (declarationRegex.test(content)) {
        issues.push({
          type: 'duplicate-implementation',
          item: exportedItem,
          recommendation: `Use "${exportedItem}" de "${packageName}" em vez de implementar localmente`
        });
      }
    }
    
    // Verifica se há tipificação de importação incorreta (usando default exports)
    if (packageImported) {
      const defaultImportRegex = new RegExp(`import\\s+[A-Za-z0-9_]+\\s+from\\s+['"]${packageName}['"]`, 'g');
      if (defaultImportRegex.test(content)) {
        issues.push({
          type: 'default-import',
          packageName,
          recommendation: `Use named imports com "${packageName}" em vez de imports default`
        });
      }
    }
  }
  
  // Verifica ordem das importações
  const importLines = content.match(/import\s+.*?from\s+['"].*?['"]/g) || [];
  
  if (importLines.length > 0) {
    const externalImports = importLines.filter(line => !line.includes('@edunexia/') && !line.includes('./') && !line.includes('../'));
    const internalSharedImports = importLines.filter(line => line.includes('@edunexia/'));
    const relativeImports = importLines.filter(line => line.includes('./') || line.includes('../'));
    
    const lastExternalImportIndex = importLines.indexOf(externalImports[externalImports.length - 1]);
    const firstInternalSharedImportIndex = internalSharedImports.length > 0 ? importLines.indexOf(internalSharedImports[0]) : -1;
    const lastInternalSharedImportIndex = internalSharedImports.length > 0 ? importLines.indexOf(internalSharedImports[internalSharedImports.length - 1]) : -1;
    const firstRelativeImportIndex = relativeImports.length > 0 ? importLines.indexOf(relativeImports[0]) : -1;
    
    if (firstInternalSharedImportIndex !== -1 && lastExternalImportIndex !== -1 && firstInternalSharedImportIndex < lastExternalImportIndex) {
      issues.push({
        type: 'import-order',
        recommendation: `As importações de pacotes externos devem vir antes das importações de pacotes compartilhados @edunexia`
      });
    }
    
    if (firstRelativeImportIndex !== -1 && lastInternalSharedImportIndex !== -1 && firstRelativeImportIndex < lastInternalSharedImportIndex) {
      issues.push({
        type: 'import-order',
        recommendation: `As importações de pacotes compartilhados @edunexia devem vir antes das importações relativas`
      });
    }
  }
  
  // Verifica importações de bibliotecas inteiras
  const wholeImports = content.match(/import\s+\*\s+as\s+[A-Za-z0-9_]+\s+from/g) || [];
  if (wholeImports.length > 0) {
    issues.push({
      type: 'whole-import',
      recommendation: `Evite importar bibliotecas inteiras com "import * as". Prefira importar apenas o que for utilizar`
    });
  }
  
  return { file, issues };
}

/**
 * Verifica todos os arquivos do projeto
 */
async function checkAllFiles() {
  console.log('Verificando se as importações seguem o padrão definido...');
  
  let files = [];
  
  // Encontra todos os arquivos que correspondem aos padrões
  for (const pattern of FILES_PATTERN) {
    const matches = findFiles(pattern);
    files = [...files, ...matches];
  }
  
  const results = [];
  
  // Verifica cada arquivo
  for (const file of files) {
    const result = checkFile(file);
    if (result.issues.length > 0) {
      results.push(result);
    }
  }
  
  const issuesByType = {
    'local-import': 0,
    'duplicate-implementation': 0,
    'default-import': 0,
    'import-order': 0,
    'whole-import': 0
  };
  
  // Exibe os resultados
  if (results.length === 0) {
    console.log('Não foram encontrados problemas de importação. Parabéns!');
    process.exit(0);
  }
  
  console.log(`\nForam encontrados problemas em ${results.length} arquivos:\n`);
  
  results.forEach(({ file, issues }) => {
    console.log(`\x1b[1m${file}\x1b[0m`);
    
    issues.forEach(issue => {
      issuesByType[issue.type]++;
      
      switch (issue.type) {
        case 'local-import':
          console.log(`  - \x1b[33mImportação local\x1b[0m: "${issue.item}" de "${issue.importPath}"`);
          break;
        case 'duplicate-implementation':
          console.log(`  - \x1b[31mImplementação duplicada\x1b[0m: "${issue.item}"`);
          break;
        case 'default-import':
          console.log(`  - \x1b[33mImportação default\x1b[0m: "${issue.packageName}"`);
          break;
        case 'import-order':
          console.log(`  - \x1b[33mOrdem de importação incorreta\x1b[0m`);
          break;
        case 'whole-import':
          console.log(`  - \x1b[33mImportação de biblioteca inteira\x1b[0m`);
          break;
      }
      
      console.log(`    \x1b[90mRecomendação: ${issue.recommendation}\x1b[0m`);
    });
    
    console.log();
  });
  
  // Resumo
  console.log('\nResumo dos problemas encontrados:');
  console.log(`- Importações locais que deveriam usar pacotes compartilhados: ${issuesByType['local-import']}`);
  console.log(`- Implementações duplicadas de funções/componentes: ${issuesByType['duplicate-implementation']}`);
  console.log(`- Importações default de pacotes que usam named exports: ${issuesByType['default-import']}`);
  console.log(`- Problemas na ordem das importações: ${issuesByType['import-order']}`);
  console.log(`- Importações de bibliotecas inteiras: ${issuesByType['whole-import']}`);
  
  console.log('\nPara mais informações sobre padronização de importações, consulte:');
  console.log('- docs/padronizacao-imports.md');
  
  // Sai com código de erro se houver problemas
  process.exit(1);
}

// Executa a verificação
checkAllFiles().catch(error => {
  console.error('Erro durante a verificação:', error);
  process.exit(1);
}); 