/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#E6F4FF',
          DEFAULT: '#1890FF',
          dark: '#0960D0',
        },
        neutral: {
          lightest: '#F5F5F5',
          light: '#E8E8E8',
          DEFAULT: '#8C8C8C',
          dark: '#262626',
        },
      },
    },
  },
  plugins: [],
} 