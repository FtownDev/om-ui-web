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
          input: "#F4F4F4",
          heading: "#495057",
          content: "#212529",
          success: "#28A745",
          warning: "#FFC107",
          error: "#FF353F",
          nav: "#F5F5F4",
        },
        dark: {
          fill: "#171717",
          section: "#252525",
          border: "#424242",
          primary: "#0D6EFD",
          secondary: "#6C757D",
          accent: "#2C2C2C",
          input: "#303030",
          heading: "#CED4DA",
          content: "#F8F9FA",
          success: "#20C997",
          warning: "#E9A502",
          error: "#b91c1c",
          nav: "#151b23",
        },
      },
      fontFamily: { sans: ["Lexend", "Chakra Petch", "Monda"] },
    },
  },
  plugins: [],
};
