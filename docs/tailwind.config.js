/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,md,mdx}', './components/**/*.{js,tsx}'],
  theme: {
    extend: {
      lineHeight: {
        compact: '1.15',
        narrow: '1.3',
      },
      fontSize: {
        'feature-subtitle': '22px',
        heading: '40px',
      },
      backgroundColor: {
        primary: '#0A85D1',
        feature: '#EFF3F5',
        'primary-hover': '#0C9EF8',
        footer: '#232323',
      },
      textColor: {
        feature: '#006DB0',
        subtitle: '#6B6B6B',
        'navbar-primary': '#89C8FF',
        'footer-heading': '#777777',
      },
    },
  },
  plugins: [],
};
