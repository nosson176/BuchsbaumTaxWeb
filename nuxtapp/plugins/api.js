import { COOKIE_KEY_SESSION_TOKEN, models, mutations } from '~/shared/constants'
import { getCookieByKey, setCookieByKey } from '~/shared/cookie-utilities'

export default ({ $axios, store }, inject) => {
  const getHttpConfig = () => {
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

  const getClientList = headers => $axios.get('/clients', { headers, loading: models.clients, store: models.clients })
  const getClientData = (headers, id) => $axios.get(
    `/clients/${id}/data`, { headers, loading: models.selectedClient, store: models.selectedClient }
  ).then(() => getClientsHistory(headers))
  const getValueTypes = headers => $axios.get('values', { headers, loading: models.valueTypes, store: models.valueTypes })
  const getValueTaxGroups = headers => $axios.get('values/tax-groups', { headers, loading: models.valueTaxGroups, store: models.valueTaxGroups })
  const createLog = (headers, { clientId, log }) => $axios.post(
    `/clients/${clientId}/logs`, log, { headers }
  )
  const updateLog = (headers, { clientId, logId }, log) => $axios.put(
    `/clients/${clientId}/logs/${logId}`, log, { headers }
  )
  const createTaxPersonal = (headers, { clientId, personal }) => $axios.post(
    `/clients/${clientId}/personals`, personal, { headers }
  )
  const updateTaxPersonal = (headers, { clientId, personalId }, personal) => $axios.put(
    `/clients/${clientId}/personals/${personalId}`, personal, { headers }
  )
  const createContact = (headers, { clientId, contact }) => $axios.post(
    `/clients/${clientId}/contacts`, contact, { headers }
  )
  const updateContact = (headers, { clientId, contactId }, contact) => $axios.put(
    `/clients/${clientId}/contacts/${contactId}`, contact, { headers }
  )
  const createIncome = (headers, { clientId, income }) => $axios.post(
    `/clients/${clientId}/income`, income, { headers }
  )
  const updateIncome = (headers, { clientId, incomeId }, income) => $axios.put(
    `/clients/${clientId}/income/${incomeId}`, income, { headers }
  )
  const createFbar = (headers, { clientId, fbar }) => $axios.post(
    `/clients/${clientId}/fbar`, fbar, { headers }
  )
  const updateFbar = (headers, { clientId, fbarId }, fbar) => $axios.put(
    `/clients/${clientId}/fbar/${fbarId}`, fbar, { headers }
  )
  const createFee = (headers, { fee }) => $axios.post(
    '/clients/fees', fee, { headers }
  )
  const updateFee = (headers, { feeId }, fee) => $axios.put(
    `/clients/fees/${feeId}`, fee, { headers }
  )
  const getAllClientFees = headers => $axios.get('/clients/fees', { headers, loading: models.allClientFees, store: models.allClientFees })
  const getAllUsers = headers => $axios.get('/users', { headers, loading: models.users, store: models.users })
  const getClientsHistory = headers => $axios.get('/clients/history', { headers, loading: models.clientsHistory, store: models.clientsHistory })

  const api = {
    login,
    signout,
    getClientList,
    getClientData,
    getValueTypes,
    getValueTaxGroups,
    getHttpConfig,
    createLog,
    updateLog,
    createTaxPersonal,
    updateTaxPersonal,
    createContact,
    updateContact,
    createIncome,
    updateIncome,
    createFbar,
    updateFbar,
    createFee,
    updateFee,
    getAllClientFees,
    getAllUsers,
    getClientsHistory
  }

  // Inject to context as $api
  inject('api', api)
}
