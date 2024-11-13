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
        'inter'  : ['Inter']
      },
      backgroundColor:{
        'blue' : '#2984FF',
        'greyCustom' : '#A8AFBD',
        'black' : '#101010',
        'orange' : '#f97316',
        'white' : '#FFFFFF',
        'custom': '#3182ce;'
      },
      textColor:{
        'blue' : '#2984FF',
        'gray' : '#A8AFBD',
        'black' : '#101010',
        'orange' : '#FE774E',
        'white' : '#FFFFFF',
        'custom': '#3182ce;'

      }
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ["light"],
  },
}