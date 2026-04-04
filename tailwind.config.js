/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#dc2626',
          hover: '#b91c1c',
          light: '#fef2f2',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      aspectRatio: {
        '16/9': '16 / 9',
      },
      lineClamp: {
        2: '2',
        3: '3',
      },
    },
  },
  plugins: [],
};
