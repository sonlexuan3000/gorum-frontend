/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cozy Beige/Brown palette
        primary: {
          50: '#fdfaf6',
          100: '#f9f1e7',
          200: '#f3e0c7',
          300: '#e8c8a0',
          400: '#d9a574',
          500: '#c88653',
          600: '#b66f42',
          700: '#985938',
          800: '#7c4a33',
          900: '#653e2c',
        },
        secondary: {
          50: '#faf8f5',
          100: '#f0ebe3',
          200: '#e4dace',
          300: '#d1c3b0',
          400: '#bba88f',
          500: '#a18d71',
          600: '#8a7660',
          700: '#726050',
          800: '#5e5044',
          900: '#4e433a',
        },
        accent: {
          50: '#fef6ee',
          100: '#fdebd7',
          200: '#fad3ae',
          300: '#f6b67a',
          400: '#f18f44',
          500: '#ed711f',
          600: '#de5715',
          700: '#b84013',
          800: '#933417',
          900: '#762d16',
        },
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'soft-xl': '0 8px 24px rgba(0, 0, 0, 0.1)',
        'inner-soft': 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}