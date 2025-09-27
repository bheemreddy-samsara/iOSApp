/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#5E6AD2',
        primaryLight: '#D5DAFF',
        accent: '#FF9F80',
        success: '#48B27F',
        warning: '#F5A35C',
        danger: '#F16667',
        background: '#F7F7FB',
        surface: '#FFFFFF',
        surfaceMuted: '#F0F1F7',
        textPrimary: '#1C1E26',
        textSecondary: '#5B6270'
      },
      borderRadius: {
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        pill: '999px'
      },
      boxShadow: {
        soft: '0px 4px 12px rgba(94, 106, 210, 0.12)',
        elevated: '0px 10px 24px rgba(25, 32, 72, 0.18)',
        modal: '0px 24px 48px rgba(12, 16, 44, 0.24)'
      }
    }
  },
  plugins: []
};
