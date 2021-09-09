import { models } from '~/shared/constants'

export default function ({ $axios }, inject) {
  const login = () => $axios.get('/api/sessions', { loading: models.token })

  // Create a custom axios instance
  const api = {
    login
  }

  // Inject to context as $api
  inject('api', api)
}
