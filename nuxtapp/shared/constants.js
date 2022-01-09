// Store State Models
export const models = Object.freeze({
  allClientFees: 'allClientFees',
  appWidth: 'appWidth',
  clients: 'clients',
  clientsHistory: 'clientsHistory',
  loading: 'loading',
  modals: 'modals',
  search: 'search',
  selectedClient: 'selectedClient',
  selectedSmartview: 'selectedSmartview',
  shownTaxYears: 'shownTaxYears',
  smartviews: 'smartviews',
  toast: 'toast',
  token: 'token',
  users: 'users',
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

export const dateformat = Object.freeze({
  client: 'M/d/yy',
  server: 'yyyy-MM-dd'
})

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
  tax_personals: 'tax-personals',
  tax_years: 'tax-years'
})

export const categories = Object.freeze({
  primary: 'PRI.',
  secondary: 'SEC.',
  dependant: 'DEP.'
})

export const priorityOptions = Object.freeze([
  { color: 'bg-pink-500', value: 1 },
  { color: 'bg-green-200', value: 2 },
  { color: 'bg-blue-200', value: 3 },
  { color: 'bg-yellow-200', value: 4 },
  { color: 'bg-red-500', value: 5 },
  { color: 'bg-yellow-500', value: 6 },
  { color: 'bg-pink-200', value: 7 },
  { color: 'bg-black', value: 8 }
])

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

export const currencySymbols = Object.freeze({
  us: '$',
  il: '₪'
})

export const searchOptions = Object.freeze([
  { name: 'Default Search', value: '' },
  { name: 'CLIENT::last_name', value: 'clients::last_name' },
  { name: 'CLIENT::periodical', value: 'clients::periodical' },
  { name: 'CLIENT::status', value: 'clients::status' },
  { name: 'FEE::tax_year', value: 'fees::year' },
  { name: 'FEE::notes', value: 'fees::notes' },
  { name: 'CONTACT::address_or_number', value: 'contacts::main_detail' },
  { name: 'CONTACT::city_or_account', value: 'contacts::secondary_detail' },
  { name: 'CONTACT::state', value: 'contacts::state' },
  { name: 'CONTACT::type', value: 'contacts::contact_type' },
  { name: 'CONTACT::zip', value: 'contacts::zip' },
  { name: 'CONTACT::memo', value: 'contacts::memo' },
  { name: 'INCOME_BREAKDOWN::description', value: 'income_breakdowns::description' },
  { name: 'LOG::employee_alarm', value: 'logs::alarm_user_name' },
  { name: 'LOG::alarm_date', value: 'logs::alarm_date' },
  { name: 'LOG::date_of_log', value: 'logs::log_date' },
  { name: 'LOG::note', value: 'logs::note' },
  { name: 'LOG::year_name', value: 'logs::years' },
  { name: 'TAX_PERSONAL::first_name', value: 'tax_personals::first_name' },
  { name: 'TAX_PERSONAL::informal', value: 'tax_personals::informal' },
  { name: 'TAX_PERSONAL::last_name', value: 'tax_personals::last_name' },
  { name: 'TAX_PERSONAL::ssn', value: 'tax_personals::ssn' },
  { name: 'TAX_YEAR::year_name', value: 'tax_years::year' },
  { name: 'TAX_YEAR::tax_form', value: 'filings::tax_form' },
  { name: 'TAX_YEAR::comment', value: 'filings::memo' },
  { name: 'TAX_YEAR::delivery', value: 'filings::delivery_contact' },
  { name: 'TAX_YEAR::tax_state', value: 'filings::state' }
])
