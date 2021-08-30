import {
  SET_APP_WIDTH, GET_IS_SCREEN_SIZE_TABLET, GET_IS_SCREEN_SIZE_MOBILE, GET_IS_SCREEN_SIZE_DESKTOP
} from '@/shared/constants'

const namespaced = false

const state = () => {
  return {
    width: 1280
  }
}

const getters = {
  [GET_IS_SCREEN_SIZE_MOBILE] (state) {
    return state.width <= 600
  },
  [GET_IS_SCREEN_SIZE_TABLET] (state, getters) {
    return state.width <= 1260 && !getters[GET_IS_SCREEN_SIZE_MOBILE]
  },
  [GET_IS_SCREEN_SIZE_DESKTOP] (state, getters) {
    return !getters[GET_IS_SCREEN_SIZE_TABLET] && !getters[GET_IS_SCREEN_SIZE_MOBILE]
  }
}

const mutations = {
  [SET_APP_WIDTH] (state, newNumber) {
    state.width = newNumber
  }
}

const actions = {}

export { namespaced, state, getters, mutations, actions }

