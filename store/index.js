import Vue from 'vue'
import { models } from '~/shared/constants'
const namespaced = false

const state = () => {
  return {
    // Data from API responses for different models, eg: lists, campaigns.
    // The API responses are stored in this map as-is. This is invoked by
    // API requests in `http`. This initialises lists: {}, campaigns: {}
    // etc. on state.
    ...Object.keys(models).reduce((obj, cur) => ({ ...obj, [cur]: [] }), {}),

    // Map of loading status (true, false) indicators for different model keys
    // like lists, campaigns etc. loading: {lists: true, campaigns: true ...}.
    // The Axios API global request interceptor marks a model as loading=true
    // and the response interceptor marks it as false. The model keys are being
    // pre-initialised here to fix "reactivity" issues on first loads.
    loading: Object.keys(models).reduce((obj, cur) => ({ ...obj, [cur]: true }), {}),
    loaded: Object.keys(models).reduce((obj, cur) => ({ ...obj, [cur]: false }), {}),
    globalPlayTime: true,
    secondsNeededToDisplayModal1: 600,
    copyLogs: [],
    clientAndLogs: [],
    filingsUpdate: [],
    spinner: false,
  }
}

const getters = {
  isAuthenticated: (state) => Object.keys(state[models.token]).length > 0,
  [models.appWidth]: (state) => state[models.appWidth],
  [models.secondsSpentOnClient]: (state) => state[models.secondsSpentOnClient],
  [models.selectedClient]: (state) => state[models.selectedClient],
  [models.promptOnClientChange]: (state) => state[models.promptOnClientChange],
  [models.dayLogs]: (state) => state[models.dayLogs],
  clientAndLogs: (state) => state.clientAndLogs,
}

const mutations = {
  // Set data from API responses. `model` is 'lists', 'campaigns' etc.
  setModelResponse(state, { model, data }) {
    if (model === models.clientAndLogs) {
      state.clientAndLogs = data
      return
    }
    state[model] = data
  },

  updateTaxYearState(state, { taxYearId, updatedData }) {
    console.log(taxYearId)
    console.log(updatedData)
    const index = state[models.selectedClient].taxYears.findIndex((taxYear) => taxYear.id === taxYearId)
    console.log(index)
    if (index !== -1) {
      // if (taxYear) {
      // Object.assign(taxYear, updatedData) // Update the taxYear state with new data
      state[models.selectedClient].taxYears.splice(index, 1, updatedData)
    } else {
      // If the tax year doesn't exist, add (push) it to the taxYears array
      state[models.selectedClient].taxYears.push({
        id: taxYearId,
        ...updatedData, // Spread operator to include the updated data fields
      })
    }
  },

  showSpinner(state, mode) {
    console.log(state.spinner)
    state.spinner = mode
  },

  setCopyLogs(state, log) {
    state.copyLogs.push(log) // Push the new log into the array
  },
  updateCopyLogs(state, { clientId, logDate, id }) {
    state.copyLogs = state.copyLogs.map((log) => {
      return { ...log, clientId, logDate, id }
    })
  },
  clearCopyLogs(state) {
    state.copyLogs = []
  },

  pushDayLog(state, log) {
    // המרת הערכים של dayLogs למערך
    const dayLogsArray = Object.values(state[models.dayLogs])

    // חיפוש האינדקס
    const index = dayLogsArray.findIndex((dayLog) => dayLog.id === log.log.id)

    if (index !== -1) {
      const key = Object.keys(state[models.dayLogs])[index]
      Vue.set(state[models.dayLogs], key, log.log)
    } else {
      Vue.set(state[models.dayLogs], log.log.id, log.log)
    }
  },

  clearDayLogs(state) {
    // אופציה פשוטה: הופך את dayLogs לאובייקט ריק
    state[models.dayLogs] = {}
  },

  pushNewLog(state, log) {
    state[models.selectedClient].logs.unshift(log.log)
  },

  pushNewIncome(state, income) {
    state[models.selectedClient].incomeBreakdowns.unshift(income.income)
  },

  updateIncome(state, income) {
    const index = state[models.selectedClient].incomeBreakdowns.findIndex((l) => l.id === income.income.id)
    if (index !== -1) {
      state[models.selectedClient].incomeBreakdowns.splice(index, 1, income.income)
    }
  },

  updateContact(state, contact) {
    const index = state[models.selectedClient].contacts.findIndex((l) => l.id === contact.contact.id)
    if (index !== -1) {
      state[models.selectedClient].contacts.splice(index, 1, contact.contact)
    }
  },

  pushNewFbar(state, fbar) {
    state[models.selectedClient].fbarBreakdowns.unshift(fbar.fbar)
  },

  pushNewTaxPersonal(state, taxPersonal) {
    state[models.selectedClient].taxPersonals.unshift(taxPersonal.personal)
  },

  pushNewContact(state, contact) {
    state[models.selectedClient].contacts.unshift(contact.contact)
  },

  pushNewFee(state, fee) {
    console.log('run22')
    state[models.selectedClient].fees.unshift(fee.fee)
  },

  pushNewChecklist(state, newChecklist) {
    state[models.selectedClient].checklists.unshift(newChecklist.newChecklist)
  },

  updateUserFlagClient(state, clientFlag) {
    const clientsArray = Object.values(state[models.clients])
    const index = clientsArray.findIndex((client) => client.id === clientFlag.clientId)
    if (index !== -1) {
      Vue.set(state[models.clients][index], 'flag', clientFlag.flag)
    }
  },

  updateGlobalFlagClient(state, clientFlag) {
    const clientsArray = Object.values(state[models.clients])
    const index = clientsArray.findIndex((client) => client.id === clientFlag.gFlag.clientId)
    if (index !== -1) {
      // state[models.clients][index].gFlag = clientFlag.gFlag.flag

      Vue.set(state[models.clients], index, {
        ...state[models.clients][index],
        gFlag: clientFlag.gFlag.flag,
      })
    }
  },

  updateLog(state, { log }) {
    const index = state[models.selectedClient].logs.findIndex((l) => l.id === log.id)
    if (index !== -1) {
      state[models.selectedClient].logs.splice(index, 1, log)
    }
  },

  updateFee(state, { fee }) {
    const index = state[models.selectedClient].fees.findIndex((l) => l.id === fee.id)
    if (index !== -1) {
      state[models.selectedClient].fees.splice(index, 1, fee)
    }
  },

  updateSmartview(state, { smartview }) {
    const smartviewsArray = Object.values(state[models.smartviews]) // Convert object to array

    const index = smartviewsArray.findIndex((l) => l.id === smartview.id)
    if (index !== -1) {
      smartviewsArray.splice(index, 1, smartview)
      state[models.smartviews] = smartviewsArray
    }
  },

  updateFbar(state, { fbar }) {
    const index = state[models.selectedClient].fbarBreakdowns.findIndex((l) => l.id === fbar.id)
    if (index !== -1) {
      state[models.selectedClient].fbarBreakdowns.splice(index, 1, fbar)
    }
  },

  updateTaxPersonal(state, { personal }) {
    const index = state[models.selectedClient].taxPersonals.findIndex((l) => l.id === personal.id)
    if (index !== -1) {
      state[models.selectedClient].taxPersonals.splice(index, 1, personal)
    }
  },

  pushNewFiling(state, filing) {
    const index = state[models.selectedClient].taxYears.findIndex((f) => f.id === filing.taxYearId)
    if (index !== -1) {
      state[models.selectedClient].taxYears[index].filings.push(filing)
    }
  },

  pushFilingUpdate(state, filing) {
    state.filingsUpdate.push(filing)
  },
  updateFilingUpdate(state, filing) {
    const index = state.filingsUpdate.findIndex((f) => f.id === filing.filing.id)
    if (index !== -1) {
      state.filingsUpdate.splice(index, 1, filing.filing)
      return state.filingsUpdate // Or, if you want to return the updated array, you can return `state.filingsUpdate`
    }
    state.filingsUpdate.push(filing)
  },
  clearFilingUpdate(state) {
    state.filingsUpdate = []
  },

  UPDATE_FILINGS_CONTACT(state, { oldValue, newValue }) {
    state.selectedClient.taxYears.forEach((taxYear) => {
      taxYear.filings.forEach((filing) => {
        if (filing.deliveryContact === oldValue) {
          filing.deliveryContact = newValue
        }
        if (filing.secondDeliveryContact === oldValue) {
          filing.secondDeliveryContact = newValue
        }
      })
    })
  },

  // Set the loading status for a model globally. When a request starts,
  // status is set to true which is used by the UI to show loaders and block
  // forms. When a response is received, the status is set to false. This is
  // invoked by API requests in `http`.
  setLoading(state, { model, status }) {
    state.loading[model] = status
  },
  setLoaded(state, { model, status }) {
    state.loaded[model] = status
  },
}

const actions = {
  updateLogAction({ commit, state }, { log }) {
    commit('updateLog', { log })
  },

  updateFilingAction({ commit, state }, { filing }) {
    commit('updateFilingUpdate', { filing })
  },

  updateFeeAction({ commit, state }, { fee }) {
    commit('updateFee', { fee })
  },

  updateFbarAction({ commit, state }, { fbar }) {
    commit('updateFbar', { fbar })
  },
  updateIncomeAction({ commit, state }, { income }) {
    commit('updateIncome', { income })
  },
  updateContactAction({ commit, state }, { contact }) {
    commit('updateContact', { contact })
  },
  updateTaxPersonalAction({ commit, state }, { personal }) {
    commit('updateTaxPersonal', { personal })
  },
  updateSmartviewAction({ commit, state }, { smartview }) {
    commit('updateSmartview', { smartview })
  },
  updateGlobalFlagAction({ commit, state }, { gFlag }) {
    commit('updateGlobalFlagClient', { gFlag })
  },
}

export { namespaced, state, getters, mutations, actions }
