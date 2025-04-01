// tailwind.config.js
export default {
  darkMode: 'class', // enable dark mode via .dark class
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        background: 'rgba(0, 0, 0, 0.5)',
        border: 'rgba(255, 255, 255, 0.08)',
        softWhite: 'rgba(255, 255, 255, 0.05)',
        glow: 'rgba(99, 102, 241, 0.15)', // for subtle glow on hover
      },
      boxShadow: {
        soft: '0 4px 24px rgba(0, 0, 0, 0.2)',
        subtle: '0 2px 8px rgba(0, 0, 0, 0.1)',
        glow: '0 0 0 2px rgba(99, 102, 241, 0.3)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      transitionProperty: {
        spacing: 'margin, padding',
        colors: 'color, background-color, border-color',
      },
    },
  },
  plugins: [],
};
