import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);

// Lista de arquivos antigos de autenticação marcados como @deprecated
const arquivosObsoletos = [
  'apps/matriculas/src/hooks/useAuth.ts',
  'apps/matriculas/src/contexts/AuthContext.tsx',
  'apps/financeiro-empresarial/src/hooks/useAuth.ts',
  'apps/portal-parceiro/src/contexts/AuthContext.js',
  'apps/portal-parceiro/src/hooks/useAuth.js',
  'apps/portal-parceiro/src/hooks/useAuth.ts',
  'apps/comunicacao/src/hooks/useAuth.ts',
  'apps/comunicacao/src/components/auth/ProtectedRoute.tsx',
  'apps/matriculas/src/components/Protected.tsx',
  'apps/site-edunexia/src/components/ProtectedRoute.tsx'
];

// Verificar arquivos que contêm código antigo de autenticação
async function buscarArquivosAuthAntigos(diretorio: string): Promise<string[]> {
  const arquivosEncontrados: string[] = [];
  
  try {
    const listaArquivos = await readdir(diretorio);
    
    for (const arquivo of listaArquivos) {
      const caminho = path.join(diretorio, arquivo);
      const stats = await stat(caminho);
      
      if (stats.isDirectory()) {
        // Ignorar node_modules e diretórios .git
        if (arquivo !== 'node_modules' && arquivo !== '.git') {
          const subArquivos = await buscarArquivosAuthAntigos(caminho);
          arquivosEncontrados.push(...subArquivos);
        }
      } else if (arquivo.endsWith('.ts') || arquivo.endsWith('.tsx') || arquivo.endsWith('.js') || arquivo.endsWith('.jsx')) {
        // Verificar se o arquivo tem referências a implementações antigas
        const conteudo = fs.readFileSync(caminho, 'utf8');
        
        if (
          conteudo.includes('@deprecated') && 
          conteudo.includes('auth') && 
          !caminho.includes('packages/auth') &&
          !arquivosObsoletos.includes(caminho.replace(/\\/g, '/'))
        ) {
          arquivosEncontrados.push(caminho.replace(/\\/g, '/'));
        }
      }
    }
    
    return arquivosEncontrados;
  } catch (err) {
    console.error(`Erro ao verificar diretório ${diretorio}:`, err);
    return [];
  }
}

// Criar backup de um arquivo
function criarBackup(caminho: string): void {
  try {
    const conteudo = fs.readFileSync(caminho, 'utf8');
    fs.writeFileSync(`${caminho}.bak`, conteudo);
    console.log(`Backup criado: ${caminho}.bak`);
  } catch (err) {
    console.error(`Erro ao criar backup de ${caminho}:`, err);
  }
}

// Excluir arquivos obsoletos
async function excluirArquivosObsoletos(): Promise<void> {
  console.log('Iniciando migração do sistema de autenticação...');
  
  // Verificar se existem outros arquivos obsoletos não listados
  const outrosArquivosObsoletos = await buscarArquivosAuthAntigos('apps');
  
  // Adicionar à lista principal
  const todosArquivosObsoletos = [
    ...arquivosObsoletos,
    ...outrosArquivosObsoletos.filter(caminho => !arquivosObsoletos.includes(caminho))
  ];
  
  console.log(`\nTotal de ${todosArquivosObsoletos.length} arquivos de autenticação antigos encontrados.`);
  
  // Criar diretório para backups se não existir
  if (!fs.existsSync('./backups')) {
    fs.mkdirSync('./backups');
  }
  
  // Excluir cada arquivo, criando backup primeiro
  for (const caminho of todosArquivosObsoletos) {
    try {
      if (fs.existsSync(caminho)) {
        console.log(`Processando: ${caminho}`);
        criarBackup(caminho);
        await unlink(caminho);
        console.log(`Arquivo removido: ${caminho}`);
      }
    } catch (err) {
      console.error(`Erro ao remover arquivo ${caminho}:`, err);
    }
  }
  
  console.log('\nMigração concluída!');
  console.log('Todos os arquivos de autenticação antigos foram removidos.');
  console.log('Os backups foram salvos com a extensão .bak nos mesmos diretórios.');
}

// Executar o script
excluirArquivosObsoletos()
  .then(() => {
    console.log('Script finalizado com sucesso.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Erro ao executar o script:', err);
    process.exit(1);
  }); 