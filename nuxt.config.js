import qs from 'qs'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Buchsbaum-Tax',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://rsms.me/inter/inter.css' },
    ],
  },
  router: {
    middleware: ['routeGuards'],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/css/global.css', '~/assets/css/date-picker.css'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '@/plugins/init.js',
    '@/plugins/axios.js',
    '@/plugins/api.js',
    '@/plugins/breakpoints-mixin.js',
    '@/plugins/datePicker.client.js',
    '@/plugins/v-hotkey.client.js',
    '@/plugins/v-tooltip.client.js',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [
    {
      path: '~/components', // will get any components nested in let's say /components/test too
      pathPrefix: false,
    },
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/dotenv',
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // Doc: https://github.com/Maronato/vue-toastification/tree/main
    'vue-toastification/nuxt',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.BACKEND_URL,
    responseType: 'json',

    // Override the default serializer to switch params from becoming []id=a&[]id=b ...
    // in GET and DELETE requests to id=a&id=b.
    paramsSerializer: (params) => {
      qs.stringify(params, { arrayFormat: 'repeat' })
    },
  },
  // vue-toastification configuration https://github.com/Maronato/vue-toastification/tree/main
  toast: {
    position: 'bottom-right',
    timeout: 5000,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
