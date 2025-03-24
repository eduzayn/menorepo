/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#E6F0FF', // azul claro
          DEFAULT: '#3B82F6', // azul principal
          dark: '#1E40AF', // azul escuro
        },
        accent: {
          mint: '#86EFAC', // verde menta
          lavender: '#E9D5FF', // lilás claro
        },
        neutral: {
          lightest: '#FFFFFF',
          light: '#F8FAFC',
          DEFAULT: '#F1F5F9',
          dark: '#64748B',
        }
      }
    }
  },
  plugins: [],
} 