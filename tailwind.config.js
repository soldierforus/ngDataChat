/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],  theme: {
    extend: {
      colors: {
        'gold': '#ffcc00',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
