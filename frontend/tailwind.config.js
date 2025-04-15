export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", 
    ],
    theme: {
      extend: {
        animation: {
          'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
          'gradient': 'gradientMove 4s ease infinite',
        },
        keyframes: {
          pulseGlow: {
            '0%, 100%': {
              textShadow: '0 0 15px #ec4899, 0 0 30px #ec4899',
            },
            '50%': {
              textShadow: '0 0 25px #ec4899, 0 0 40px #ec4899',
            },
          },
          gradientMove: {
            '0%, 100%': {
              backgroundPosition: '0% 50%',
            },
            '50%': {
              backgroundPosition: '100% 50%',
            },
          },
        },
      },
    },
    plugins: [],
  }
  