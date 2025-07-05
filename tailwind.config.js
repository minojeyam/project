/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        teal: {
          50: 'rgb(240, 253, 250)',
          100: 'rgb(204, 251, 241)',
          200: 'rgb(153, 246, 228)',
          300: 'rgb(94, 234, 212)',
          400: 'rgb(45, 212, 191)',
          500: 'rgb(20, 184, 166)',
          600: 'rgb(13, 148, 136)',
          700: 'rgb(15, 118, 110)',
          800: 'rgb(17, 94, 89)',
          900: 'rgb(19, 78, 74)',
        },
        coral: {
          50: 'rgb(254, 242, 242)',
          100: 'rgb(254, 226, 226)',
          200: 'rgb(254, 202, 202)',
          300: 'rgb(252, 165, 165)',
          400: 'rgb(248, 113, 113)',
          500: 'rgb(239, 68, 68)',
          600: 'rgb(220, 38, 38)',
          700: 'rgb(185, 28, 28)',
          800: 'rgb(153, 27, 27)',
          900: 'rgb(127, 29, 29)',
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
    },
  },
  plugins: [],
};