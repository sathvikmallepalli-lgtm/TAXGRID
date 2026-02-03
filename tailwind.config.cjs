/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1F4E79',
        secondary: '#2E75B6',
        success: '#22C55E',
        error: '#EF4444',
        warning: '#F59E0B',
      },
    },
  },
  plugins: [],
}
