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
    secondsNeededToDisplayModal1:600,
    copyLogs:[],
    clientAndLogs: [] ,
    filingsUpdate:[]
  }
}

const getters = {
  [models.appWidth]: (state) => state[models.appWidth],
  [models.secondsSpentOnClient]: (state) => state[models.secondsSpentOnClient],
  [models.selectedClient]: (state) => state[models.selectedClient],
  [models.promptOnClientChange]: (state) => state[models.promptOnClientChange],
  clientAndLogs: state => state.clientAndLogs
}


const mutations = {
  // Set data from API responses. `model` is 'lists', 'campaigns' etc.
  setModelResponse(state, { model, data }) {
    if (model === models.clientAndLogs) {
      state.clientAndLogs = data;
      return
    }
    state[model] = data
  },
  setCopyLogs(state, log) {
    state.copyLogs.push(log); // Push the new log into the array
  },
  updateCopyLogs(state, { clientId, logDate,id }) {
    state.copyLogs = state.copyLogs.map(log => {
      return { ...log, clientId, logDate,id };
    });
  },
    clearCopyLogs(state) {
      state.copyLogs = [];
    },

  pushNewLog(state,log) {
    state[models.selectedClient].logs.unshift(log.log)
  } ,
  
  updateLog(state, { log }) {
    const index = state[models.selectedClient].logs.findIndex(l => l.id === log.id);
    if (index !== -1) {
      state[models.selectedClient].logs.splice(index, 1, log);
    }
  },

  pushFilingUpdate(state,filing) {
    state.filingsUpdate.push(filing)
  } ,
  updateFilingUpdate(state,filing) {
    const index = state.filingsUpdate.findIndex(f => f.id === filing.filing.id);
if (index !== -1) {
  state.filingsUpdate.splice(index, 1, filing.filing);
  return state.filingsUpdate; // Or, if you want to return the updated array, you can return `state.filingsUpdate`
}
    state.filingsUpdate.push(filing)
  } ,
  clearFilingUpdate(state) {
    state.FilingUpdate = [];
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
    commit('updateLog', { log });
    // If you want to update the server as well, you can do it here
    // return this.$api.updateLog(this.headers, { clientId: state[models.selectedClient].id, logId: log.id }, log);
  },
  
  updateFilingAction({ commit, state }, { filing }) {
    commit('updateFilingUpdate', { filing });
  }
}

export { namespaced, state, getters, mutations, actions }
