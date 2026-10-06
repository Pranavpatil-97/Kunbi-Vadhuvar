export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#7A1F2B",
        gold: "#F2A900",
        blush: "#FFF8EC",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans: ["Inter", "Noto Sans Devanagari", "sans-serif"],
      },
    },
  },
  plugins: [],
};