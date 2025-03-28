const baseConfig = require('@edunexia/tailwind-config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Estender a configuração base
  presets: [baseConfig],
  // Configurações específicas do módulo, se necessário
  theme: {
    extend: {
      // Extensões específicas do módulo
    },
  },
}; 