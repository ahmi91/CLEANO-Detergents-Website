/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#172554',
        },
        cleano: {
          blue:    '#1B4FD8',
          sky:     '#38BDF8',
          navy:    '#0F2B6B',
          light:   '#EFF6FF',
          accent:  '#06B6D4',
          gold:    '#F59E0B',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body:    ['var(--font-body)',    'system-ui', 'sans-serif'],
        amharic: ['Noto Sans Ethiopic', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'card':       '0 4px 24px -2px rgba(27,79,216,0.10)',
        'card-hover': '0 12px 40px -4px rgba(27,79,216,0.22)',
        'glow':       '0 0 20px rgba(27,79,216,0.35)',
        'soft':       '0 2px 16px rgba(0,0,0,0.07)',
      },
      animation: {
        'float':         'float 3s ease-in-out infinite',
        'pulse-ring':    'pulseRing 1.5s ease-out infinite',
        'slide-up':      'slideUp 0.4s ease-out',
        'fade-in':       'fadeIn 0.5s ease-out',
        'shimmer':       'shimmer 1.8s linear infinite',
        'price-pop':     'pricePop 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-8px)' },
        },
        pulseRing: {
          '0%':   { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        slideUp: {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to:   { transform: 'translateY(0)',    opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pricePop: {
          '0%':   { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)',   opacity: '1' },
        },
        bounceGentle: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-4px)' },
        },
      },
      backgroundImage: {
        'hero-gradient':    'linear-gradient(135deg, #0F2B6B 0%, #1B4FD8 50%, #38BDF8 100%)',
        'card-gradient':    'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
      },
    },
  },
  plugins: [],
}
