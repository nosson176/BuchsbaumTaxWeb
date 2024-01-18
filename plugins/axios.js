import { COOKIE_KEY_SESSION_TOKEN, error, models, mutations, routes } from '~/shared/constants'
import { setCookieByKey } from '~/shared/cookie-utilities'

export default function ({ $axios, store, redirect }) {
  $axios.onRequest((config) => {
    if ('loading' in config) {
      store.commit(mutations.setLoading, {
        model: config.loading,
        status: true,
      })
    }
    if ('loaded' in config) {
      store.commit(mutations.setLoaded, {
        model: config.loaded,
        status: false,
      })
    }
    return config
  })

  $axios.onError((err) => {
    if (err.message === error.axios_401) {
      const token = ''
      setCookieByKey(COOKIE_KEY_SESSION_TOKEN, token, { expires: 365 })
      store.commit(mutations.setModelResponse, {
        model: models.token,
        data: { token },
      })
      redirect({ name: routes.login })
    }
    return Promise.reject(err)
  })

  $axios.onResponse((resp) => {
    // Clear the loading state for a model.
    if ('loading' in resp.config) {
      store.commit(mutations.setLoading, {
        model: resp.config.loading,
        status: false,
      })
      if ('loaded' in resp.config) {
        store.commit(mutations.setLoaded, {
          model: resp.config.loaded,
          status: true,
        })
      }
    }

    let data = {}
    if (typeof resp.data === 'object') {
      data = { ...resp.data }
    } else {
      data = resp.data
    }

    // Store the API response for a model.
    if ('store' in resp.config) {
      store.commit(mutations.setModelResponse, {
        model: resp.config.store,
        data,
      })
    }

    return data
  })

  $axios.onResponseError((err) => {
    // Clear the loading state for a model.
    if ('loading' in err.config) {
      store.commit(mutations.setLoading, {
        model: err.config.loading,
        status: false,
      })
      if ('loaded' in err.config) {
        store.commit(mutations.setLoaded, {
          model: err.config.loaded,
          status: false,
        })
      }
    }

    return Promise.reject(err)
  })
}
