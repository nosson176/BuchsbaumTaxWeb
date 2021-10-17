/*
** TailwindCSS Configuration File
**
** Docs: https://tailwindcss.com/docs/configuration
** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
*/

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    extend: {
      width: {
        112: '28rem',
        '1/10': '10%',
        '3/10': '30%',
        '7/10': '70%',
        '9/10': '90%'
      },
      screens: {
        print: { raw: 'print' }
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans]
      },
      plugins: [
        require('@tailwindcss/forms')
      ]
    }
  }
}
