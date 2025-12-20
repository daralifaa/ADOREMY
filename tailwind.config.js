/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",        // Ini biar App.tsx di root kebaca
    "./components/**/*.{js,ts,jsx,tsx}", // Ini biar file di folder components kebaca
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
        handwriting: ['"Nothing You Could Do"', 'cursive'],
      },
      colors: {
        adore: {
          mint: '#e0f7fa',
          mintDark: '#00bcd4',
          cream: '#fffde7',
          creamDark: '#fbc02d',
          peach: '#fff3e0',
          peachDark: '#ff9800',
          lilac: '#f3e5f5',
          slate: '#374151',
          
          pink: '#F8EBEE',      // Background jadi merah muda lembut banget
          pinkDark: '#6F0F28',
        }
      }
    },
  },
  plugins: [],
}
