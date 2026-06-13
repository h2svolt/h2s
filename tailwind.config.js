/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        volt: "#ccff80",
        violet: "#825aff",
        dark: "#080810",
        card: "#11111d",
      },
    },
  },
  plugins: [],
}