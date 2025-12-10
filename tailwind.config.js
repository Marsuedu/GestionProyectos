import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    './storage/framework/views/*.php',
    './resources/views/**/*.blade.php',
    './resources/js/**/*.tsx',
    './resources/js/**/*.ts',
    './resources/js/**/*.jsx',
    './resources/js/**/*.js',
  ],
  darkMode: 'class', // opcional, si quieres modo oscuro
  theme: {
    extend: {
      fontFamily: {
        sans: ['Figtree', ...defaultTheme.fontFamily.sans],
      },
      // Si quieres los mismos colores que en Biblioteca:
      colors: {
        'color-main': '#F9F9F7',
        'color-txt': '#2f4858',
        'color-btn': '#2f4858',
        'color-btn-sc': 'rgb(234 179 8)',
        'color-dark': '#121521',
        'color-txt-dark': '#F9F9F7',
      },
    },
  },
  plugins: [forms],
};
