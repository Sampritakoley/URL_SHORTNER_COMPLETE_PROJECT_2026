/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {

    extend: {
      
      colors: {
        primary: "#4F46E5",     // main brand color
        primaryDark: "#4338CA",
        secondary: "#06B6D4",
        accent: "#22C55E",

        background: "#F8FAFC",
        card: "#FFFFFF",
        border: "#E2E8F0",

        textPrimary: "#0F172A",
        textSecondary: "#64748B"
      },
    
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },

      borderRadius: {
        xl: "12px",
        "2xl": "16px"
      },

      boxShadow: {
        card: "0 4px 12px rgba(0,0,0,0.08)",
        soft: "0 8px 24px rgba(0,0,0,0.08)"
      }

    },
  },
  plugins: [],
}