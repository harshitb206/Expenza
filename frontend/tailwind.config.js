/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'background-light': '#F8F8F8',
        'background-dark': '#FFFFFF',
        'text-dark': '#262626',
        'card-light': '#EFEFEF',
        'accent-orange': '#FF9900',
        'accent-yellow': '#FFC700',
      },
    },
  },
  plugins: [],
};