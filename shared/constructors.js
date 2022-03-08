import { notification } from '@/shared/constants'

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
    alerted: false,
  }
}

const notificationConstructor = () => {
  return {
    type: '',
    time: 0,
    message: '',
  }
}

const errorNotificationConstructor = () => {
  return {
    type: notification.alert,
    time: 5000,
    message: 'Error occurred',
  }
}

const valueTypeValueConstructor = () => {
  return {
    key: '',
    sortOrder: 0,
    value: 'TEST',
    show: true,
    include: true,
  }
}

const valueTypeValueWithParentConstructor = () => {
  return {
    key: '',
    sortOrder: 0,
    value: 'TEST',
    show: true,
    include: true,
    parentId: 0,
  }
}

export {
  logConstructor,
  notificationConstructor,
  errorNotificationConstructor,
  valueTypeValueConstructor,
  valueTypeValueWithParentConstructor,
}
