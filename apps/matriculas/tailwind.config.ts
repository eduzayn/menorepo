import type { Config } from 'tailwindcss';

// Importar como require pois é um módulo CommonJS
const baseConfig = require('@edunexia/tailwind-config');

const config: Config = {
  // Estender a configuração base
  presets: [baseConfig],
  // É necessário manter o content mesmo usando presets
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Configurações específicas do módulo, se necessário
  theme: {
    extend: {
      // Extensões específicas do módulo
    },
  },
};

export default config; 