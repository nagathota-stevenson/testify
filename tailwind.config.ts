import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        "maison-mono": ["Maison Mono", "mono"],
        "maison": ["Maison", "sans"],
      },
      colors: {
        blk1: 'rgba(27, 32, 40, 1)',
        purp: 'rgba(126, 81, 255, 1)',
        gren: 'rgba(184, 255, 0, 1)',
        wht1: 'rgba(255, 255, 255, 1)',
        coral: 'rgba(255, 127, 80, 1)',
      },
      boxShadow: {
        'custom-purple': '8px 8px 0 var(--purp)', 
        'custom-coral': '8px 8px 0 var(--coral)',
      },
      
    },
  },
} satisfies Config

export default config
