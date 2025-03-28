// script-test.js
console.log("======= Executando verificação simplificada dos componentes UI =======");

// Listar os componentes disponíveis
const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components');

try {
  console.log("Componentes disponíveis:");
  const components = fs.readdirSync(componentsDir);
  
  components.forEach(comp => {
    try {
      const stats = fs.statSync(path.join(componentsDir, comp));
      if (stats.isDirectory()) {
        console.log(`✅ ${comp}`);
        
        // Verificar arquivos no diretório do componente
        const files = fs.readdirSync(path.join(componentsDir, comp));
        files.forEach(file => {
          console.log(`  - ${file}`);
        });
      }
    } catch (err) {
      console.log(`❌ Erro ao verificar componente ${comp}: ${err.message}`);
    }
  });
  
  // Verificar testes
  console.log("\nTestes disponíveis:");
  const testsDir = path.join(__dirname, 'src', '__tests__');
  const tests = fs.readdirSync(testsDir);
  
  tests.forEach(test => {
    console.log(`✅ ${test}`);
    // Ler conteúdo do teste para mostrar casos de teste
    const content = fs.readFileSync(path.join(testsDir, test), 'utf8');
    
    // Extrair descrições de testes (de forma simplificada)
    const itMatches = content.match(/it\(['"](.*?)['"]/g);
    if (itMatches) {
      itMatches.forEach(match => {
        console.log(`  - ${match.replace(/it\(['"]/, '').replace(/['"].*$/, '')}`);
      });
    }
  });
  
  console.log("\n======= Verificação concluída com sucesso =======");
  process.exit(0);
} catch (err) {
  console.error("❌ Erro ao executar verificação:", err);
  process.exit(1);
} 