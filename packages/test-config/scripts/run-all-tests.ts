#!/usr/bin/env node

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

// Configurações
const APPS_DIR = path.resolve(process.cwd(), '../../apps');
const PACKAGES_DIR = path.resolve(process.cwd(), '../../packages');
const REPORT_DIR = path.resolve(process.cwd(), '../../test-reports');

/**
 * Limpa a pasta de relatórios
 */
function limparReports() {
  console.log(chalk.blue('🧹 Limpando diretório de relatórios...'));
  
  if (fs.existsSync(REPORT_DIR)) {
    fs.rmSync(REPORT_DIR, { recursive: true, force: true });
  }
  
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  console.log(chalk.green('✓ Diretório de relatórios limpo!'));
}

/**
 * Encontra todos os diretórios que contém testes
 * @param baseDir Diretório base a ser verificado 
 * @returns Lista de diretórios com testes
 */
function encontrarDiretoriosComTestes(baseDir: string): string[] {
  console.log(chalk.blue(`🔍 Procurando testes em ${path.relative(process.cwd(), baseDir)}...`));
  
  const diretorios: string[] = [];
  
  // Listar todos os subdiretórios
  const subDirs = fs.readdirSync(baseDir).filter(dir => {
    const fullPath = path.join(baseDir, dir);
    return fs.statSync(fullPath).isDirectory();
  });
  
  // Verificar se cada subdiretório tem package.json e scripts de teste
  for (const dir of subDirs) {
    const packageJsonPath = path.join(baseDir, dir, 'package.json');
    
    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        
        // Verificar se tem script de teste
        if (
          packageJson.scripts && 
          (packageJson.scripts.test || 
           packageJson.scripts['test:unit'] || 
           packageJson.scripts['test:e2e'] ||
           packageJson.scripts['test:component'])
        ) {
          diretorios.push(path.join(baseDir, dir));
        }
      } catch (e) {
        console.error(chalk.red(`Erro ao ler package.json em ${dir}: ${e}`));
      }
    }
  }
  
  console.log(chalk.green(`✓ Encontrados ${diretorios.length} diretórios com testes!`));
  return diretorios;
}

/**
 * Executa os testes em um diretório específico
 * @param diretorio Diretório que contém testes para executar
 * @param tipoTeste Tipo de teste a ser executado (unit, component, e2e)
 * @returns True se passou, false se falhou
 */
function executarTestesEmDiretorio(diretorio: string, tipoTeste: 'unit' | 'component' | 'e2e'): boolean {
  const dirName = path.basename(diretorio);
  const scriptNome = tipoTeste === 'unit' ? 'test' : `test:${tipoTeste}`;
  
  // Verificar se o script existe no package.json
  const packageJsonPath = path.join(diretorio, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  
  // Se não tem o script específico, mas tem o script genérico 'test', usar ele para unit test
  if (tipoTeste === 'unit' && !packageJson.scripts['test:unit'] && packageJson.scripts.test) {
    // Usar o script padrão
  } else if (!packageJson.scripts[scriptNome]) {
    console.log(chalk.yellow(`⚠️ Pulando ${dirName}: Script '${scriptNome}' não encontrado`));
    return true; // Não é erro, apenas não tem este tipo de teste
  }
  
  console.log(chalk.blue(`🧪 Executando testes ${tipoTeste} em ${dirName}...`));
  
  try {
    execSync(`cd ${diretorio} && yarn ${scriptNome}`, {
      stdio: 'inherit'
    });
    console.log(chalk.green(`✓ Testes ${tipoTeste} em ${dirName} passaram!`));
    return true;
  } catch (error) {
    console.error(chalk.red(`❌ Falha nos testes ${tipoTeste} em ${dirName}`));
    return false;
  }
}

/**
 * Executa todos os testes de um tipo específico em todos os diretórios
 * @param diretorios Lista de diretórios para testar
 * @param tipoTeste Tipo de teste (unit, component, e2e)
 * @returns Objeto com resultado dos testes
 */
function executarTodosTestes(diretorios: string[], tipoTeste: 'unit' | 'component' | 'e2e'): { sucesso: number; falhas: number } {
  console.log(chalk.blue(`\n🚀 Iniciando testes ${tipoTeste.toUpperCase()}...`));
  
  let sucessos = 0;
  let falhas = 0;
  
  for (const diretorio of diretorios) {
    const passou = executarTestesEmDiretorio(diretorio, tipoTeste);
    if (passou) {
      sucessos++;
    } else {
      falhas++;
    }
  }
  
  return { sucesso: sucessos, falhas };
}

/**
 * Função principal
 */
async function main() {
  console.log(chalk.blue('\n📊 EDUNEXIA - Execução de Testes Automatizados'));
  console.log(chalk.blue('===========================================\n'));
  
  // Limpar diretório de relatórios
  limparReports();
  
  // Encontrar diretórios com testes
  const appDirs = encontrarDiretoriosComTestes(APPS_DIR);
  const packageDirs = encontrarDiretoriosComTestes(PACKAGES_DIR);
  const todosDiretorios = [...appDirs, ...packageDirs];
  
  // Registrar início
  const tempoInicio = Date.now();
  
  // Executar testes unitários
  const resultadosUnit = executarTodosTestes(todosDiretorios, 'unit');
  
  // Executar testes de componentes
  const resultadosComp = executarTodosTestes(todosDiretorios, 'component');
  
  // Executar testes e2e
  const resultadosE2E = executarTodosTestes(todosDiretorios, 'e2e');
  
  // Calcular tempo
  const tempoTotal = (Date.now() - tempoInicio) / 1000;
  
  // Resultados
  console.log(chalk.blue('\n📊 RESUMO DOS TESTES'));
  console.log(chalk.blue('==================='));
  console.log(`${chalk.blue('Unitários:')} ${resultadosUnit.sucesso} passaram, ${resultadosUnit.falhas} falharam`);
  console.log(`${chalk.blue('Componentes:')} ${resultadosComp.sucesso} passaram, ${resultadosComp.falhas} falharam`);
  console.log(`${chalk.blue('E2E:')} ${resultadosE2E.sucesso} passaram, ${resultadosE2E.falhas} falharam`);
  console.log(chalk.blue(`\nTempo total: ${tempoTotal.toFixed(2)}s`));
  
  // Status de saída
  const falhasTotal = resultadosUnit.falhas + resultadosComp.falhas + resultadosE2E.falhas;
  
  if (falhasTotal === 0) {
    console.log(chalk.green('\n✅ TODOS OS TESTES PASSARAM\n'));
    process.exit(0);
  } else {
    console.log(chalk.red(`\n❌ ${falhasTotal} TESTES FALHARAM\n`));
    process.exit(1);
  }
}

// Executar função principal
main().catch(error => {
  console.error(chalk.red('Erro não tratado:'), error);
  process.exit(1);
}); 