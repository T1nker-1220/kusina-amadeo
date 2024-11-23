/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B6B',
        'primary-dark': '#FF4F4F',
        secondary: '#4ECDC4',
        accent: '#FFE66D',
        dark: '#2C3E50',
        light: '#F7F9FC'
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        display: ['var(--font-playfair-display)'],
      },
    },
  },
  plugins: [],
}
