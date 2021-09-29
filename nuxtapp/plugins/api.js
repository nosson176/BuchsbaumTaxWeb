import { COOKIE_KEY_SESSION_TOKEN, models } from '~/shared/constants'
import { getCookieByKey } from '~/shared/cookie-utilities'

const getHttpConfig = () => {
  const headers = {}
  const token = getCookieByKey(COOKIE_KEY_SESSION_TOKEN)
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

export default ({ $axios }, inject) => {
  const headers = getHttpConfig()

  const login = data => $axios.post('/api/sessions', data, { loading: models.token, store: models.token })

  const getClientList = () => $axios.get('/api/clients', { headers, loading: models.clients, store: models.clients })

  const api = {
    login,
    getClientList
  }

  // Inject to context as $api
  inject('api', api)
}
