/*
** TailwindCSS Configuration File
**
** Docs: https://tailwindcss.com/docs/configuration
** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
*/

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: [
    'components/**/*.vue',
    'layouts/**/*.vue',
    'pages/**/*.vue',
    'plugins/**/*.js'
  ],
  theme: {
    extend: {
      width: {
        112: '28rem',
        '1/10': '10%',
        '3/10': '30%',
        '7/10': '70%',
        '9/10': '90%'
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans]
      }
    }
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled'],
      screens: {
        print: { raw: 'print' }
      }

    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
}
