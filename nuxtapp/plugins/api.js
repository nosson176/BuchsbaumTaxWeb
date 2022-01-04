import { COOKIE_KEY_SESSION_TOKEN, models, mutations } from '~/shared/constants'
import { getCookieByKey, setCookieByKey } from '~/shared/cookie-utilities'

export default ({ $axios, store }, inject) => {
  const getHeaders = () => {
    const headers = {}
    const token = getCookieByKey(COOKIE_KEY_SESSION_TOKEN)
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    return headers
  }

  const login = data => $axios.post('/sessions', data, { loading: models.token, store: models.token })
  const signout = () => {
    const token = ''
    setCookieByKey(COOKIE_KEY_SESSION_TOKEN, token, { expires: 365 })
    store.commit(mutations.setModelResponse, { model: models.token, data: { token } })
  }

  // GET
  const getClientList = (headers, searchParam = '') => $axios.get(
    searchParam ? `clients/?q=${searchParam}` : 'clients/', { headers, loading: models.clients, store: models.clients }
  )
  const getClientData = (headers, id) => $axios.get(
    `/clients/${id}/data`, { headers, loading: models.selectedClient, store: models.selectedClient }
  ).then(() => getClientsHistory(headers))
  const getValueTypes = headers => $axios.get('values', { headers, loading: models.valueTypes, store: models.valueTypes })
  const getValueTaxGroups = headers => $axios.get('values/tax-groups', { headers, loading: models.valueTaxGroups, store: models.valueTaxGroups })
  const getAllClientFees = headers => $axios.get('/clients/fees', { headers, loading: models.allClientFees, store: models.allClientFees })
  const getAllUsers = headers => $axios.get('/users', { headers, loading: models.users, store: models.users })
  const getClientsHistory = headers => $axios.get('/clients/history', { headers, loading: models.clientsHistory, store: models.clientsHistory })
  const getSmartviews = headers => $axios.get('/smartviews', { headers, loading: models.smartviews, store: models.smartviews })

  // CREATE
  const createLog = (headers, { clientId, log }) => $axios.post(
  `/clients/${clientId}/logs`, log, { headers }
  )
  const createTaxPersonal = (headers, { clientId, personal }) => $axios.post(
  `/clients/${clientId}/personals`, personal, { headers }
  )
  const createContact = (headers, { clientId, contact }) => $axios.post(
  `/clients/${clientId}/contacts`, contact, { headers }
  )
  const createIncome = (headers, { clientId, income }) => $axios.post(
  `/clients/${clientId}/income`, income, { headers }
  )
  const createFbar = (headers, { clientId, fbar }) => $axios.post(
  `/clients/${clientId}/fbar`, fbar, { headers }
  )
  const createFee = (headers, { fee }) => $axios.post(
    '/clients/fees', fee, { headers }
  )
  const createTaxYear = (headers, { clientId, taxYear }) => $axios.post(
    `/clients/${clientId}/tax-years`, taxYear, { headers }
  )
  const createFiling = (headers, { filing }) => $axios.post(
    '/clients/filings', filing, { headers }
  )
  const createChecklist = (headers, { checklist }) => $axios.post(
    '/clients/checklists', checklist, { headers }
  )
  const createClient = (headers, { client }) => $axios.post(
    '/clients', client, { headers }
  )

  // UPDATE
  const updateClient = (headers, { clientId, client }) =>
    $axios.put(`/clients/${clientId}`, client, { headers })
      .finally(() => this.$api.getClientData(headers, clientId))

  const updateLog = (headers, { clientId, logId }, log) =>
    $axios.put(`/clients/${clientId}/logs/${logId}`, log, { headers })
      .finally(() => this.$api.getClientData(headers, clientId))

  const updateTaxPersonal = (headers, { clientId, personalId }, personal) =>
    $axios.put(`/clients/${clientId}/personals/${personalId}`, personal, { headers })
      .finally(() => this.$api.getClientData(headers, clientId))

  const updateContact = (headers, { clientId, contactId }, contact) =>
    $axios.put(`/clients/${clientId}/contacts/${contactId}`, contact, { headers })
      .finally(() => this.$api.getClientData(headers, clientId))

  const updateIncome = (headers, { clientId, incomeId }, income) =>
    $axios.put(`/clients/${clientId}/income/${incomeId}`, income, { headers })
      .finally(() => this.$api.getClientData(headers, clientId))

  const updateFbar = (headers, { clientId, fbarId }, fbar) =>
    $axios.put(`/clients/${clientId}/fbar/${fbarId}`, fbar, { headers })
      .finally(() => this.$api.getClientData(headers, clientId))

  const updateFee = (headers, { clientId, feeId }, fee) =>
    $axios.put(`/clients/fees/${feeId}`, fee, { headers })
      .finally(() => this.$api.getClientData(headers, clientId))

  const updateFiling = (headers, { clientId, filingId }, filing) =>
    $axios.put(`/clients/filings/${filingId}`, filing, { headers })
      .finally(() => this.$api.getClientData(headers, clientId))

  const updateTaxYear = (headers, { clientId, taxYearId }, taxYear) =>
    $axios.put(`/clients/${clientId}/tax-years/${taxYearId}`, taxYear, { headers })
      .finally(() => this.$api.getClientData(headers, clientId))

  const updateChecklist = (headers, { clientId, checklistId }, checklist) =>
    $axios.put(`/clients/checklists/${checklistId}`, checklist, { headers })
      .finally(() => this.$api.getClientData(headers, clientId))

  const api = {
    createChecklist,
    createClient,
    createContact,
    createFbar,
    createFee,
    createFiling,
    createIncome,
    createLog,
    createTaxPersonal,
    createTaxYear,
    getAllClientFees,
    getAllUsers,
    getClientData,
    getClientList,
    getClientsHistory,
    getHeaders,
    getSmartviews,
    getValueTaxGroups,
    getValueTypes,
    login,
    signout,
    updateChecklist,
    updateClient,
    updateContact,
    updateFbar,
    updateFee,
    updateFiling,
    updateIncome,
    updateLog,
    updateTaxPersonal,
    updateTaxYear
  }

  // Inject to context as $api
  inject('api', api)
}
