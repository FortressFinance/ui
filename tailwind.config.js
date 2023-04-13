/* eslint-disable @typescript-eslint/no-var-requires */
const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "button-glow":
          "inset 0 0 0 1px theme(colors.orange.400), 0 0 16px 1px theme(colors.pink.400)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
        display: ["var(--font-vt323)", ...fontFamily.sans],
      },
      transitionProperty: {
        height: "height",
      },
      colors: {
        dark: "#371f33",
        blue: "#0070FF",
        orange: {
          DEFAULT: "#FC9659",
          50: "#F8EDE7",
          100: "#F4E1D7",
          200: "#EBC9B7",
          300: "#E3B197",
          400: "#F0707B",
          500: "#FC9659",
          600: "#BC6334",
          700: "#904C28",
          800: "#64351B",
          900: "#381D0F",
        },
        pink: {
          DEFAULT: "#C94A87",
          50: "#F3D7E5",
          100: "#EFC8DA",
          200: "#E5A8C6",
          300: "#DC89B1",
          400: "#D2699C",
          500: "#C94A87",
          600: "#A9326B",
          700: "#5d324e",
          800: "#3e2035",
          900: "#1e0d1c",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("@headlessui/tailwindcss")],
}
