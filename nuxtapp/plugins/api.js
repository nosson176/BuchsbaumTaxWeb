import { models } from '~/shared/constants'

export default function ({ $axios }, inject) {
  // Create a custom axios instance
  const api = {
    login: () => $axios.get('/api/sessions', { loading: models.token })
  }

  // Inject to context as $api
  inject('api', api)
}
