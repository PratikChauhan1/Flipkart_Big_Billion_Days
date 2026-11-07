/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        flipkart: {
          blue: '#2874f0',
          darkBlue: '#1c52a8',
          yellow: '#ffe500',
          orange: '#fb641b',
          green: '#388e3c',
          bg: '#f1f3f6'
        }
      }
    },
  },
  plugins: [],
}
