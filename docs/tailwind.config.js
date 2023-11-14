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
        '7xxl': '4.9rem',
      },
      textColor: {
        'dark-code': '#54b8d1',
      },
    },
  },
  plugins: [],
};
