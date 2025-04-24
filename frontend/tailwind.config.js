/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // or wherever your HTML file is located
    "node_modules/flowbite/**/*.js",
    "./src/**/*.{js,jsx,ts,tsx}", // Include all JS/JSX/TS/TSX files in src folder
  ],
  theme: {
    extend: {},
  },
  plugins: [require("flowbite/plugin")],
}

