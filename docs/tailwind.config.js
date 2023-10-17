/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,md,mdx}'],
  theme: {
    extend: {
      lineHeight: {
        narrow: '1.3',
      },
      fontSize: {
        '7xxl': '4.9rem',
      },
    },
  },
  plugins: [],
};
