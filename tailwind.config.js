/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.{html,js,php}",
    "./src/**/*.{html,js,php}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#020617',
          deep: '#0F0728',
          card: 'rgba(15, 23, 42, 0.75)',
          purple: '#A855F7',
          purpleDark: '#7C3AED',
          blue: '#3B82F6',
          cyan: '#06B6D4',
          gold: '#F59E0B',
          goldDark: '#EAB308',
          red: '#E50914'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif']
      },
      boxShadow: {
        'neon-purple': '0 0 25px rgba(168, 85, 247, 0.45)',
        'neon-blue': '0 0 25px rgba(59, 130, 246, 0.45)',
        'neon-gold': '0 0 30px rgba(245, 158, 11, 0.55)',
        'neon-cyan': '0 0 25px rgba(6, 182, 212, 0.45)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      backdropBlur: {
        xs: '2px',
        glass: '16px'
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 5s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s infinite alternate',
        'shine': 'shine 2.5s infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        glowPulse: {
          '0%': { opacity: '0.4', filter: 'drop-shadow(0 0 15px #A855F7)' },
          '100%': { opacity: '1', filter: 'drop-shadow(0 0 35px #3B82F6)' }
        },
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' }
        }
      }
    }
  },
  plugins: []
};
