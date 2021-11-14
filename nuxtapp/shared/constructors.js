import { NOTIFICATION_TYPE_ALERT } from '@/shared/constants'

const logConstructor = () => {
  return {
    clientId: '',
    years: '',
    alarmUserId: NaN,
    alert: false,
    alarmComplete: false,
    alarmDate: '',
    alarmTime: '',
    logDate: '',
    priority: NaN,
    note: '',
    secondsSpent: NaN,
    archived: false,
    alerted: false
  }
}

const notificationConstructor = () => {
  return {
    type: '',
    time: 0,
    message: ''
  }
}

const errorNotificationConstructor = () => {
  return {
    type: NOTIFICATION_TYPE_ALERT,
    time: 5000,
    message: 'Error occurred'
  }
}

export {
  logConstructor,
  notificationConstructor,
  errorNotificationConstructor
}
