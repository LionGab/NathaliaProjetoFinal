/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./App.tsx", "./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  corePlugins: {
    space: false,
  },
  theme: {
    // NOTE to AI: You can extend the theme with custom colors or styles here.
    extend: {
      colors: {
        // Nossa Maternidade - Refined, sophisticated color palette
        rose: {
          50: "#FFF5F7",
          100: "#FFEEF2",
          200: "#FECDD3",
          300: "#FDA4AF",
          400: "#FB7185",
          500: "#F43F5E",
          600: "#E11D48",
          700: "#BE123C",
          800: "#9F1239",
          900: "#881337",
        },
        blush: {
          50: "#FDF8F6",
          100: "#FAF0ED",
          200: "#F5E1DB",
          300: "#EFD0C7",
          400: "#E8B4A5",
          500: "#D4A394",
          600: "#BC8B7B",
          700: "#9E7269",
          800: "#7A584F",
          900: "#5C4238",
        },
        cream: {
          50: "#FFFCF9",
          100: "#FFF9F3",
          200: "#FFF3E8",
          300: "#FFEBD9",
          400: "#FFE0C7",
          500: "#FFD4B0",
          600: "#E8B88C",
          700: "#C9956A",
          800: "#A67548",
          900: "#7D5632",
        },
        sage: {
          50: "#F6FAF7",
          100: "#ECF5EE",
          200: "#D5E8D9",
          300: "#B8D9BF",
          400: "#8FC49A",
          500: "#6BAD78",
          600: "#4F9260",
          700: "#3F7550",
          800: "#345E42",
          900: "#2A4C36",
        },
        warmGray: {
          50: "#FAFAF9",
          100: "#F5F5F4",
          200: "#E7E5E4",
          300: "#D6D3D1",
          400: "#A8A29E",
          500: "#78716C",
          600: "#57534E",
          700: "#44403C",
          800: "#292524",
          900: "#1C1917",
        },
      },
      fontFamily: {
        sans: ["DMSans_400Regular"],
        medium: ["DMSans_500Medium"],
        semibold: ["DMSans_600SemiBold"],
        bold: ["DMSans_700Bold"],
        serif: ["DMSerifDisplay_400Regular"],
        serifItalic: ["DMSerifDisplay_400Regular_Italic"],
      },
      fontSize: {
        xs: ["11px", { lineHeight: "16px", letterSpacing: "0.01em" }],
        sm: ["13px", { lineHeight: "18px", letterSpacing: "0.01em" }],
        base: ["15px", { lineHeight: "22px", letterSpacing: "0" }],
        lg: ["17px", { lineHeight: "24px", letterSpacing: "-0.01em" }],
        xl: ["20px", { lineHeight: "28px", letterSpacing: "-0.01em" }],
        "2xl": ["24px", { lineHeight: "32px", letterSpacing: "-0.02em" }],
        "3xl": ["30px", { lineHeight: "36px", letterSpacing: "-0.02em" }],
        "4xl": ["36px", { lineHeight: "40px", letterSpacing: "-0.02em" }],
        "5xl": ["48px", { lineHeight: "1", letterSpacing: "-0.02em" }],
      },
      spacing: {
        "18": "72px",
        "22": "88px",
      },
    },
  },
  darkMode: "class",
  plugins: [
    plugin(({ matchUtilities, theme }) => {
      const spacing = theme("spacing");

      // space-{n}  ->  gap: {n}
      matchUtilities(
        { space: (value) => ({ gap: value }) },
        { values: spacing, type: ["length", "number", "percentage"] }
      );

      // space-x-{n}  ->  column-gap: {n}
      matchUtilities(
        { "space-x": (value) => ({ columnGap: value }) },
        { values: spacing, type: ["length", "number", "percentage"] }
      );

      // space-y-{n}  ->  row-gap: {n}
      matchUtilities(
        { "space-y": (value) => ({ rowGap: value }) },
        { values: spacing, type: ["length", "number", "percentage"] }
      );
    }),
  ],
};
