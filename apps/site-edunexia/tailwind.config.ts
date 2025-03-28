import type { Config } from 'tailwindcss';
import sharedConfig from '@edunexia/tailwind-config';

const config: Config = {
  presets: [sharedConfig],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui-components/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cores primárias específicas do site
        primary: {
          DEFAULT: '#1E40AF',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#172554',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
};

export default config; 