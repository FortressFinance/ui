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
      fontSize: {
        "2xs": "0.625rem",
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
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "fade-out": {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        "scale-in": {
          from: { opacity: 0, transform: "rotateX(-10deg) scale(0.94)" },
          to: { opacity: 1, transform: "rotateX(0deg) scale(1)" },
        },
        "scale-out": {
          from: { opacity: 1, transform: "rotateX(0deg) scale(1)" },
          to: { opacity: 0, transform: "rotateX(-10deg) scale(0.98)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-out-right": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        "accordion-open": {
          "0%": { height: 0, opacity: 0 },
          "100%": {
            height: "var(--radix-accordion-content-height)",
            opacity: 1,
          },
        },
        "accordion-close": {
          "0%": { height: "var(--radix-accordion-content-height)", opacity: 1 },
          "100%": { height: 0, opacity: 0 },
        },
        pulse: {
          "0%, 100%": { opacity: 0.9 },
          "50%": { opacity: 0.45 },
        },
      },
      animation: {
        "fade-in": "fade-in 200ms ease-in-out",
        "fade-out": "fade-out 200ms ease-in-out",
        "scale-in": "scale-in 400ms ease-in-out",
        "scale-out": "scale-out 200ms ease-in-out",
        "slide-in-right": "slide-in-right 200ms ease-in-out",
        "slide-out-right": "slide-out-right 200ms ease-in-out",
        "accordion-open": "accordion-open 200ms ease-in-out",
        "accordion-close": "accordion-close 200ms ease-in-out",
        pulse: "pulse 1200ms cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-radix")({ variantPrefix: "ui" })],
}
