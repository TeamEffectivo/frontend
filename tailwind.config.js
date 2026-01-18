/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Verify this path is correct
  ],
  theme: {
    extend: {
      fontFamily: {
        'pixelify': ['"Pixelify Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}