import {
  LOADING_STARTED,
  LOADING_COMPLETED_SUCCESS,
  LOADING_COMPLETED_FAILURE,
  GET_BACKEND_URL,
  GET_LATEST_ROUTE,
  PUSH_TO_SESSION_HISTORY,
  SET_SCROLL_STATE_BY_KEY,
  SET_CLIENT_SIDE_INIT_STATE,
  A_AFTER_EACH_ROUTE,
  APP_CLIENT_SIDE_INIT,
  A_BEFORE_EACH_ROUTE,
  GET_S3_URL,
  GET_PREVIOUS_ROUTE,
  GET_BASE_URL, GET_DOES_USER_HAVE_SESSION
} from '@/shared/constants'
import { asyncObjectConstructor } from '@/shared/utility'

const namespaced = false

const state = () => {
  return {
    sessionHistory: []
  }
}

const getters = {
  [GET_BASE_URL] () {
    return process.env.BASE_URL
  },
  [GET_BACKEND_URL] () {
    return process.env.BACKEND_URL
  },
  [GET_S3_URL] () {
    return process.env.S3_URL
  },
  [GET_LATEST_ROUTE] (state) {
    const arr = state.sessionHistory
    return arr[arr.length - 1]
  },
  [GET_PREVIOUS_ROUTE] (state) {
    const arr = state.sessionHistory
    let route = null
    if (arr.length >= 2) {
      route = arr[arr.length - 2]
    }
    return route
  }
}

const mutations = {
  [PUSH_TO_SESSION_HISTORY]: (state, newRoute) => {
    state.sessionHistory.push(newRoute)
  },
  [SET_SCROLL_STATE_BY_KEY]: (state, payload) => {
    state.scrollStateHash = Object.assign({}, state.scrollStateHash, payload)
  },
  [SET_CLIENT_SIDE_INIT_STATE]: (state, newState) => {
    state.clientSideInitState = newState
  }
}

const actions = {
  async nuxtServerInit ({ dispatch }, { req }) {
    const proms = []
    await Promise.all(proms)
  },
  async [APP_CLIENT_SIDE_INIT] ({ commit, dispatch, getters }, payload) {
    const newStateObj0 = asyncObjectConstructor()
    newStateObj0.loadingState = LOADING_STARTED
    commit(SET_CLIENT_SIDE_INIT_STATE, newStateObj0)
    try {
      const proms = []
      if (getters[GET_DOES_USER_HAVE_SESSION]) {
      }
      await Promise.all(proms)

      const newStateObj1 = asyncObjectConstructor()
      newStateObj1.loadingState = LOADING_COMPLETED_SUCCESS
      commit(SET_CLIENT_SIDE_INIT_STATE, newStateObj1)
    } catch (e) {
      const newStateObj2 = asyncObjectConstructor()
      newStateObj2.loadingState = LOADING_COMPLETED_FAILURE
      newStateObj2.error = e
      commit(SET_CLIENT_SIDE_INIT_STATE, newStateObj2)
    }
  },
  async [A_BEFORE_EACH_ROUTE] ({ commit, dispatch }, { to, from }) {
    const proms = []
    await Promise.all(proms)
  },
  async [A_AFTER_EACH_ROUTE] ({ commit, dispatch }, { to, from }) {
    commit(PUSH_TO_SESSION_HISTORY, to)
    const proms = []
    await Promise.all(proms)
  }
}

export { namespaced, state, getters, mutations, actions }
