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
  const getClientData = (id, headers) => $axios.get(
    `/clients/${id}/data`, { headers, loading: models.selectedClient, store: models.selectedClient }
  )
  const getValueTypes = headers => $axios.get('values', { headers, loading: models.valueTypes, store: models.valueTypes })
  const getValueTaxGroups = headers => $axios.get('values/tax-groups', { headers, loading: models.valueTaxGroups, store: models.valueTaxGroups })
  const updateLog = (headers, { clientId, logId }, log) => $axios.put(
    `/clients/${clientId}/logs/${logId}`, log, { headers }
  )
  const updatePersonal = (headers, { clientId, personalId }, personal) => $axios.put(
    `/clients/${clientId}/personals/${personalId}`, personal, { headers }
  )
  const updateContact = (headers, { clientId, contactId }, contact) => $axios.put(
    `/clients/${clientId}/contacts/${contactId}`, contact, { headers }
  )
  const updateIncome = (headers, { clientId, incomeId }, income) => $axios.put(
    `/clients/${clientId}/income/${incomeId}`, income, { headers }
  )
  const updateFbar = (headers, { clientId, fbarId }, fbar) => $axios.put(
    `/clients/${clientId}/fbar/${fbarId}`, fbar, { headers }
  )

  const api = {
    login,
    signout,
    getClientList,
    getClientData,
    getValueTypes,
    getValueTaxGroups,
    getHttpConfig,
    updateLog,
    updatePersonal,
    updateContact,
    updateIncome,
    updateFbar
  }

  // Inject to context as $api
  inject('api', api)
}
