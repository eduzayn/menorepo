#!/usr/bin/env node

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import open from 'open';

// Configurações
const APPS_DIR = path.resolve(process.cwd(), '../../apps');
const PACKAGES_DIR = path.resolve(process.cwd(), '../../packages');
const REPORT_DIR = path.resolve(process.cwd(), '../../coverage-report');
const NYCRC_PATH = path.resolve(process.cwd(), '../../.nycrc.json');

interface ModuleCoverage {
  module: string;
  path: string;
  statements: number;
  branches: number;
  functions: number;
  lines: number;
  below: boolean;
}

/**
 * Limpa a pasta de relatórios
 */
function limparReports() {
  console.log(chalk.blue('🧹 Limpando diretório de relatórios consolidados...'));
  
  if (fs.existsSync(REPORT_DIR)) {
    fs.rmSync(REPORT_DIR, { recursive: true, force: true });
  }
  
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  console.log(chalk.green('✓ Diretório de relatórios limpo!'));
}

/**
 * Cria um arquivo de configuração temporário para o NYC
 */
function criarNYCConfig() {
  console.log(chalk.blue('📝 Criando configuração para NYC...'));
  
  const nycConfig = {
    "extends": "@istanbuljs/nyc-config-typescript",
    "all": true,
    "check-coverage": true,
    "include": [
      "apps/*/src/**/*.{js,ts,jsx,tsx}",
      "packages/*/src/**/*.{js,ts,jsx,tsx}"
    ],
    "exclude": [
      "**/node_modules/**",
      "**/dist/**",
      "**/*.d.ts",
      "**/__tests__/**",
      "**/__mocks__/**",
      "**/*.{test,spec}.*"
    ],
    "reporter": [
      "html",
      "lcov",
      "text",
      "text-summary"
    ],
    "report-dir": "./coverage-report"
  };
  
  fs.writeFileSync(NYCRC_PATH, JSON.stringify(nycConfig, null, 2));
  console.log(chalk.green('✓ Configuração do NYC criada!'));
}

/**
 * Encontra todos os diretórios que contém testes
 * @param baseDir Diretório base a ser verificado 
 * @returns Lista de diretórios com testes
 */
function encontrarDiretoriosComTestes(baseDir: string): string[] {
  console.log(chalk.blue(`🔍 Procurando diretórios com testes em ${path.relative(process.cwd(), baseDir)}...`));
  
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
           packageJson.scripts['test:coverage'])
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
 * Executa os testes com cobertura para um diretório específico
 * @param diretorio Diretório a ser testado
 * @returns Informações sobre a cobertura do módulo
 */
function executarTestesComCobertura(diretorio: string): ModuleCoverage | null {
  const dirName = path.basename(diretorio);
  console.log(chalk.blue(`🧪 Executando testes com cobertura em ${dirName}...`));
  
  try {
    // Executar os testes com cobertura
    execSync(`cd ${diretorio} && yarn test:coverage`, {
      stdio: 'inherit'
    });
    
    // Verificar se o relatório de cobertura foi gerado
    const coverageSummaryPath = path.join(diretorio, 'coverage/coverage-summary.json');
    
    if (fs.existsSync(coverageSummaryPath)) {
      const summaryCoverage = JSON.parse(fs.readFileSync(coverageSummaryPath, 'utf-8'));
      const totalCoverage = summaryCoverage.total;
      
      // Verificar se está abaixo do threshold
      const isBelow = 
        totalCoverage.statements.pct < 80 || 
        totalCoverage.branches.pct < 80 || 
        totalCoverage.functions.pct < 80 || 
        totalCoverage.lines.pct < 80;
      
      return {
        module: dirName,
        path: diretorio,
        statements: totalCoverage.statements.pct,
        branches: totalCoverage.branches.pct,
        functions: totalCoverage.functions.pct,
        lines: totalCoverage.lines.pct,
        below: isBelow
      };
    }
    
    console.warn(chalk.yellow(`⚠️ Não foi possível encontrar relatório de cobertura para ${dirName}`));
    return null;
  } catch (error) {
    console.error(chalk.red(`❌ Falha nos testes de cobertura em ${dirName}`));
    return null;
  }
}

/**
 * Consolida os relatórios de cobertura usando o nyc
 * @param diretorios Lista de diretórios com testes
 */
function consolidarRelatorios(diretorios: string[]): void {
  console.log(chalk.blue('\n📊 Consolidando relatórios de cobertura...'));
  
  try {
    // Criar uma lista de todos os arquivos lcov.info
    const lcovFiles = diretorios
      .map(dir => path.join(dir, 'coverage/lcov.info'))
      .filter(file => fs.existsSync(file));
    
    if (lcovFiles.length === 0) {
      console.warn(chalk.yellow('⚠️ Nenhum arquivo lcov.info encontrado!'));
      return;
    }
    
    // Criar diretório temporário para relatórios
    const tempDir = path.resolve(process.cwd(), '../../temp-coverage');
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    fs.mkdirSync(tempDir, { recursive: true });
    
    // Copiar todos os lcov.info para o diretório temporário, renomeando para evitar conflitos
    lcovFiles.forEach((file, index) => {
      fs.copyFileSync(file, path.join(tempDir, `lcov-${index}.info`));
    });
    
    // Executar o nyc para gerar o relatório consolidado
    console.log(chalk.blue('🔄 Gerando relatório consolidado com NYC...'));
    execSync(`nyc report --reporter=html --reporter=lcov --reporter=text --report-dir="${REPORT_DIR}"`, {
      stdio: 'inherit'
    });
    
    // Limpar diretório temporário
    fs.rmSync(tempDir, { recursive: true, force: true });
    
    console.log(chalk.green('✓ Relatório consolidado gerado com sucesso!'));
  } catch (error) {
    console.error(chalk.red('❌ Falha ao consolidar relatórios:'), error);
  }
}

/**
 * Exibe um resumo da cobertura de todos os módulos
 * @param modulesCoverage Lista de coberturas por módulo
 */
function exibirResumoCoberturas(modulesCoverage: ModuleCoverage[]): void {
  console.log(chalk.blue('\n📊 RESUMO DE COBERTURA POR MÓDULO'));
  console.log(chalk.blue('============================='));
  
  // Calcular médias
  const totals = modulesCoverage.reduce(
    (acc, curr) => {
      acc.statements += curr.statements;
      acc.branches += curr.branches;
      acc.functions += curr.functions;
      acc.lines += curr.lines;
      return acc;
    },
    { statements: 0, branches: 0, functions: 0, lines: 0 }
  );
  
  const count = modulesCoverage.length;
  const averages = {
    statements: totals.statements / count,
    branches: totals.branches / count,
    functions: totals.functions / count,
    lines: totals.lines / count
  };
  
  // Mostrar tabela
  console.log('┌─────────────────────┬────────────┬──────────┬────────────┬─────────┐');
  console.log('│ Módulo              │ Statements │ Branches │ Functions  │ Lines   │');
  console.log('├─────────────────────┼────────────┼──────────┼────────────┼─────────┤');
  
  modulesCoverage.forEach(coverage => {
    const moduleName = coverage.module.padEnd(19);
    const statements = `${coverage.statements.toFixed(2)}%`.padEnd(10);
    const branches = `${coverage.branches.toFixed(2)}%`.padEnd(8);
    const functions = `${coverage.functions.toFixed(2)}%`.padEnd(10);
    const lines = `${coverage.lines.toFixed(2)}%`.padEnd(7);
    
    const color = coverage.below ? chalk.red : chalk.green;
    console.log(color(`│ ${moduleName} │ ${statements} │ ${branches} │ ${functions} │ ${lines} │`));
  });
  
  console.log('├─────────────────────┼────────────┼──────────┼────────────┼─────────┤');
  const avgStatements = `${averages.statements.toFixed(2)}%`.padEnd(10);
  const avgBranches = `${averages.branches.toFixed(2)}%`.padEnd(8);
  const avgFunctions = `${averages.functions.toFixed(2)}%`.padEnd(10);
  const avgLines = `${averages.lines.toFixed(2)}%`.padEnd(7);
  console.log(chalk.blue(`│ MÉDIAS             │ ${avgStatements} │ ${avgBranches} │ ${avgFunctions} │ ${avgLines} │`));
  console.log('└─────────────────────┴────────────┴──────────┴────────────┴─────────┘');
  
  // Identificar módulos abaixo do threshold
  const belowThreshold = modulesCoverage.filter(c => c.below);
  if (belowThreshold.length > 0) {
    console.log(chalk.yellow('\n⚠️ MÓDULOS ABAIXO DO THRESHOLD DE 80%:'));
    belowThreshold.forEach(coverage => {
      console.log(chalk.yellow(`  - ${coverage.module}`));
    });
  }
}

/**
 * Abre o relatório HTML no navegador
 */
function abrirRelatorioHTML(): void {
  const reportPath = path.join(REPORT_DIR, 'index.html');
  if (fs.existsSync(reportPath)) {
    console.log(chalk.blue('\n🌐 Abrindo relatório HTML no navegador...'));
    open(reportPath);
  } else {
    console.warn(chalk.yellow('\n⚠️ Relatório HTML não encontrado!'));
  }
}

/**
 * Função principal
 */
async function main() {
  console.log(chalk.blue('\n📊 EDUNEXIA - RELATÓRIO DE COBERTURA DE TESTES'));
  console.log(chalk.blue('===========================================\n'));
  
  // Limpar diretório de relatórios
  limparReports();
  
  // Criar configuração do NYC
  criarNYCConfig();
  
  // Encontrar diretórios com testes
  const appDirs = encontrarDiretoriosComTestes(APPS_DIR);
  const packageDirs = encontrarDiretoriosComTestes(PACKAGES_DIR);
  const todosDiretorios = [...appDirs, ...packageDirs];
  
  // Registrar início
  const tempoInicio = Date.now();
  
  // Executar testes com cobertura em cada diretório
  console.log(chalk.blue('\n🧪 Executando testes com cobertura em todos os módulos...'));
  const modulesCoverage: ModuleCoverage[] = [];
  
  for (const diretorio of todosDiretorios) {
    const coverage = executarTestesComCobertura(diretorio);
    if (coverage) {
      modulesCoverage.push(coverage);
    }
  }
  
  // Consolidar relatórios
  consolidarRelatorios(todosDiretorios);
  
  // Exibir resumo
  exibirResumoCoberturas(modulesCoverage);
  
  // Calcular tempo
  const tempoTotal = (Date.now() - tempoInicio) / 1000;
  console.log(chalk.blue(`\nTempo total: ${tempoTotal.toFixed(2)}s`));
  
  // Abrir relatório HTML
  abrirRelatorioHTML();
  
  // Status de saída
  const belowThreshold = modulesCoverage.filter(c => c.below);
  if (belowThreshold.length > 0) {
    console.log(chalk.yellow(`\n⚠️ ${belowThreshold.length} módulos estão abaixo do threshold de cobertura!`));
    process.exit(1);
  } else {
    console.log(chalk.green('\n✅ Todos os módulos atendem ou excedem o threshold de cobertura!\n'));
    process.exit(0);
  }
}

// Executar função principal
main().catch(error => {
  console.error(chalk.red('Erro não tratado:'), error);
  process.exit(1);
}); 