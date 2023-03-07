/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {

      keyframes: {
        'from-left-to-right': {
          from: {'width': 0},
          to: {'width': '100%'}
        }
      },

      animation: {
        'from-left-to-right': 'from-left-to-right linear'
      },

      container: {
        screens: {
          xl: '1280px'
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
};
