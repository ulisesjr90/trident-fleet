/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        // Primary Colors
        'trident-blue': {
          50: '#e6f1ff',
          100: '#b3d7ff',
          200: '#80bdff',
          300: '#4da3ff',
          400: '#1a89ff',
          500: '#0070e0',  // Main brand blue
          600: '#0057b3',
          700: '#003d80',
          800: '#00244d',
          900: '#00121a'
        },
        'trident-yellow': {
          50: '#fff9e6',
          100: '#ffefb3',
          200: '#ffe580',
          300: '#ffdb4d',
          400: '#ffd11a',
          500: '#ffc700',  // Main brand yellow
          600: '#cca000',
          700: '#997a00',
          800: '#665200',
          900: '#332900'
        },
        
        // Status Colors
        'status': {
          'success': {
            DEFAULT: '#2ecc71',
            light: '#d4edda',
          },
          'warning': {
            DEFAULT: '#f39c12',
            light: '#fff3cd',
          },
          'danger': {
            DEFAULT: '#e74c3c',
            light: '#f8d7da',
          },
          'info': {
            DEFAULT: '#3498db',
            light: '#d1ecf1',
          }
        }
      },
      // Reusable Component Tokens
      borderRadius: {
        'component': '0.375rem', // 6px
        'badge': '0.25rem', // 4px
      },
      boxShadow: {
        'component': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'hover': '0 4px 6px rgba(0, 0, 0, 0.15)'
      }
    },
  },
  plugins: [],
  darkMode: 'class'
} 