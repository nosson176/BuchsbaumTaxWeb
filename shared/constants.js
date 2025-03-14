// Store State Models
export const models = Object.freeze({
  appWidth: 'appWidth',
  clients: 'clients',
  clientsHistory: 'clientsHistory',
  loading: 'loading',
  loaded: 'loaded',
  dayLogs: 'dayLogs',
  modals: 'modals',
  search: 'search',
  worktimes: 'worktimes',
  selectedClient: 'selectedClient',
  selectedSmartview: 'selectedSmartview',
  smartviews: 'smartviews',
  toast: 'toast',
  token: 'token',
  users: 'users',
  valueTaxGroups: 'valueTaxGroups',
  valueTypes: 'valueTypes',
  cmdPressed: 'cmdPressed',
  clientSearchValue: 'clientSearchValue',
  clientClicked: 'clientClicked',
  clientSearchOption: 'clientSearchOption',
  inbox: 'inbox',
  secondsSpentOnClient: 'secondsSpentOnClient',
  promptOnClientChange: 'promptOnClientChange',
  selectedContactId: 'selectedContactId',
  currentUser: 'currentUser',
  selectedTaxYearId: 'selectedTaxYearId',
  fbars: 'fbars',
  globalPlayTime: 'globalPlayTime',
  secondsNeededToDisplayModal1: 'secondsNeededToDisplayModal1',
  ClinetAndLogs: 'ClinetAndLogs',
  filingsUpdate: 'filingsUpdate',
  spinner: 'spinner',
  dotStatus: 'dotStatus',
  workTimeActive: 'workTimeActive',
  timerState: 'timerState',
  exchangeRate: 'exchangeRate',
})

// Store Mutations
export const mutations = Object.freeze({
  setModelResponse: 'setModelResponse',
  setLoading: 'setLoading',
  setLoaded: 'setLoaded',
})

// Route names
export const routes = Object.freeze({
  login: 'login',
  root: 'index',
  users: 'users',
  clock: 'clock',
  values: 'values',
  maps: 'maps',
  shekelator: 'shekelator',
  resetPassword: 'resetPassword',
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
  hid_og_description: 'og-description',
})

export const COOKIE_KEY_SESSION_TOKEN = 'btax-session-token'

export const BACKEND_MAX_INTEGER = 2147483647
// errors
export const error = Object.freeze({
  axios_401: 'Request failed with status code 401',
  email_already_exists: 'Email already exists',
  generic_signup_error: 'Generic signup error',
})

// Events
export const events = Object.freeze({
  blur: 'blur',
  change: 'change',
  click: 'click',
  delete: 'delete',
  archive: 'archive',
  unarchive: 'unarchive',
  hide: 'hide',
  input: 'input',
  keydown: 'keydown',
  keypress: 'keypress',
  keyup: 'keyup',
  resize: 'resize',
  submit: 'submit',
  tab: 'tab',
  newMessage: 'newMessage',
  switchClients: 'switchClients',
  addLog: 'addLog',
  resetClock: 'resetClock',
  dragstart: 'dragstart',
  drop: 'drop',
  dragover: 'dragover',
  dragenter: 'dragenter',
})

export const dateformat = Object.freeze({
  client: 'M/d/yy',
  server: 'yyyy-MM-dd',
  time: 'h:mm a',
})

// Notification Types
export const notification = Object.freeze({
  alert: 'alert',
})

// Tabs
export const tabs = Object.freeze({
  checklists: 'checklists',
  clients: 'clients',
  contact: 'contact',
  fbar: 'fbar',
  fees: 'fees',
  income: 'income',
  logs: 'logs',
  smartviews: 'smartviews',
  tax_personals: 'tax-personals',
  tax_years: 'tax-years',
  values: {
    checklist: 'checklist',
    client: 'client',
    clockspot: 'clockspot',
    contact: 'contact',
    fee: 'fee',
    inc_fbar_breakdown: 'inc_fbar_breakdown',
    shared: 'shared',
    tax_personal: 'tax_personal',
    tax_year: 'tax_year',
  },
})

export const valueTabs = Object.freeze([
  { name: 'Checklist', value: 'checklist' },
  { name: 'Client', value: 'client' },
  { name: 'Clockspot', value: 'clockspot' },
  { name: 'Contact', value: 'contact' },
  { name: 'Fee', value: 'fee' },
  { name: 'Inc./Fbar Breakdown', value: 'inc_fbar_breakdown' },
  { name: 'Shared', value: 'shared' },
  { name: 'Tax Personal', value: 'tax_personal' },
  { name: 'Tax Year', value: 'tax_year' },
])

export const categories = Object.freeze({
  primary: 'PRI.',
  secondary: 'SEC.',
  dependant: 'DEP.',
})

export const userTypes = Object.freeze([
  { name: 'Admin', value: 'Admin' },
  { name: 'User', value: 'User' },
])

export const priorityOptions = Object.freeze([
  { color: 'turquoise', value: 1 },
  { color: 'green', value: 2 },
  { color: 'blue', value: 3 },
  { color: 'yellow', value: 4 },
  { color: 'red', value: 5 },
  { color: 'orange', value: 6 },
  { color: 'light-pink', value: 7 },
  { color: 'purple', value: 8 },
  { color: 'black', value: 9 },
])

export const filingTypes = Object.freeze({
  federal: 'federal',
  state: 'state',
  fbar: 'fbar',
  ext: 'ext',
})

export const tableGroups = Object.freeze({
  feesChecklists: 'feesChecklists',
  logsIncomeFbar: 'logsIncomeFbar',
  personalContact: 'personalContact',
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
  { name: 'LOG::alarm_time', value: 'logs::alarm_time' },
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
  { name: 'TAX_YEAR::tax_state', value: 'filings::state' },
])

export const smartviewOptions = Object.freeze([
  { name: 'CLIENT::year_of_last_log', value: 'CLIENT::year_of_last_log' },
  { name: 'CLIENT::year_of_first_log', value: 'CLIENT::year_of_first_log' },
  { name: 'CLIENT::date_of_first_log', value: 'CLIENT::date_of_first_log' },
  { name: 'CLIENT::last_name', value: 'CLIENT::last_name' },
  { name: 'CLIENT::status', value: 'CLIENT::status' },
  { name: 'CLIENT::active', value: 'CLIENT::active' },
  { name: 'CLIENT::id', value: 'CLIENT::id' },
  { name: 'CLIENT::owes_status', value: 'CLIENT::owes_status' },
  { name: 'CLIENT::periodical', value: 'CLIENT::periodical' },
  { name: 'CLIENT::pmt_status', value: 'CLIENT::pmt_status' },

  { name: 'CONTACT::address_or_number', value: 'CONTACT::address_or_number' },
  { name: 'CONTACT::city_or_account', value: 'CONTACT::city_or_account' },
  { name: 'CONTACT::memo', value: 'CONTACT::memo' },
  { name: 'CONTACT::state', value: 'CONTACT::state' },
  { name: 'CONTACT::type', value: 'CONTACT::type' },
  { name: 'CONTACT::zip', value: 'CONTACT::zip' },

  { name: 'INCOME_BREAKDOWN::category', value: 'INCOME_BREAKDOWN::category' },
  { name: 'INCOME_BREAKDOWN::description', value: 'INCOME_BREAKDOWN::description' },
  { name: 'INCOME_BREAKDOWN::job', value: 'INCOME_BREAKDOWN::job' },
  { name: 'INCOME_BREAKDOWN::tax_group', value: 'INCOME_BREAKDOWN::tax_group' },
  { name: 'INCOME_BREAKDOWN::tax_type', value: 'INCOME_BREAKDOWN::tax_type' },
  { name: 'INCOME_BREAKDOWN::year_name', value: 'INCOME_BREAKDOWN::year_name' },

  // { name: 'LOG::alarm_date', value: 'LOG::alarm_date' },
  { name: 'LOG::alarm_time', value: 'LOG::alarm_time' },
  { name: 'LOG::alarm_complete', value: 'LOG::alarm_complete' },
  { name: 'LOG::date_of_log', value: 'LOG::date_of_log' },
  { name: 'LOG::employee_alarm', value: 'LOG::employee_alarm' },
  { name: 'LOG::timetrack', value: 'LOG::timetrack' },
  { name: 'LOG::note', value: 'LOG::note' },
  { name: 'LOG::priority', value: 'LOG::priority' },
  { name: 'LOG::year_name', value: 'LOG::year_name' },

  { name: 'TAX_PERSONAL::category', value: 'TAX_PERSONAL::category' },
  { name: 'TAX_PERSONAL::date_of_birth', value: 'TAX_PERSONAL::date_of_birth' },
  { name: 'TAX_PERSONAL::first_name', value: 'TAX_PERSONAL::first_name' },
  { name: 'TAX_PERSONAL::informal', value: 'TAX_PERSONAL::informal' },
  { name: 'TAX_PERSONAL::language_spoken', value: 'TAX_PERSONAL::language_spoken' },
  { name: 'TAX_PERSONAL::last_name', value: 'TAX_PERSONAL::last_name' },
  { name: 'TAX_PERSONAL::relation', value: 'TAX_PERSONAL::relation' },
  { name: 'TAX_PERSONAL::ssn', value: 'TAX_PERSONAL::ssn' },

  { name: 'TAX_YEAR::comment', value: 'TAX_YEAR::comment' },
  { name: 'TAX_YEAR::date_filed', value: 'TAX_YEAR::date_filed' },
  { name: 'TAX_YEAR::extension_form', value: 'TAX_YEAR::extension_form' },
  { name: 'TAX_YEAR::extension_status', value: 'TAX_YEAR::extension_status' },
  { name: 'TAX_YEAR::FBAR_status', value: 'TAX_YEAR::FBAR_status' },
  { name: 'TAX_YEAR::FBAR_status_detail', value: 'TAX_YEAR::FBAR_status_detail' },
  { name: 'TAX_YEAR::file_type', value: 'TAX_YEAR::file_type' },
  { name: 'TAX_YEAR::IRS_HISTORY', value: 'TAX_YEAR::IRS_HISTORY' },
  { name: 'TAX_YEAR::owes_federal', value: 'TAX_YEAR::owes_federal' },
  { name: 'TAX_YEAR::paid_federal', value: 'TAX_YEAR::paid_federal' },
  { name: 'TAX_YEAR::state_status_detail', value: 'TAX_YEAR::state_status_detail' },
  { name: 'TAX_YEAR::tax_form', value: 'TAX_YEAR::tax_form' },
  { name: 'TAX_YEAR::tax_year_status_detail', value: 'TAX_YEAR::tax_year_status_detail' },
  { name: 'TAX_YEAR::tax_year_status_federal', value: 'TAX_YEAR::tax_year_status_federal' },
  { name: 'TAX_YEAR::tax_year_status_state', value: 'TAX_YEAR::tax_year_status_state' },
  { name: 'TAX_YEAR::year_name', value: 'TAX_YEAR::year_name' },
  { name: 'TAX_YEAR::delivery', value: 'TAX_YEAR::delivery' },
  { name: 'TAX_YEAR::tax_state', value: 'TAX_YEAR::tax_state' },

  { name: 'FEE::fee_type', value: 'FEE::fee_type' },
  { name: 'FEE::status', value: 'FEE::status' },
  { name: 'FEE::status_detail', value: 'FEE::status_detail' },
  { name: 'FEE::tax_year', value: 'FEE::tax_year' },

  { name: 'CLIENT_FLAGS::flag_name', value: 'CLIENT_FLAGS::flag_name' },
  { name: 'CLIENT_FLAGS::user_name', value: 'CLIENT_FLAGS::user_name' },
])

export const operators = Object.freeze([
  { name: '=', value: '=' },
  { name: '!=', value: '!=' },
  { name: '>', value: '>' },
  { name: '<', value: '<' },
  { name: '>=', value: '>=' },
  { name: '<=', value: '<=' },
])

export const secondsNeededToDisplayModal = 600

export const TRANSITION_NAME = 'flip-list'

export const USER_TYPE_ADMIN = 'Admin'

export const currencies = {
  USD: { type: 'USD', symbol: '$' },
  NIS: { type: 'NIS', symbol: '₪' },
}
