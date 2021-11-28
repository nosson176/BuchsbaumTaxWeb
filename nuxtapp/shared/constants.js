// Store State Models
export const models = Object.freeze({
  allClientFees: 'allClientFees',
  appWidth: 'appWidth',
  clients: 'clients',
  loading: 'loading',
  modals: 'modals',
  search: 'search',
  selectedClient: 'selectedClient',
  toast: 'toast',
  token: 'token',
  valueTaxGroups: 'valueTaxGroups',
  valueTypes: 'valueTypes'
})

// Store Mutations
export const mutations = Object.freeze({
  setModelResponse: 'setModelResponse',
  setLoading: 'setLoading'
})

// Route names
export const routes = Object.freeze({
  admin: 'admin',
  home: 'home',
  login: 'login',
  privacy: 'privacy',
  resetPassword: 'reset-password',
  root: 'index',
  signup: 'signup',
  terms: 'terms'
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
  blur: 'blur',
  change: 'change',
  click: 'click',
  delete: 'delete',
  hide: 'hide',
  input: 'input',
  keydown: 'keydown',
  keypress: 'keypress',
  keyup: 'keyup',
  resize: 'resize',
  submit: 'submit'
})

export const DATE_FORMAT_DEFAULT_INPUT = 'yyyy-MM-dd'

// Notification Types
export const notification = Object.freeze({
  alert: 'alert'
})

// Tabs
export const tabs = Object.freeze({
  checklists: 'checklists',
  contact: 'contact',
  fbar: 'fbar',
  fees: 'fees',
  income: 'income',
  logs: 'logs',
  tax_personals: 'tax-personals'
})

export const categories = Object.freeze({
  primary: 'PRI.',
  secondary: 'SEC.',
  dependant: 'DEP.'
})

export const priority = Object.freeze({
  1: 'bg-pink-500',
  2: 'bg-green-200',
  3: 'bg-blue-200',
  4: 'bg-yellow-200',
  5: 'bg-red-500',
  6: 'bg-yellow-500',
  7: 'bg-pink-200',
  8: 'bg-black'
})

export const filingTypes = Object.freeze({
  federal: 'federal',
  state: 'state',
  fbar: 'fbar',
  ext: 'ext'
})

export const tableGroups = Object.freeze({
  feesChecklists: 'feesChecklists',
  logsIncomeFbar: 'logsIncomeFbar',
  personalContact: 'personalContact'
})
