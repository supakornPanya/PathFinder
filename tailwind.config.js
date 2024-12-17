module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Adjust this to match your project structure
    "./index.html",
    "./pages/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
