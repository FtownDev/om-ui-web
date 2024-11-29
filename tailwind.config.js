/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,ts}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        light: {
          fill: "#FFFFFF",
          section: "#F8F9FA",
          border: "#DEE2E6",
          primary: "#1D4ED8",
          secondary: "#9333EA",
          accent: "#E9ECEF",
          heading: "#495057",
          content: "#212529",
          success: "#28A745",
          warning: "#FFC107",
          error: "#FF353F",
        },
        dark: {
          fill: "#0a0a0a",
          section: "#23272B",
          border: "#343A40",
          primary: "#0D6EFD",
          secondary: "#6C757D",
          accent: "#2C2C2C",
          heading: "#CED4DA",
          content: "#F8F9FA",
          success: "#20C997",
          warning: "#E9A502",
          error: "#b91c1c",
        },
        /**
         * #
         * .dark-mode {
          --bg-main: #121212;
          --bg-section: #1E1E1E;

        }
         */
      },
      fontFamily: { sans: ["Lexend", "Chakra Petch", "Monda"] },
    },
  },
  plugins: [],
};
