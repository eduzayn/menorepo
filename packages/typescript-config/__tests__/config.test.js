import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('TypeScript Configs', () => {
  const configFiles = [
    'base.json',
    'react-app.json',
    'react-library.json',
    'nextjs.json',
    'vite.json',
    'vite-node.json'
  ];

  configFiles.forEach(configFile => {
    describe(`${configFile}`, () => {
      const configPath = path.resolve(__dirname, '..', configFile);
      let configContent;

      it(`o arquivo ${configFile} deve existir`, () => {
        expect(fs.existsSync(configPath)).toBe(true);
      });

      it(`${configFile} deve conter JSON válido`, () => {
        configContent = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        expect(configContent).toBeTypeOf('object');
      });

      it(`${configFile} deve conter propriedades essenciais`, () => {
        configContent = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        
        // Os arquivos podem estender outros configs ou definir propriedades diretamente
        const hasExtendsOrCompilerOptions = 
          Object.prototype.hasOwnProperty.call(configContent, 'extends') ||
          Object.prototype.hasOwnProperty.call(configContent, 'compilerOptions');
          
        expect(hasExtendsOrCompilerOptions).toBe(true);
      });
    });
  });

  it('base.json deve definir configurações fundamentais', () => {
    const basePath = path.resolve(__dirname, '..', 'base.json');
    const baseConfig = JSON.parse(fs.readFileSync(basePath, 'utf8'));
    
    expect(baseConfig.compilerOptions).toBeDefined();
    expect(baseConfig.compilerOptions.strict).toBe(true);
  });
}); 