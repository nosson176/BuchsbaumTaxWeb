import {
  A_CLIENT_RESET_NOTIFICATION,
  A_CLIENT_SET_NOTIFICATION, SET_CURRENT_NOTIFICATION,
  SET_NOTIFICATIONS_STATE,
  GET_NOTIFICATIONS_STATE
} from '@/shared/constants'
import { isNotificationValid } from '@/shared/domain-utilities'
import { asyncArrayConstructor } from '@/shared/utility'

const namespaced = false

const state = () => {
  return {
    currentNotification: null,
    notificationsState: asyncArrayConstructor()
  }
}

const getters = {
  [GET_NOTIFICATIONS_STATE] (state) {
    return state.notificationsState
  }
}

const mutations = {
  [SET_CURRENT_NOTIFICATION]: (state, notification) => {
    state.currentNotification = notification
  },
  [SET_NOTIFICATIONS_STATE]: (state, newAsyncState) => {
    state.notificationsState = newAsyncState
  }
}

const actions = {
  [A_CLIENT_SET_NOTIFICATION] ({ commit }, { notification }) {
    if (isNotificationValid(notification)) {
      commit(SET_CURRENT_NOTIFICATION, notification)
    }
  },
  [A_CLIENT_RESET_NOTIFICATION] ({ commit }) {
    commit(SET_CURRENT_NOTIFICATION, null)
  }
}

export { namespaced, state, getters, mutations, actions }
