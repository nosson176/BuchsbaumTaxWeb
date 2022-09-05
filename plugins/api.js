import { getCookieByKey, setCookieByKey } from '~/shared/cookie-utilities'
import { COOKIE_KEY_SESSION_TOKEN, models, mutations, routes } from '~/shared/constants'

export default ({ $axios, store, $toast, redirect }, inject) => {
  const getHeaders = () => {
    const headers = {}
    const token = getCookieByKey(COOKIE_KEY_SESSION_TOKEN)
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    return headers
  }

  const login = (data) =>
    $axios
      .post('/sessions', data, { loading: models.token, store: models.token })
      .catch(() => $toast.error('Invalid email or password'))

  const signout = () => {
    const token = ''
    setCookieByKey(COOKIE_KEY_SESSION_TOKEN, token, { expires: 365 })
    store.commit(mutations.setModelResponse, {
      model: models.token,
      data: { token },
    })
    redirect({ name: routes.login })
  }

  // GET
  const getCurrentUser = (headers) => {
    $axios
      .get('users/current', {
        headers,
        loading: models.currentUser,
        store: models.currentUser,
      })
      .catch(() => $toast.error('Error loading value types'))
  }

  const getClientList = (headers) => {
    const searchParam = store.state.clientSearchValue
    const searchOption = store.state.clientSearchOption
    let endpoint = 'clients/'
    if (searchParam.length > 0 && searchOption.length > 0) {
      endpoint = endpoint.concat(`?q=${searchParam}&field=${searchOption}`)
    } else if (searchParam.length > 0) {
      endpoint = endpoint.concat(`?q=${searchParam}`)
    }
    return $axios
      .get(endpoint, {
        headers,
        loading: models.clients,
        loaded: models.clients,
        store: models.clients,
      })
      .catch((e) => {
        $toast.error('Error loading clients')
      })
  }

  const getClientData = (headers, id) =>
    $axios
      .get(`/clients/${id}/data`, {
        headers,
        loading: models.selectedClient,
        loaded: models.selectedClient,
        store: models.selectedClient,
      })
      .then(() => getClientsHistory(headers))
      .catch(() => $toast.error('Error loading client data'))

  const getValueTypes = (headers) =>
    $axios
      .get('values', {
        headers,
        loading: models.valueTypes,
        loaded: models.valueTypes,
        store: models.valueTypes,
      })
      .catch(() => $toast.error('Error loading value types'))

  const getValueTaxGroups = (headers) =>
    $axios
      .get('values/tax-groups', {
        headers,
        loading: models.valueTaxGroups,
        loaded: models.valueTaxGroups,
        store: models.valueTaxGroups,
      })
      .catch(() => $toast.error('Error loading value tax groups'))

  const getAllClientFees = (headers) =>
    $axios
      .get('/fees', {
        headers,
        loading: models.allClientFees,
        loaded: models.allClientFees,
        store: models.allClientFees,
      })
      .catch(() => $toast.error('Error loading all client fees'))

  const getAllUsers = (headers) =>
    $axios
      .get('/users', { headers, loading: models.users, loaded: models.users, store: models.users })
      .catch(() => $toast.error('Error loading all users'))

  const getClientsHistory = (headers) =>
    $axios
      .get('/clients/history', {
        headers,
        loading: models.clientsHistory,
        loaded: models.clientsHistory,
        store: models.clientsHistory,
      })
      .catch(() => $toast.error('Error loading clients history'))

  const getSmartviews = (headers) =>
    $axios
      .get('/smartviews', {
        headers,
        loading: models.smartviews,
        loaded: models.smartviews,
        store: models.smartviews,
      })
      .catch(() => $toast.error('Error loading smartviews'))

  const getPhoneNumbers = (headers) =>
    $axios
      .get('/sms/phone_numbers', {
        headers,
        loading: models.phoneNumbers,
        loaded: models.phoneNumbers,
        store: models.phoneNumbers,
      })
      .catch(() => $toast.error('Error loading phone numbers'))

  const getInbox = (headers) =>
    $axios
      .get('/users/current/messages', {
        headers,
        loading: models.inbox,
        loaded: models.inbox,
        store: models.inbox,
      })
      .catch(() => $toast.error('Error loading messages'))

  // CREATE
  const createLog = (headers, { log }) =>
    $axios.post('/logs', log, { headers }).catch(() => $toast.error('Error creating log'))

  const createTaxPersonal = (headers, { personal }) =>
    $axios.post('/personals', personal, { headers }).catch(() => $toast.error('Error creating tax personal'))

  const createContact = (headers, { contact }) =>
    $axios.post('/contacts', contact, { headers }).catch(() => $toast.error('Error creating contact'))

  const createIncome = (headers, { income }) =>
    $axios.post('/incomes', income, { headers }).catch(() => $toast.error('Error creating income'))

  const createFbar = (headers, { fbar }) =>
    $axios.post('/fbars', fbar, { headers }).catch(() => $toast.error('Error creating fbar'))

  const createFee = (headers, { fee }) =>
    $axios.post('/fees', fee, { headers }).catch(() => $toast.error('Error creating fee'))

  const createTaxYear = (headers, { taxYear }) =>
    $axios.post('/tax-years', taxYear, { headers }).catch(() => $toast.error('Error creating tax year'))

  const createFiling = (headers, { filing }) =>
    $axios.post('/filings', filing, { headers }).catch(() => $toast.error('Error creating filing'))

  const createChecklist = (headers, { checklist }) =>
    $axios.post('/checklists', checklist, { headers }).catch(() => $toast.error('Error creating checklist'))

  const createClient = (headers, { client }) =>
    $axios.post('/clients', client, { headers }).catch(() => $toast.error('Error creating client'))

  const createSmartview = (headers, { smartview }) =>
    $axios
      .post('/smartviews', smartview, { headers })
      .catch(() => $toast.error('Error creating smartview'))
      .finally(() => getSmartviews(headers))

  const createUser = (headers, { user }) =>
    $axios
      .post('/users', user, { headers })
      .catch(() => $toast.error('Error creating user'))
      .finally(() => getAllUsers(headers))

  const createValueType = (headers, { value }) =>
    $axios.post('/values', value, { headers }).then(() => getValueTypes(headers))

  const createPhoneNumber = (headers, { phoneNum }) =>
    $axios.post('/sms/phone_numbers', phoneNum, { headers }).catch(() => $toast.error('Error creating phone number'))

  const sendSms = (headers, { sms }) =>
    $axios.post('/sms/send', sms, { headers }).catch(() => $toast.error('Error sending SMS'))

  const sendMessage = (headers, { messageObj }) =>
    $axios.post('/users/current/messages', messageObj, { headers }).catch(() => $toast.error('Error sending message'))

  // UPDATE
  const updateClient = (headers, { clientId, client }) =>
    $axios
      .put(`/clients/${clientId}`, client, { headers })
      .catch(() => $toast.error('Error updating client'))
      .finally(() => getClientData(headers, clientId))

  const updateLog = (headers, { clientId, logId }, log) =>
    $axios
      .put(`/logs/${logId}`, log, { headers })
      .catch(() => $toast.error('Error updating log'))
      .finally(() => getClientData(headers, clientId))

  const updateTaxPersonal = (headers, { clientId, personalId }, personal) =>
    $axios
      .put(`/personals/${personalId}`, personal, { headers })
      .catch(() => $toast.error('Error updating tax personal'))
      .finally(() => getClientData(headers, clientId))

  const updateContact = (headers, { clientId, contactId = '' }, contact) =>
    $axios
      .put(`/contacts/${contactId}`, contact, { headers })
      .catch(() => $toast.error('Error updating contact'))
      .finally(() => getClientData(headers, clientId))

  const updateIncome = (headers, { clientId, incomeId = '' }, income) => {
    const endpoint = incomeId ? `/incomes/${incomeId}` : '/incomes'
    return $axios
      .put(endpoint, income, { headers })
      .catch(() => $toast.error('Error updating income'))
      .finally(() => getClientData(headers, clientId))
  }

  const updateFbar = (headers, { clientId, fbarId = '' }, fbar) => {
    const endpoint = fbarId ? `/fbars/${fbarId}` : '/fbars'
    return $axios
      .put(endpoint, fbar, { headers })
      .catch(() => $toast.error('Error updating fbar'))
      .finally(() => getClientData(headers, clientId))
  }

  const updateFee = (headers, { clientId, feeId }, fee) =>
    $axios
      .put(`/fees/${feeId}`, fee, { headers })
      .catch(() => $toast.error('Error updating fee'))
      .finally(() => getClientData(headers, clientId))

  const updateFiling = (headers, { clientId, filingId }, filing) =>
    $axios
      .put(`/filings/${filingId}`, filing, { headers })
      .catch(() => $toast.error('Error updating filing'))
      .finally(() => getClientData(headers, clientId))

  const updateTaxYear = (headers, { clientId, taxYearId }, taxYear) =>
    $axios
      .put(`/tax-years/${taxYearId}`, taxYear, { headers })
      .catch(() => $toast.error('Error updating tax year'))
      .finally(() => getClientData(headers, clientId))

  const updateChecklist = (headers, { clientId, checklistId }, checklist) =>
    $axios
      .put(`/checklists/${checklistId}`, checklist, { headers })
      .catch(() => $toast.error('Error updating checklist'))
      .finally(() => getClientData(headers, clientId))

  const updateSmartview = (headers, { smartviewId }, smartview) =>
    $axios
      .put(`/smartviews/${smartviewId}`, smartview, { headers })
      .catch(() => $toast.error('Error updating smartview'))
      .finally(() => getSmartviews(headers))

  const updateValueType = (headers, { valueId }, value) =>
    $axios
      .put(`/values/${valueId}`, value, { headers })
      .catch(() => $toast.error('Error updating value type'))
      .finally(() => getValueTypes(headers))

  const updateUser = (headers, { userId }, user) =>
    $axios
      .put(`/users/${userId}`, user, { headers })
      .catch((e) => $toast.error('Error updating user: ' + e.response.data.message))
      .finally(() => getAllUsers(headers))

  const updatePassword = (headers, { userId }, newPassword) =>
    $axios
      .put(`/users/${userId}/password`, newPassword, { headers })
      .catch((e) => $toast.error('Error updating password ' + e.response.data.message))

  const updateMessage = (headers, { messageId }, value) =>
    $axios
      .put(`/users/current/messages/${messageId}`, value, { headers })
      .catch(() => $toast.error('Error updating message'))
      .finally(() => getValueTypes(headers))

  // DELETE
  const deleteValueType = (headers, { valueId }) =>
    $axios
      .delete(`/values/${valueId}`, { headers })
      .catch(() => $toast.error('Error deleting value'))
      .finally(() => getValueTypes(headers))

  const deleteClient = (headers, { clientId }) =>
    $axios
      .delete(`/clients/${clientId}`, { headers })
      .catch(() => $toast.error('Error deleting client'))
      .finally(() => getClientList(headers))

  const deleteSmartview = (headers, { smartviewId }) =>
    $axios
      .delete(`/smartviews/${smartviewId}`, { headers })
      .catch(() => $toast.error('Error deleting smartview'))
      .finally(() => getSmartviews(headers))

  const deleteFiling = (headers, { filingId, clientId }) =>
    $axios
      .delete(`/filings/${filingId}`, { headers })
      .catch(() => $toast.error('Error deleting filing'))
      .finally(() => getClientData(headers, clientId))

  const deleteUser = (headers, { userId }) =>
    $axios
      .delete(`/users/${userId}`, { headers })
      .catch(() => $toast.error('Error deleting user'))
      .finally(() => getAllUsers(headers))

  const deleteMessage = (headers, { messageId }) =>
    $axios
      .delete(`/users/current/messages/${messageId}`, { headers })
      .catch(() => $toast.error('Error deleting message'))
      .finally(() => getInbox(headers))

  const api = {
    createChecklist,
    createClient,
    createContact,
    createFbar,
    createFee,
    createFiling,
    createIncome,
    createLog,
    createValueType,
    createPhoneNumber,
    createSmartview,
    createTaxPersonal,
    createTaxYear,
    createUser,
    deleteValueType,
    deleteClient,
    deleteSmartview,
    deleteFiling,
    deleteUser,
    getAllClientFees,
    getAllUsers,
    getClientData,
    getClientList,
    getClientsHistory,
    getHeaders,
    getSmartviews,
    getValueTaxGroups,
    getValueTypes,
    getPhoneNumbers,
    getInbox,
    login,
    signout,
    sendSms,
    sendMessage,
    updateChecklist,
    updateClient,
    updateContact,
    updateFbar,
    updateFee,
    updateFiling,
    updateIncome,
    updateLog,
    updateSmartview,
    updateTaxPersonal,
    updateTaxYear,
    updateValueType,
    updateUser,
    updatePassword,
    updateMessage,
    getCurrentUser,
    deleteMessage,
  }

  // Inject to context as $api
  inject('api', api)
}
