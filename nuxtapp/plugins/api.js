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

  const login = data => $axios.post('/api/sessions', data, { loading: models.token, store: models.token })
  const signout = () => {
    const token = ''
    setCookieByKey(COOKIE_KEY_SESSION_TOKEN, token, { expires: 365 })
    store.commit(mutations.setModelResponse, { model: models.token, data: { token } })
  }

  const getClientList = headers => $axios.get('/api/clients', { headers, loading: models.clients, store: models.clients })
  const getClientData = (id, headers) => $axios.get(
    '/api/clients/' + id + '/data', { headers, loading: models.selectedClient, store: models.selectedClient }
  )

  const api = {
    login,
    signout,
    getClientList,
    getClientData,
    getHttpConfig
  }

  // Inject to context as $api
  inject('api', api)
}
