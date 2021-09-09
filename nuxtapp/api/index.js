import qs from 'qs'
import humps from 'humps'
import store from '@/store'

const http = this.$axios.create({
  baseURL: process.env.BASE_URL,
  withCredentials: false,
  responseType: 'json',

  // Override the default serializer to switch params from becoming []id=a&[]id=b ...
  // in GET and DELETE requests to id=a&id=b.
  paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
})

// Intercept requests to set the 'loading' state of a model.
http.interceptors.request.use((config) => {
  if ('loading' in config) {
    store.commit('setLoading', { model: config.loading, status: true })
  }
  return config
}, error => Promise.reject(error))

// Intercept responses to set them to store.
http.interceptors.response.use((resp) => {
  // Clear the loading state for a model.
  if ('loading' in resp.config) {
    store.commit('setLoading', { model: resp.config.loading, status: false })
  }

  let data = {}
  if (typeof resp.data.data === 'object') {
    data = { ...resp.data.data }
    if (!resp.config.preserveCase) {
      // Transform field case.
      data = humps.camelizeKeys(resp.data.data)
    }
  } else {
    data = resp.data.data
  }

  // Store the API response for a model.
  if ('store' in resp.config) {
    store.commit('setModelResponse', { model: resp.config.store, data })
  }

  return data
}, (err) => {
  // Clear the loading state for a model.
  if ('loading' in err.config) {
    store.commit('setLoading', { model: err.config.loading, status: false })
  }

  // ``let msg = ''
  // if (err.response.data && err.response.data.message) {
  //   msg = err.response.data.message
  // } else {
  //   msg = err.toString()
  // }``

  // if (!err.config.disableToast) {
  //   Toast.open({
  //     message: msg,
  //     type: 'is-danger',
  //     queue: false
  //   })
  // }

  return Promise.reject(err)
})

// API calls accept the following config keys.
// loading: modelName (set's the loading status in the global store: eg: store.loading.lists = true)
// store: modelName (set's the API response in the global store. eg: store.lists: { ... } )
