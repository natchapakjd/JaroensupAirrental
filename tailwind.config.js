/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        'prompt' : ['Prompt','sans-serif'],
      },
      backgroundColor:{
        'blue' : '#5ECFF2'
      }
    },
  },
  plugins: [require('daisyui')],
}