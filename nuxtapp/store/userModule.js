import {
  A_INIT_AUTHENTICATED_USER_MODULE,
  A_LOAD_CURRENT_USER,
  A_INIT_USER_MODULE,
  LOADING_COMPLETED_FAILURE,
  LOADING_COMPLETED_SUCCESS,
  LOADING_STARTED,
  GET_BACKEND_URL,
  ERROR_MESSAGE_AXIOS_401,
  GET_HTTP_CONFIG,
  GET_DOES_USER_HAVE_SESSION,
  SET_SESSION_TOKEN,
  GET_CURRENT_USER,
  SET_DID_SESSION_VALIDATION_FAIL,
  SET_INIT_USER_MODULE_STATE,
  SET_INIT_AUTHENTICATED_USER_MODULE_STATE,
  SET_USER_SIGNUP_STATE,
  SET_CURRENT_USER_STATE, COOKIE_KEY_SESSION_TOKEN, A_SET_SESSION_TOKEN, A_SIGN_OUT
} from '@/shared/constants'
import { asyncObjectConstructor } from '@/shared/utility'
import { removeCookieByKey, setCookieByKey } from '@/shared/cookie-utilities'

const namespaced = false

const state = () => {
  return {
    userSessionToken: '',
    didSessionValidationFail: false,
    initUserModuleState: asyncObjectConstructor(),
    initAuthenticatedUserModuleState: asyncObjectConstructor(),
    userSignupState: asyncObjectConstructor(),
    currentUserState: asyncObjectConstructor()
  }
}

const getters = {
  [GET_HTTP_CONFIG] (state) {
    const headers = {}
    if (state.userSessionToken) {
      headers.Authorization = `Bearer ${state.userSessionToken}`
    }
    return {
      headers
    }
  },
  [GET_DOES_USER_HAVE_SESSION] (state) {
    return !!state.userSessionToken
  },
  [GET_CURRENT_USER]: (state) => {
    return state.currentUserState.data
  }
}

const mutations = {
  [SET_SESSION_TOKEN]: (state, newString) => {
    state.userSessionToken = newString
  },
  [SET_DID_SESSION_VALIDATION_FAIL]: (state, newBoolean) => {
    state.didSessionValidationFail = newBoolean
  },
  [SET_INIT_USER_MODULE_STATE]: (state, newAsyncState) => {
    state.initUserModuleState = newAsyncState
  },
  [SET_INIT_AUTHENTICATED_USER_MODULE_STATE]: (state, newAsyncState) => {
    state.initAuthenticatedUserModuleState = newAsyncState
  },
  [SET_USER_SIGNUP_STATE]: (state, newAsyncState) => {
    state.userSignupState = newAsyncState
  },
  [SET_CURRENT_USER_STATE]: (state, newAsyncState) => {
    state.currentUserState = newAsyncState
  }
}

const actions = {
  async [A_INIT_USER_MODULE] ({ commit, dispatch }) {
    const newStateObj0 = asyncObjectConstructor()
    newStateObj0.loadingState = LOADING_STARTED
    commit(SET_INIT_USER_MODULE_STATE, newStateObj0)
    try {
      const proms = []
      await Promise.all(proms)
      const newStateObj1 = asyncObjectConstructor()
      newStateObj1.loadingState = LOADING_COMPLETED_SUCCESS
      commit(SET_INIT_USER_MODULE_STATE, newStateObj1)
    } catch (e) {
      const newStateObj2 = asyncObjectConstructor()
      newStateObj2.loadingState = LOADING_COMPLETED_FAILURE
      newStateObj2.error = e
      commit(SET_INIT_USER_MODULE_STATE, newStateObj2)
    }
  },
  async [A_INIT_AUTHENTICATED_USER_MODULE] ({ state, commit, dispatch }) {
    const newStateObj0 = asyncObjectConstructor()
    newStateObj0.loadingState = LOADING_STARTED
    commit(SET_INIT_AUTHENTICATED_USER_MODULE_STATE, newStateObj0)
    try {
      const proms = []
      proms.push(dispatch(A_LOAD_CURRENT_USER))
      await Promise.all(proms)
      if (state.currentUserState.loadingState === LOADING_COMPLETED_FAILURE) {
        if (state.currentUserState.error && state.currentUserState.error.message === ERROR_MESSAGE_AXIOS_401) {
          commit(SET_DID_SESSION_VALIDATION_FAIL, true)
        }
      }
      const newStateObj1 = asyncObjectConstructor()
      newStateObj1.loadingState = LOADING_COMPLETED_SUCCESS
      commit(SET_INIT_AUTHENTICATED_USER_MODULE_STATE, newStateObj1)
    } catch (e) {
      const newStateObj2 = asyncObjectConstructor()
      newStateObj2.loadingState = LOADING_COMPLETED_FAILURE
      newStateObj2.error = e
      commit(SET_INIT_AUTHENTICATED_USER_MODULE_STATE, newStateObj2)
    }
  },
  async [A_LOAD_CURRENT_USER] ({ commit, getters }) {
    const newStateObj0 = asyncObjectConstructor()
    newStateObj0.loadingState = LOADING_STARTED
    commit(SET_CURRENT_USER_STATE, newStateObj0)
    const urlObj = new URL(`${getters[GET_BACKEND_URL]}/api/users/current`)
    try {
      const res = await this.$axios.get(urlObj.href, getters[GET_HTTP_CONFIG])
      const newStateObj1 = asyncObjectConstructor()
      newStateObj1.data = res.data
      newStateObj1.loadingState = LOADING_COMPLETED_SUCCESS
      commit(SET_CURRENT_USER_STATE, newStateObj1)
    } catch (e) {
      const newStateObj2 = asyncObjectConstructor()
      newStateObj2.loadingState = LOADING_COMPLETED_FAILURE
      newStateObj2.error = e
      commit(SET_CURRENT_USER_STATE, newStateObj2)
    }
  },
  [A_SET_SESSION_TOKEN] ({ commit }, { token, rememberMe }) {
    commit(SET_SESSION_TOKEN, token)
    if (rememberMe) {
      setCookieByKey(COOKIE_KEY_SESSION_TOKEN, token, { expires: 365 })
    } else {
      setCookieByKey(COOKIE_KEY_SESSION_TOKEN, token, { expires: null })
    }
  },
  [A_SIGN_OUT] ({ state, commit, getters }) {
    commit(SET_USER_SIGNUP_STATE, asyncObjectConstructor())
    commit(SET_SESSION_TOKEN, '')
    commit(SET_DID_SESSION_VALIDATION_FAIL, false)
    removeCookieByKey(COOKIE_KEY_SESSION_TOKEN)
  }
}

export { namespaced, state, getters, mutations, actions }
