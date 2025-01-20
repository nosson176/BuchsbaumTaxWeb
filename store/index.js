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
    dotStatus: true,
    workTimeActive: false,
    timerState: {
      startTime: null,
      isRunning: false,
    },
  }
}

const getters = {
  isAuthenticated: (state) => Object.keys(state[models.token]).length > 0,
  [models.appWidth]: (state) => state[models.appWidth],
  [models.secondsSpentOnClient]: (state) => state[models.secondsSpentOnClient],
  [models.selectedClient]: (state) => state[models.selectedClient],
  [models.promptOnClientChange]: (state) => state[models.promptOnClientChange],
  [models.users]: (state) => state[models.users],
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

  SET_TIMER_STATE(state, { startTime, isRunning }) {
    state.timerState = { startTime, isRunning }
  },

  changeDotStatus(state) {
    state.dotStatus = !state.dotStatus
  },

  toggleWorkTime(state, mode) {
    state.workTimeActive = mode
  },

  deleteUser(state, userId) {
    const usersArray = Object.values(state[models.users]) // המרה למערך
    const index = usersArray.findIndex((user) => user.id === userId)

    if (index !== -1) {
      usersArray.splice(index, 1)
      state[models.users] = usersArray // עדכון ה-state לאחר הסרה
    }
  },

  pushNewUser(state, user) {
    const userId = user.id // מזהה ייחודי למשתמש
    Vue.set(state[models.users], userId, user) // שימוש ב-Vue.set להוספת שדה חדש בצורה ריאקטיבית
  },

  updateUser(state, updatedUser) {
    const userId = updatedUser.id

    // Convert the users object to an array and find the user by id
    const usersArray = Object.values(state[models.users])
    const userIndex = usersArray.findIndex((user) => user.id === userId)

    if (userIndex !== -1) {
      // Find the corresponding key for the user in the original users object
      const userKey = Object.keys(state[models.users])[userIndex]

      // Use Vue.set to ensure reactivity when updating the user in the object
      Vue.set(state[models.users], userKey, updatedUser)
    }
  },

  updateTaxYearState(state, { taxYearId, updatedData }) {
    const index = state[models.selectedClient].taxYears.findIndex((taxYear) => taxYear.id === taxYearId)
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
  // pushDayLog(state, log) {
  //   // בדיקה אם הלוג כבר קיים במפתחות של dayLogs
  //   if (state[models.dayLogs][log.log.id]) {
  //     // אם הלוג כבר קיים, מעדכן אותו
  //     Vue.set(state[models.dayLogs], log.log.id, log.log)
  //   } else {
  //     // אם הלוג לא קיים, מוסיף אותו
  //     Vue.set(state[models.dayLogs], log.log.id, log.log)
  //   }
  // },

  clearDayLogs(state) {
    // אופציה פשוטה: הופך את dayLogs לאובייקט ריק
    state[models.dayLogs] = {}
  },

  pushNewLog(state, log) {
    state[models.selectedClient].logs.unshift(log.log)
  },

  pushRestLogs(state, logs) {
    state[models.selectedClient].logs.push(...logs)
  },

  hideRestLogs(state, count) {
    // Remove 'count' number of logs from the end of the array
    const updatedLogs = state[models.selectedClient].logs.slice(0, -count) // Create a new array with the remaining logs
    state[models.selectedClient].logs = updatedLogs // Reassign the array to trigger reactivity
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
    state[models.selectedClient].fees.unshift(fee.fee)
  },

  pushNewChecklist(state, newChecklist) {
    state[models.selectedClient].checklists.unshift(newChecklist.newChecklist)
  },

  pushNewClient(state, newClient) {
    const clientId = newClient.id // מזהה ייחודי למשתמש
    Vue.set(state[models.clients], clientId, newClient)
  },

  pushNewSmartview(state, newSmartview) {
    // Ensure we're working with an object structure
    const smartviewId = String(newSmartview.id)
    if (!state[models.smartviews]) {
      state[models.smartviews] = {}
    }
    // Add new smartview to the object
    Vue.set(state[models.smartviews], smartviewId, newSmartview)
  },

  updateUserFlagClient(state, clientFlag) {
    // Find the key of the client with the given ID
    const clientKey = Object.keys(state[models.clients]).find(
      (key) => state[models.clients][key].id === clientFlag.clientId
    )

    if (clientKey !== undefined) {
      // Update the 'flag' property of the original client object
      Vue.set(state[models.clients][clientKey], 'flag', clientFlag.flag)
    } else {
      console.error('Client not found with the given ID.')
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

  updateLastNameClient(state, { selectedClient, lastName }) {
    const clientsArray = Object.values(state[models.clients])
    const index = clientsArray.findIndex((client) => client.id === selectedClient.id)
    if (index !== -1) {
      Vue.set(state[models.clients], index, {
        ...state[models.clients][index],
        lastName,
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

  updateSmartviewsBatch(state, { smartviews }) {
    const smartviewsArray = Object.values(state[models.smartviews]) // Convert object to array

    smartviews.forEach((smartview) => {
      const index = smartviewsArray.findIndex((l) => l.id === smartview.id)
      if (index !== -1) {
        const existingSmartview = smartviewsArray[index]

        // Update only the fields that are being changed
        const updatedSmartview = {
          ...existingSmartview, // Preserve existing fields
          sortNumber: smartview.sortNumber, // Update sortNumber
          // Update other fields as necessary
        }

        smartviewsArray.splice(index, 1, updatedSmartview)
      } else {
        smartviewsArray.push(smartview) // If the smartview doesn't exist, add it
      }
    })

    state[models.smartviews] = smartviewsArray
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
      // Use spread operator to ensure reactivity
      state[models.selectedClient].taxYears[index].filings = [
        ...state[models.selectedClient].taxYears[index].filings,
        filing,
      ]
    }
  },
  // pushNewFiling(state, filing) {
  //   console.log(state[models.selectedClient].taxYears)
  //   const index = state[models.selectedClient].taxYears.findIndex((f) => f.id === filing.taxYearId)
  //   console.log(index)
  //   if (index !== -1) {
  //     state[models.selectedClient].taxYears[index].filings.push(filing)
  //   }
  // },

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

  updateTotals(state, { dollars, shekels }) {
    state.totalOwedDollars = dollars
    state.totalOwedShekels = shekels
  },

  updateFiling(state, { filingId, taxYearId, data }) {
    const taxYear = state.selectedClient.taxYears.find((ty) => ty.id === taxYearId)
    if (taxYear) {
      const filing = taxYear.filings.find((f) => f.id === filingId)
      if (filing) {
        Object.assign(filing, data)
      }
    }
  },

  deleteFiling(state, { filingId, taxYearId }) {
    const taxYear = state.selectedClient.taxYears.find((ty) => ty.id === taxYearId)
    if (taxYear) {
      const index = taxYear.filings.findIndex((f) => f.id === filingId)
      if (index !== -1) {
        taxYear.filings.splice(index, 1)
      }
    }
  },

  updateFilingCurrency(state, { filingId, oldCurrency, newCurrency, amount }) {
    // Update currency totals when currency changes
    if (newCurrency === 'NIS') {
      state.totalOwedDollars -= amount.owes - amount.paid + amount.owesFee - amount.paidFee
      state.totalOwedShekels += amount.owes - amount.paid + amount.owesFee - amount.paidFee
    } else if (newCurrency === 'USD') {
      state.totalOwedShekels -= amount.owes - amount.paid + amount.owesFee - amount.paidFee
      state.totalOwedDollars += amount.owes - amount.paid + amount.owesFee - amount.paidFee
    }
  },

  archiveClient(state, clientId) {
    const clientsArray = Object.values(state.clients)
    const index = clientsArray.findIndex((client) => client.id === clientId)
    if (index !== -1) {
      clientsArray[index].archived = true
      state.clients = clientsArray
    }
  },

  deleteClient(state, clientId) {
    const clientsArray = Object.values(state.clients)
    const index = clientsArray.findIndex((client) => client.id === clientId)
    if (index !== -1) {
      clientsArray.splice(index, 1)
      state.clients = clientsArray
    }
  },

  deleteTaxYear(state, { taxId }) {
    const index = state[models.selectedClient].taxYears.findIndex((taxYear) => taxYear.id === taxId)
    if (index !== -1) state[models.selectedClient].taxYears.splice(index, 1)
  },

  deleteLog(state, logId) {
    const index = state[models.selectedClient].logs.findIndex((log) => log.id === logId)
    if (index !== -1) state[models.selectedClient].logs.splice(index, 1)
  },

  deleteTaxPersonal(state, { personalId }) {
    const index = state[models.selectedClient].taxPersonals.findIndex((personal) => personal.id === personalId)
    if (index !== -1) state[models.selectedClient].taxPersonals.splice(index, 1)
  },

  deleteContact(state, { contactId }) {
    const index = state[models.selectedClient].contacts.findIndex((contact) => contact.id === contactId)
    if (index !== -1) state[models.selectedClient].contacts.splice(index, 1)
  },

  deleteIncome(state, deleteIncomeId) {
    const index = state[models.selectedClient].incomeBreakdowns.findIndex((income) => income.id === deleteIncomeId)
    if (index !== -1) state[models.selectedClient].incomeBreakdowns.splice(index, 1)
  },

  deleteFbar(state, deleteFbarId) {
    const index = state[models.selectedClient].fbarBreakdowns.findIndex((fbar) => fbar.id === deleteFbarId)
    if (index !== -1) state[models.selectedClient].fbarBreakdowns.splice(index, 1)
  },

  deleteFee(state, deleteFeeId) {
    const index = state[models.selectedClient].fees.findIndex((fee) => fee.id === deleteFeeId)
    if (index !== -1) state[models.selectedClient].fees.splice(index, 1)
  },

  markMsgAsRead(state, message) {
    const inbox = Object.values(state.inbox)
    const index = inbox.findIndex((msg) => msg.id === message.id)
    if (index !== -1) {
      inbox[index].status = 'read'
      state.inbox = inbox
    }
  },

  pushNewMsg(state, { msg, parentId }) {
    // Get inbox as an array
    const inbox = Object.values(state.inbox)

    let messageAdded = false // Flag to track if the message was added

    if (parentId) {
      // Find the parent message by ID
      const parentMessage = inbox.find((message) => message.id === parentId)
      if (parentMessage) {
        // Check if the message already exists in the parent's responses
        const existingResponse = parentMessage.responses.find((response) => response.id === msg.id)
        if (!existingResponse) {
          parentMessage.responses.push(msg)
          state.inbox = { ...state.inbox }
          messageAdded = true
        }
      } else {
        // Check in responses of all messages
        inbox.forEach((message) => {
          if (Array.isArray(message.responses)) {
            const responseIndex = message.responses.findIndex((response) => response.id === parentId)
            if (responseIndex !== -1) {
              const existingResponse = message.responses.find((response) => response.id === msg.id)
              if (!existingResponse) {
                message.responses.push(msg)
                state.inbox = { ...state.inbox }
                messageAdded = true
              }
            }
          }
        })
      }
    }

    if (!messageAdded) {
      // Check if the message already exists in the inbox
      if (!state.inbox[msg.id]) {
        state.inbox = { ...state.inbox, [msg.id]: msg }
      } else {
        console.warn(`Message with id ${msg.id} already exists in inbox.`)
      }
    }
  },
  deleteMsg(state, { msgId }) {
    const inbox = Object.values(state.inbox)

    if (msgId) {
      // Find the message in the inbox
      const messageIndex = inbox.findIndex((message) => message.id === msgId)
      if (messageIndex !== -1) {
        // Remove the message itself
        inbox.splice(messageIndex, 1)
        state.inbox = inbox
        return
      }

      // Check for the message ID inside the responses array of each message
      inbox.forEach((message) => {
        if (Array.isArray(message.responses)) {
          const responseIndex = message.responses.findIndex((response) => response.id === msgId)
          if (responseIndex !== -1) {
            message.responses.splice(responseIndex, 1)
          }
        }
      })

      // Update the state with the modified inbox
      state.inbox = inbox
    }
  },

  deleteSmartview(state, { smartviewId }) {
    const smartviewsArray = Object.values(state[models.smartviews]) // Convert object to array

    const index = smartviewsArray.findIndex((l) => l.id === smartviewId)
    if (index !== -1) {
      smartviewsArray.splice(index, 1) // Remove the smartview from the array
      state[models.smartviews] = smartviewsArray // Update the state with the modified array
    }
  },

  pushNewValueType(state, { value, tab }) {
    if (value && tab) {
      state.valueTypes[tab].push(value)
    }
  },

  updateValueType(state, { value, tab }) {
    if (value && tab) {
      // Find the index of the item to be updated
      const index = state.valueTypes[tab].findIndex((type) => type.id === value.id)

      if (index !== -1) {
        // Properly update the item using Vue.set to ensure reactivity
        state.valueTypes[tab][index] = { ...state.valueTypes[tab][index], ...value }
      } else {
        console.error(`No matching entry found for id ${value.id}`)
      }
    }
  },
  updateSortOrder(state, { value, tab }) {
    state.valueTypes[tab] = value
  },

  deleteValueType(state, { valueId, tab }) {
    if (valueId && tab) {
      // Find the index of the object with the matching id
      const index = state.valueTypes[tab].findIndex((type) => {
        return type.id === valueId
      })
      if (index !== -1) {
        // delete the existing object at the found index
        state.valueTypes[tab].splice(index, 1)
      } else {
        console.error(`No matching entry with id ${valueId} found in ${tab}`)
      }
    }
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
