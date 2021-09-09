import { setLoading, setModelResponse } from '~/shared/constants'

export default function ({ $axios, store }) {
  $axios.onRequest((config) => {
    console.log('config: ', config)
    if ('loading' in config) {
      store.commit(setLoading, { model: config.loading, status: true })
    }
    return config
  })

  $axios.onError((err) => {
    return Promise.reject(err)
  })

  $axios.onResponse((resp) => {
    console.log('resp: ', resp)
    // Clear the loading state for a model.
    if ('loading' in resp.config) {
      store.commit(setLoading, { model: resp.config.loading, status: false })
    }

    let data = {}
    if (typeof resp.data.data === 'object') {
      data = { ...resp.data.data }
    } else {
      data = resp.data.data
    }

    // Store the API response for a model.
    if ('store' in resp.config) {
      this.$store.commit(setModelResponse, { model: resp.config.store, data })
    }

    return data
  })

  $axios.onResponseError((err) => {
    console.log('err: ', err, 'store', this.$store)
    // Clear the loading state for a model.
    if ('loading' in err.config) {
      store.commit(setLoading, { model: err.config.loading, status: false })
    }

    return Promise.reject(err)
  })
}
