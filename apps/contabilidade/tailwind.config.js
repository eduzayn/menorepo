/** @type {import('tailwindcss').Config} */
module.exports = {
  // Estender a configuração base do design system
  presets: [require('@edunexia/ui-components/tailwind.config')],
  
  // Diretório de conteúdo
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Incluir componentes do design system
    "../../packages/ui-components/src/**/*.{js,ts,jsx,tsx}",
  ],
  
  theme: {
    extend: {
      // Extensões específicas para contabilidade
      colors: {
        // Cores específicas para indicadores financeiros e contábeis
        'contabil': {
          'positivo': {
            DEFAULT: '#10b981',
            50: '#ecfdf5',
            100: '#d1fae5',
            200: '#a7f3d0',
            500: '#10b981',
            700: '#047857',
            900: '#064e3b'
          },
          'negativo': {
            DEFAULT: '#ef4444',
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            500: '#ef4444',
            700: '#b91c1c',
            900: '#7f1d1d'
          },
          'neutro': {
            DEFAULT: '#3b82f6',
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            500: '#3b82f6',
            700: '#1d4ed8',
            900: '#1e3a8a'
          },
        }
      },
      // Fontes específicas para números e valores monetários
      fontFamily: {
        'mono': ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
    },
  },
  
  plugins: [require('tailwindcss-animate')],
}; 