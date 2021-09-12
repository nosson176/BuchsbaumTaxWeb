import { models, getters } from '~/shared/constants'

export default ({ $axios, store }, inject) => {
  const httpConfig = store.getters[getters.getHttpConfig]
  console.log(httpConfig)
  const login = data => $axios.post('/api/sessions', data, { loading: models.token, store: models.token })

  const getClientList = () => $axios.get('/api/clients', { httpConfig, loading: models.clients })

  const api = {
    login,
    getClientList
  }
  // Inject to context as $api
  inject('api', api)
}
