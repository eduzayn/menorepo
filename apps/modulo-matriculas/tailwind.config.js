/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F9CF9',
        secondary: '#8EE4AF',
        background: '#F5F5F5',
        text: '#333333',
      },
    },
  },
  plugins: [],
} 