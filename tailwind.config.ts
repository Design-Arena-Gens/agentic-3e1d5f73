import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        dyslexic: ['OpenDyslexic', 'Comic Sans MS', 'sans-serif'],
      },
      colors: {
        primary: '#4F46E5',
        secondary: '#10B981',
      },
    },
  },
  plugins: [],
};
export default config;
