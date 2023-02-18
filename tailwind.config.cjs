/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
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
