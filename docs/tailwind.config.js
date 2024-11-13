/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,md,mdx}', './components/**/*.{js,tsx}'],
  theme: {
    extend: {
      lineHeight: {
        compact: '1.15',
        narrow: '1.3',
      },
      backgroundColor: {
        primary: '#0A85D1',
        'primary-hover': '#0C9EF8',
        footer: '#232323',
      },
      textColor: {
        'navbar-primary': '#89C8FF',
        'footer-heading': '#777777',
      },
    },
  },
  plugins: [],
};
