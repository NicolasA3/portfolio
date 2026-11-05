/** @type {import('tailwindcss').Config} */
export default {
  corePlugins: {
    preflight: false,
  },
  content: [
    "./index.html",
    "./proyecto.html",
    "./CV.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          void: "#090D16",
          900: "#111827", /* Midnight Navy base */
          800: "#162032",
          700: "#1E293B",
          card: "rgba(17, 24, 39, 0.78)",
          glass: "rgba(17, 24, 39, 0.6)",
        },
        cool: {
          white: "#F3F4F6", /* Cool White */
          muted: "#CBD5E1",
          dim: "#94A3B8",
        },
        lime: {
          electric: "#A3E635", /* Electric Lime */
          light: "#BEF264",
          dark: "#84CC16",
        },
      },
      fontFamily: {
        heading: ["Outfit", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        body: ["Plus Jakarta Sans", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        'glow-lime': '0 0 25px rgba(163, 230, 53, 0.45)',
        'glow-lime-sm': '0 0 12px rgba(163, 230, 53, 0.35)',
        'glow-lime-lg': '0 0 60px rgba(163, 230, 53, 0.25)',
      },
    },
  },
  plugins: [],
}
