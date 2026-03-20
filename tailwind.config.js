/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        bebas: ['var(--font-bebas)', 'sans-serif'],
        rajdhani: ['var(--font-rajdhani)', 'sans-serif'],
        orbitron: ['var(--font-orbitron)', 'monospace'],
      },
      colors: {
        gold: {
          300: '#FFE066',
          400: '#FFD700',
          500: '#FFA500',
          600: '#FF8C00',
        },
        lpl: {
          dark: '#050A14',
          dark2: '#0A1628',
          dark3: '#0F1F3D',
          teal: '#00E5FF',
          green: '#00FF88',
          red: '#E8001D',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'price-flash': 'priceFlash 0.4s ease forwards',
        'sold-stamp': 'soldStamp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'coin-flip': 'coinFlip 1.5s ease-in-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'cricket-run': 'cricketRun 1s steps(8) infinite',
        'notification-slide': 'notificationSlide 0.4s ease forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,215,0,0.4)' },
          '50%': { boxShadow: '0 0 50px rgba(255,215,0,0.8)' },
        },
        glow: {
          '0%, 100%': { textShadow: '0 0 10px rgba(255,215,0,0.5)' },
          '50%': { textShadow: '0 0 30px rgba(255,215,0,1), 0 0 60px rgba(255,215,0,0.5)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3) rotate(-10deg)' },
          '50%': { opacity: '1', transform: 'scale(1.1)' },
          '70%': { transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        priceFlash: {
          '0%': { transform: 'scale(1.4)', color: '#ffffff' },
          '100%': { transform: 'scale(1)', color: 'var(--color-green)' },
        },
        soldStamp: {
          '0%': { transform: 'scale(3) rotate(-15deg)', opacity: '0' },
          '60%': { transform: 'scale(0.9) rotate(3deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        coinFlip: {
          '0%': { transform: 'rotateY(0deg) scale(1)' },
          '25%': { transform: 'rotateY(180deg) scale(1.1)' },
          '50%': { transform: 'rotateY(360deg) scale(0.95)' },
          '75%': { transform: 'rotateY(540deg) scale(1.05)' },
          '100%': { transform: 'rotateY(720deg) scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        notificationSlide: {
          from: { opacity: '0', transform: 'translateX(100%)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
