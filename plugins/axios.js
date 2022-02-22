import { mutations } from '~/shared/constants'

export default function ({ $axios, store }) {
  $axios.onRequest((config) => {
    if ('loading' in config) {
      store.commit(mutations.setLoading, { model: config.loading, status: true })
    }
    return config
  })

  $axios.onError((err) => {
    return Promise.reject(err)
  })

  $axios.onResponse((resp) => {
    // Clear the loading state for a model.
    if ('loading' in resp.config) {
      store.commit(mutations.setLoading, { model: resp.config.loading, status: false })
    }

    let data = {}
    if (typeof resp.data === 'object') {
      data = { ...resp.data }
    } else {
      data = resp.data
    }

    // Store the API response for a model.
    if ('store' in resp.config) {
      store.commit(mutations.setModelResponse, { model: resp.config.store, data })
    }

    return data
  })

  $axios.onResponseError((err) => {
    // Clear the loading state for a model.
    if ('loading' in err.config) {
      store.commit(mutations.setLoading, { model: err.config.loading, status: false })
    }

    return Promise.reject(err)
  })
}
