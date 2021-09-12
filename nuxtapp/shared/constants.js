// Store State Models
export const models = Object.freeze({
  loading: 'loading',
  token: 'token',
  toast: 'toast',
  appWidth: 'appWidth',
  clients: 'clients'
})

// Store Mutations
export const mutations = Object.freeze({
  setModelResponse: 'setModelResponse',
  setLoading: 'setLoading'
})

// Store Getters
export const getters = Object.freeze({
  getHttpConfig: 'getHttpConfig'
})

// Route names
export const routes = Object.freeze({
  root: 'index',
  home: 'home',
  login: 'login',
  signup: 'signup',
  terms: 'terms',
  privacy: 'privacy',
  admin: 'admin',
  resetPassword: 'reset-password'
})

// Meta Tags
export const META_HID_DESCRIPTION = 'description'
export const META_DESCRIPTION = 'description'
export const META_OG_TITLE = 'og:title'
export const META_HID_OG_TITLE = 'og-title'
export const META_HID_OG_IMAGE = 'og-image'
export const META_OG_IMAGE = 'og:image'
export const META_HID_OG_DESCRIPTION = 'og-description'
export const META_OG_DESCRIPTION = 'og:description'

export const COOKIE_KEY_SESSION_TOKEN = 'btax-session-token'

export const BACKEND_MAX_INTEGER = 2147483647

export const ERROR_MESSAGE_AXIOS_401 = 'Request failed with status code 401'
export const ERROR_MESSAGE_EMAIL_ALREADY_EXISTS = 'Email already exists'
export const ERROR_MESSAGE_GENERIC_SIGNUP_ERROR = 'Generic signup error'

// Events
export const events = Object.freeze({
  hide: 'hide',
  click: 'click',
  change: 'change',
  input: 'input',
  submit: 'submit',
  resize: 'resize'
})

export const DATE_FORMAT_DEFAULT_INPUT = 'yyyy-MM-dd'

// Render Store Module
export const GET_IS_SCREEN_SIZE_DESKTOP = 'getIsScreenSizeDesktop'
export const GET_IS_SCREEN_SIZE_TABLET = 'getIsScreenSizeTablet'
export const GET_IS_SCREEN_SIZE_MOBILE = 'getIsScreenSizeMobile'

// Notification Types
export const NOTIFICATION_TYPE_ALERT = 'alert'
