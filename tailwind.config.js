/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        discord: {
          'blurple': '#5865F2',
          'green': '#57F287',
          'yellow': '#FEE75C',
          'fuchsia': '#EB459E',
          'red': '#ED4245',
          'dark': '#36393f',
          'darker': '#2f3136',
          'light': '#dcddde',
          'lightest': '#f2f3f5',
          'black': '#23272A',
        }
      }
    },
  },
  plugins: [],
} 