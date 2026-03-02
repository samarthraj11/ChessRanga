/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: "#F0B429",
          navy: "#1A1A2E",
        },
      },
    },
  },
  plugins: [],
};
