const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('Iniciando atualização dos arquivos tsconfig.json...');

// Encontrar todos os diretórios de projetos
const appsProjects = glob.sync('apps/*').filter(dir => 
  fs.statSync(dir).isDirectory() && !dir.includes('node_modules')
);

const packagesProjects = glob.sync('packages/*').filter(dir => 
  fs.statSync(dir).isDirectory() && !dir.includes('node_modules')
);

const projects = [...appsProjects, ...packagesProjects];

console.log(`Encontrados ${projects.length} projetos para atualizar.`);

// Template para tsconfig.json de projetos apps (que usam Vite)
const generateAppTsConfig = (projectName) => {
  // Preservar as configurações específicas de paths se existirem
  let existingConfig = {};
  const tsconfigPath = path.join('apps', projectName, 'tsconfig.json');
  
  if (fs.existsSync(tsconfigPath)) {
    try {
      existingConfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    } catch (e) {
      console.warn(`Não foi possível ler o arquivo existente em ${tsconfigPath}: ${e.message}`);
    }
  }

  // Manter os paths personalizados se existirem
  const paths = existingConfig.compilerOptions?.paths || { "@/*": ["./src/*"] };

  return {
    extends: "../../packages/typescript-config/vite.json",
    compilerOptions: {
      composite: true,
      baseUrl: ".",
      paths: paths
    },
    include: existingConfig.include || ["src"]
  };
};

// Template para tsconfig.json de pacotes
const generatePackageTsConfig = (projectName) => {
  // Preservar as configurações específicas se existirem
  let existingConfig = {};
  const tsconfigPath = path.join('packages', projectName, 'tsconfig.json');
  
  if (fs.existsSync(tsconfigPath)) {
    try {
      existingConfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    } catch (e) {
      console.warn(`Não foi possível ler o arquivo existente em ${tsconfigPath}: ${e.message}`);
    }
  }

  // Determinar qual base estender com base no tipo de pacote
  let extendsBase = "../typescript-config/base.json";
  
  // Se já estende de um arquivo específico, converter para caminho relativo
  if (existingConfig.extends) {
    if (existingConfig.extends.startsWith('@edunexia/typescript-config/')) {
      // Converter de @edunexia/typescript-config/X.json para ../typescript-config/X.json
      const configFile = existingConfig.extends.split('/').pop();
      extendsBase = `../typescript-config/${configFile}`;
    } else if (!existingConfig.extends.startsWith('..')) {
      // Manter o extends existente se já for um caminho relativo
      extendsBase = existingConfig.extends;
    }
  }

  return {
    extends: extendsBase,
    compilerOptions: {
      composite: true,
      baseUrl: ".",
      paths: existingConfig.compilerOptions?.paths || { "@/*": ["./src/*"] },
      outDir: "./dist",
      rootDir: "./src"
    },
    include: existingConfig.include || ["src"],
    exclude: ["node_modules", "dist"]
  };
};

// Atualizar o tsconfig.json em cada projeto de apps
console.log('Atualizando projetos em apps/...');
appsProjects.forEach(projectPath => {
  const projectName = path.basename(projectPath);
  const tsconfigPath = path.join(projectPath, 'tsconfig.json');
  const config = generateAppTsConfig(projectName);
  
  fs.writeFileSync(
    tsconfigPath,
    JSON.stringify(config, null, 2),
    { encoding: 'utf8' }
  );
  
  console.log(`  Atualizado ${tsconfigPath}`);
});

// Atualizar o tsconfig.json em cada projeto de packages
console.log('Atualizando projetos em packages/...');
packagesProjects.forEach(projectPath => {
  const projectName = path.basename(projectPath);
  const tsconfigPath = path.join(projectPath, 'tsconfig.json');
  const config = generatePackageTsConfig(projectName);
  
  fs.writeFileSync(
    tsconfigPath,
    JSON.stringify(config, null, 2),
    { encoding: 'utf8' }
  );
  
  console.log(`  Atualizado ${tsconfigPath}`);
});

// Gerar o arquivo tsconfig.json raiz com referências
console.log('Atualizando tsconfig.json raiz...');
const rootTsConfig = {
  extends: "./tsconfig.base.json",
  compilerOptions: {
    target: "ES2020",
    module: "ESNext",
    moduleResolution: "node",
    esModuleInterop: true,
    forceConsistentCasingInFileNames: true,
    strict: true,
    skipLibCheck: true,
    baseUrl: ".",
    paths: {
      "@edunexia/*": ["./packages/*/src"],
      "@apps/*": ["./apps/*/src"]
    }
  },
  references: projects.map(projectPath => ({ path: projectPath })),
  exclude: ["node_modules", "apps/**/*", "packages/**/*"],
  include: ["./scripts/**/*.ts"]
};

fs.writeFileSync(
  'tsconfig.json',
  JSON.stringify(rootTsConfig, null, 2),
  { encoding: 'utf8' }
);

console.log('Atualizado tsconfig.json raiz com sucesso.');
console.log('Processo de atualização concluído. Verifique se todas as configurações foram aplicadas corretamente.');
console.log('Para testar, execute: pnpm build'); 