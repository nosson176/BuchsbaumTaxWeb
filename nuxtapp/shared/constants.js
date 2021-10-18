// Store State Models
export const models = Object.freeze({
  loading: 'loading',
  token: 'token',
  toast: 'toast',
  appWidth: 'appWidth',
  clients: 'clients',
  selectedClient: 'selectedClient'
})

// Store Mutations
export const mutations = Object.freeze({
  setModelResponse: 'setModelResponse',
  setLoading: 'setLoading'
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
export const meta = Object.freeze({
  hid_description: 'description',
  description: 'description',
  og_title: 'og:title',
  hid_og_title: 'og-title',
  og_image: 'og:image',
  hid_og_image: 'og-image',
  og_description: 'og:description',
  hid_og_description: 'og-description'
})

export const COOKIE_KEY_SESSION_TOKEN = 'btax-session-token'

export const BACKEND_MAX_INTEGER = 2147483647
// errors
export const error = Object.freeze({
  axios_401: 'Request failed with status code 401',
  email_already_exists: 'Email already exists',
  generic_signup_error: 'Generic signup error'
})

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

// Notification Types
export const notification = Object.freeze({
  alert: 'alert'
})

// Tabs
export const tabs = Object.freeze({
  tax_personals: 'tax-personals',
  contact: 'contact',
  logs: 'logs',
  income: 'income',
  fbar: 'fbar'
})

export const categories = {
  primary: 'PRI.',
  secondary: 'SEC.',
  dependant: 'DEP.'
}
