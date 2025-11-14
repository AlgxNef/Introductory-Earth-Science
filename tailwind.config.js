module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        'serif-jp': [
          'Noto Serif JP Variable',
          ...defaultTheme.fontFamily.serif,
        ],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
