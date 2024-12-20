import { getCookieByKey, setCookieByKey } from '~/shared/cookie-utilities'
import { COOKIE_KEY_SESSION_TOKEN, models, mutations, routes } from '~/shared/constants'

export default ({ $axios, store, $toast, redirect }, inject) => {
  const getHeaders = () => {
    const headers = {}
    const token = getCookieByKey(COOKIE_KEY_SESSION_TOKEN)
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    return headers
  }

  const login = (data) =>
    $axios
      .post('/sessions', data, { loading: models.token, store: models.token })
      .catch(() => $toast.error('Invalid email or password'))

  const signout = () => {
    const token = ''
    setCookieByKey(COOKIE_KEY_SESSION_TOKEN, token, { expires: 365 })
    store.commit(mutations.setModelResponse, {
      model: models.token,
      data: { token },
    })
    redirect({ name: routes.login })
  }

  // GET
  const getCurrentUser = (headers) => {
    $axios
      .get('users/current', {
        headers,
        loading: models.currentUser,
        store: models.currentUser,
      })
      .catch(() => $toast.error('Error loading value types'))
  }

  const getClientList = (headers) => {
    const searchParam = store.state.clientSearchValue
    const searchOption = store.state.clientSearchOption
    const active = store.state.dotStatus
    console.log(active)
    let endpoint = 'clients/'
    const queryParams = []

    // Add search parameters
    if (searchParam.length > 0 && searchOption.length > 0) {
      queryParams.push(`q=${searchParam}`, `field=${searchOption}`)
    } else if (searchParam.length > 0) {
      queryParams.push(`q=${searchParam}`)
    }

    // Add active status if `dotStatus` is false
    queryParams.push(`active=${active}`)

    // Append query parameters to the endpoint
    if (queryParams.length > 0) {
      endpoint += `?${queryParams.join('&')}`
    }

    return $axios
      .get(endpoint, {
        headers,
        loading: models.clients,
        loaded: models.clients,
        store: models.clients,
      })
      .then((res) => {
        console.log(JSON.parse(JSON.stringify(res)))
      })
      .catch((e) => {
        $toast.error('Error loading clients')
      })
  }

  const getClientData = (headers, id) =>
    $axios
      .get(`/clients/${id}/data`, {
        headers,
        loading: models.selectedClient,
        loaded: models.selectedClient,
        store: models.selectedClient,
      })
      .then((res) => {
        console.log(JSON.parse(JSON.stringify(res)))
        getClientsHistory(headers)
      })
      .catch(() => $toast.error('Error loading client data'))

  const getClientsWithLogs = (headers, clientId) => {
    // Construct URL based on whether clientId is provided
    const url = '/clients/clientsAndlogs' + (clientId ? `?clientId=${clientId}` : '')

    return $axios
      .get(url, {
        headers,
        loading: models.ClientAndLogs,
        loaded: models.ClientAndLogs,
        store: models.ClientAndLogs,
      })
      .then((response) => {
        // Check if response.data is an object
        if (typeof response === 'object' && response !== null) {
          // Convert object to array
          const clientsArray = Object.values(response)
          return clientsArray
        } else {
          throw new Error('Response data is not an object')
        }
      })
      .catch((error) => {
        console.error('Error fetching clients with logs:', error)
        throw error // Re-throw error to handle it in the component
      })
  }

  const getTodayLogs = (headers) =>
    $axios
      .get('logs/today', {
        headers,
        loading: models.dayLogs,
        loaded: models.dayLogs,
        store: models.dayLogs,
      })
      .then((res) => {
        // console.log(Object.values(res))
      })
      .catch(() => $toast.error('Error loading value types'))

  const getValueTypes = (headers) =>
    $axios
      .get('values', {
        headers,
        loading: models.valueTypes,
        loaded: models.valueTypes,
        store: models.valueTypes,
      })
      .catch(() => $toast.error('Error loading value types'))

  const getValueTaxGroups = (headers) =>
    $axios
      .get('values/tax-groups', {
        headers,
        loading: models.valueTaxGroups,
        loaded: models.valueTaxGroups,
        store: models.valueTaxGroups,
      })
      .catch(() => $toast.error('Error loading value tax groups'))

  const getAllUsers = (headers) =>
    $axios
      .get('/users', { headers, loading: models.users, loaded: models.users, store: models.users })
      .catch(() => $toast.error('Error loading all users'))

  const getClientsHistory = (headers) =>
    $axios
      .get('/clients/history', {
        headers,
        loading: models.clientsHistory,
        loaded: models.clientsHistory,
        store: models.clientsHistory,
      })
      .catch(() => $toast.error('Error loading clients history'))

  const getSmartviews = (headers) =>
    $axios
      .get('/smartviews', {
        headers,
        loading: models.smartviews,
        loaded: models.smartviews,
        store: models.smartviews,
      })
      .then((res) => {
        console.log(res)
      })
      .catch(() => $toast.error('Error loading smartviews'))

  const getInbox = (headers) =>
    $axios
      .get('/users/current/messages', {
        headers,
        loading: models.inbox,
        loaded: models.inbox,
        store: models.inbox,
      })
      .catch(() => $toast.error('Error loading messages'))

  const getTimeWorks = (headers) =>
    $axios
      .get(`/worktimes`, {
        headers,
        loading: models.worktimes,
        loaded: models.worktimes,
        store: models.worktimes,
      })
      .catch(() => $toast.error('Error loading messages'))

  const getAllTimeWorksByDate = (headers, startRange, endRange) =>
    $axios
      .get(`/worktimes/date-range`, {
        headers,
        params: { startRange, endRange },
        loading: models.worktimes,
        loaded: models.worktimes,
        store: models.worktimes,
      })
      .catch(() => $toast.error('Error loading messages'))

  const getTimeWorksByUserId = (headers, userId) =>
    $axios
      .get(`/worktimes/user/${userId}`, {
        headers,
        loading: models.worktimes,
        loaded: models.worktimes,
        store: models.worktimes,
      })
      .catch(() => $toast.error('Error loading messages'))

  const getTimeWorksByMonthAndUserId = (headers, userId, startDate, endDate) => {
    return $axios
      .get(`/worktimes/user/${userId}/date-range`, {
        headers,
        params: { startDate, endDate },
        loading: models.worktimes,
        loaded: models.worktimes,
        store: models.worktimes,
      })
      .catch(() => $toast.error('Error loading messages'))
  }

  const getClientsToExport = (headers, clientsArray) => {
    return $axios
      .post(`/clients/exportClients`, clientsArray, { headers })
      .catch(() => $toast.error('Error fetch Clients to export'))
  }

  // CREATE
  const createLog = (headers, { log }) =>
    $axios.post('/logs', log, { headers }).catch(() => $toast.error('Error creating log'))

  const createTaxPersonal = (headers, { personal }) =>
    $axios.post('/personals', personal, { headers }).catch(() => $toast.error('Error creating tax personal'))

  const createContact = (headers, { contact }) =>
    $axios.post('/contacts', contact, { headers }).catch(() => $toast.error('Error creating contact'))

  const createIncome = (headers, { income }) =>
    $axios.post('/incomes', income, { headers }).catch(() => $toast.error('Error creating income'))

  const createFbar = (headers, { fbar }) =>
    $axios.post('/fbars', fbar, { headers }).catch(() => $toast.error('Error creating fbar'))

  const createFee = (headers, { fee }) =>
    $axios.post('/fees', fee, { headers }).catch(() => $toast.error('Error creating fee'))

  const createTaxYear = (headers, { taxYear }) =>
    $axios.post('/tax-years', taxYear, { headers }).catch(() => $toast.error('Error creating tax year'))

  const createFiling = (headers, { filing }) =>
    $axios.post('/filings', filing, { headers }).catch(() => $toast.error('Error creating filing'))

  const createChecklist = (headers, { checklist }) =>
    $axios.post('/checklists', checklist, { headers }).catch(() => $toast.error('Error creating checklist'))

  const createClient = (headers, { client }) =>
    $axios.post('/clients', client, { headers }).catch(() => $toast.error('Error creating client'))

  const createSmartview = async (headers, { smartview }, sendToUserId) => {
    try {
      const url = sendToUserId ? `/smartviews?clientId=${sendToUserId}` : `/smartviews`
      // console.log('Creating Smartview:', smartview)
      const response = await $axios.post(url, smartview, { headers })
      // You might want to log or use the response data here
      // console.log('Smartview created successfully:', response)
      return response // return the created smartview or relevant data
    } catch (error) {
      console.error('Error creating smartview:', error)
      $toast.error('Error creating smartview')
    } finally {
      // This ensures that you fetch the updated list of smartviews regardless of success or failure
      // await getSmartviews(headers)
    }
  }

  const getFilterClients = async (headers, { smartview }) => {
    try {
      const response = await $axios.post('/smartviews/getFilterClients', smartview, {
        headers,
        loading: models.clients,
        loaded: models.clients,
        store: models.clients,
      })

      return Object.values(response) // return the created smartview or relevant data
    } catch (error) {
      console.error('Error creating smartview:', error)
      $toast.error('Error creating smartview')
    }
  }

  const createUser = (headers, { user }) =>
    $axios.post('/users', user, { headers }).catch(() => $toast.error('Error creating user'))

  const forgotPassword = async (email) => {
    try {
      const response = await $axios.post('/sessions/forgot-password', { email })
      console.log(response)
      return response
    } catch (error) {
      console.log(error)
      console.error('Forgot password error:', error.response)
      throw error
    }
  }

  const resetPassword = async (token, password) => {
    try {
      const response = await $axios.post('/sessions/reset-password', {
        token,
        password,
      })
      console.log(response)
      return response
    } catch (error) {
      console.log(error)
      console.error('Forgot password error:', error.response)
      throw error
    }
  }

  const createWorkTime = (headers, userId, username, date) => {
    const workTimeData = {
      userId,
      username,
      date,
    }

    $axios
      .post('/worktimes', workTimeData, { headers })
      .then(() => {
        $toast.success('Work time created successfully')
      })
      .catch((error) => {
        // Handle error
        console.error('Error creating work time:', error)
        $toast.error('Error creating work time')
      })
  }
  const clockOutWorkTime = (headers, userId, date) => {
    const workTimeData = {
      userId,
      date,
    }
    $axios
      .post(`/worktimes/clockout`, workTimeData, { headers })
      .then(() => {
        // Handle success
        $toast.success('Clock out successful')
      })
      .catch((error) => {
        // Handle error
        console.error('Error clocking out:', error)
        $toast.error('Error clocking out')
      })
  }

  const createValueType = (headers, { value }) =>
    $axios.post('/values', value, { headers }).then(() => getValueTypes(headers))

  const sendSms = (headers, { sms }) =>
    $axios.post('/sms/send', sms, { headers }).catch(() => $toast.error('Error sending SMS'))

  const sendMessage = (headers, { messageObj }) =>
    $axios
      .post('/users/current/messages', messageObj, { headers })
      .catch(() => $toast.error('Error sending message'))
      .finally(() => getInbox(headers))

  // UPDATE
  const updateClient = (headers, { clientId, client }) => {
    $axios.put(`/clients/${clientId}`, client, { headers }).catch(() => $toast.error('Error updating client'))
  }

  const updateClientFlag = (headers, { clientId, clientFlag }) =>
    $axios
      .put('/users/current/client-flags', clientFlag, { headers })
      .catch(() => $toast.error('Error updating client flag'))

  const updateLog = (headers, { clientId, logId }, log) => {
    return $axios.put(`/logs/${logId}`, log, { headers }).catch(() => $toast.error('Error updating log'))
  }

  const updateLogs = (headers, logs) => {
    $axios
      .put('/logs/', logs, { headers }) // Correctly pass headers as an object
      .catch(() => $toast.error('Error updating log'))
  }

  const updateTaxPersonal = (headers, { clientId, personalId }, personal) =>
    $axios
      .put(`/personals/${personalId}`, personal, { headers })
      .catch(() => $toast.error('Error updating tax personal'))

  const updateTaxPersonals = (headers, personal) =>
    $axios.put(`/personals`, personal, { headers }).catch(() => $toast.error('Error updating tax personal'))

  const updateContact = async (headers, { clientId, contactId = '' }, contact) => {
    try {
      await $axios.put(`/contacts/${contactId}`, contact, { headers })
    } catch (error) {
      console.error('Error updating contact:', error)
      $toast.error('Error updating contact')
    }
  }

  const updateContacts = async (headers, contacts) => {
    try {
      await $axios.put(`/contacts`, contacts, { headers }).then((res) => console.log(res))
    } catch (error) {
      console.error('Error updating contact:', error)
      $toast.error('Error updating contact')
    }
  }

  const updateIncome = (headers, { clientId, incomeId = '' }, income) => {
    const endpoint = incomeId ? `/incomes/${incomeId}` : '/incomes'
    return $axios.put(endpoint, income, { headers }).catch(() => $toast.error('Error updating income'))
  }

  const updateIncomes = (headers, incomes) => {
    return $axios
      .put(`/incomes`, incomes, { headers })
      .then((res) => {})
      .catch(() => $toast.error('Error updating income'))
  }

  const updateFbar = (headers, { clientId, fbarId = '' }, fbar) => {
    const endpoint = fbarId ? `/fbars/${fbarId}` : '/fbars'
    return $axios.put(endpoint, fbar, { headers }).catch(() => $toast.error('Error updating fbar'))
  }
  const updateFbars = (headers, fbars) => {
    return $axios.put(`/fbars`, fbars, { headers }).catch(() => $toast.error('Error updating fbar'))
  }

  const updateFee = (headers, { clientId, feeId }, fee) =>
    $axios.put(`/fees/${feeId}`, fee, { headers }).catch(() => $toast.error('Error updating fee'))

  const updateFees = (headers, fee) =>
    $axios.put(`/fees`, fee, { headers }).catch(() => $toast.error('Error updating fee'))

  const updateFiling = (headers, { clientId, filingId }, filing) =>
    $axios.put(`/filings/${filingId}`, filing, { headers }).catch(() => $toast.error('Error updating filing'))

  const updateFilings = (headers, filing) => {
    $axios
      .put(`/filings/updateFilings`, { updates: filing }, { headers })
      .catch(() => $toast.error('Error updating filing'))
  }

  const updateFilingDelivary = (headers, { clientId, oldContectDelivary, newContectDelivary }) =>
    $axios
      .put(
        '/filings/updateFiling',
        {
          clientId,
          oldContectDelivary,
          newContectDelivary,
        },
        { headers }
      )
      .catch(() => $toast.error('Error updating filing'))

  const updateTaxYear = (headers, { clientId, taxYearId }, taxYear) =>
    $axios.put(`/tax-years/${taxYearId}`, taxYear, { headers }).catch(() => $toast.error('Error updating tax year'))

  const updateChecklist = (headers, { clientId, checklistId }, checklist) =>
    $axios
      .put(`/checklists/${checklistId}`, checklist, { headers })
      .catch(() => $toast.error('Error updating checklist'))

  const updateChecklists = (headers, checklist) =>
    $axios.put(`/checklists`, checklist, { headers }).catch(() => $toast.error('Error updating checklist'))

  const updateSmartview = (headers, { smartviewId }, smartview, returnData = false) => {
    const url = returnData ? `/smartviews/${smartviewId}?returnData=true` : `/smartviews/${smartviewId}`

    return $axios
      .put(url, smartview, { headers })
      .then((res) => {
        console.log(res.right)
        return returnData ? res.right : true
      })
      .catch((error) => {
        $toast.error('Error updating smartview')
        throw error
      })
  }

  const updateSmartviewsBatch = (headers, smartview) => {
    console.log('API CALL => ', smartview)
    $axios.put(`/smartviews/batchUpdate`, smartview, { headers }).catch(() => $toast.error('Error updating smartview'))
  }

  const updateValueType = (headers, { valueId }, value) =>
    $axios
      .put(`/values/${valueId}`, value, { headers })
      .catch(() => $toast.error('Error updating value type'))
      .finally(() => getValueTypes(headers))

  const updateUser = (headers, { userId }, user) =>
    $axios
      .put(`/users/${userId}`, user, { headers })
      .catch((e) => $toast.error('Error updating user: ' + e.response.data.message))
  // .finally(() => getAllUsers(headers))

  const updatePassword = (headers, { userId }, newPassword) =>
    $axios
      .put(`/users/${userId}/password`, newPassword, { headers })
      .catch((e) => $toast.error('Error updating password ' + e.response.data.message))

  const updateMessage = (headers, { messageId }, value) =>
    $axios
      .put(`/users/current/messages/${messageId}`, value, { headers })
      .catch(() => $toast.error('Error updating message'))
      .finally(() => getInbox(headers))

  const updateWorkTimeByWorkTimeId = (headers, workTime, currentUser) => {
    // Add userType to the workTime object or include it in a separate payload object
    const payload = { ...workTime, userType: currentUser.userType }

    return $axios
      .put(`/worktimes/${workTime.id}`, payload, { headers })
      .then($toast.success('Work time update successful'))
      .catch(() => $toast.error('Error updating workTime'))
  }

  // DELETE
  const deleteValueType = (headers, { valueId }) =>
    $axios
      .delete(`/values/${valueId}`, { headers })
      .catch(() => $toast.error('Error deleting value'))
      .finally(() => getValueTypes(headers))

  const deleteClient = (headers, { clientId }) =>
    $axios
      .delete(`/clients/${clientId}`, { headers })
      .catch(() => $toast.error('Error deleting client'))
      .finally(() => getClientList(headers))

  const deleteSmartview = (headers, { smartviewId }) =>
    $axios
      .delete(`/smartviews/${smartviewId}`, { headers })
      .catch(() => $toast.error('Error deleting smartview'))
      .finally(() => getSmartviews(headers))

  const deleteFiling = (headers, { filingId, clientId }) =>
    $axios.delete(`/filings/${filingId}`, { headers }).catch(() => $toast.error('Error deleting filing'))

  const deleteUser = (headers, { userId }) =>
    $axios
      .delete(`/users/${userId}`, { headers })
      .then((res) => {
        return res
      })
      .catch(() => $toast.error('Error deleting user'))

  const deleteMessage = (headers, { messageId }) =>
    $axios
      .delete(`/users/current/messages/${messageId}`, { headers })
      .catch(() => $toast.error('Error deleting message'))
      .finally(() => getInbox(headers))

  const api = {
    createChecklist,
    createClient,
    createContact,
    createFbar,
    createFee,
    createFiling,
    createIncome,
    createLog,
    createValueType,
    createSmartview,
    createTaxPersonal,
    createTaxYear,
    createUser,
    createWorkTime,
    clockOutWorkTime,
    deleteValueType,
    deleteClient,
    deleteSmartview,
    deleteFiling,
    deleteUser,
    getAllUsers,
    getClientData,
    getClientList,
    getClientsHistory,
    getHeaders,
    getSmartviews,
    getFilterClients,
    getValueTaxGroups,
    getValueTypes,
    getCurrentUser,
    getInbox,
    getTimeWorksByUserId,
    getTimeWorks,
    getTimeWorksByMonthAndUserId,
    getAllTimeWorksByDate,
    getClientsWithLogs,
    getTodayLogs,
    getClientsToExport,
    login,
    signout,
    sendSms,
    sendMessage,
    updateChecklist,
    updateChecklists,
    updateClient,
    updateClientFlag,
    updateContact,
    updateContacts,
    updateFbar,
    updateFbars,
    updateFee,
    updateFees,
    updateFiling,
    updateFilings,
    updateFilingDelivary,
    updateIncome,
    updateIncomes,
    updateLog,
    updateLogs,
    updateSmartview,
    updateSmartviewsBatch,
    updateTaxPersonal,
    updateTaxPersonals,
    updateTaxYear,
    updateValueType,
    updateUser,
    updatePassword,
    updateMessage,
    updateWorkTimeByWorkTimeId,
    deleteMessage,
    forgotPassword,
    resetPassword,
  }

  // Inject to context as $api
  inject('api', api)
}
