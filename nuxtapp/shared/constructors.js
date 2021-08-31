import { NOTIFICATION_TYPE_ALERT } from '@/shared/constants'

const createAddressConstructor = () => {
  return {
    name: { input: '', isValid: true },
    address: { input: '', isValid: true },
    addressTwo: { input: '', isValid: true },
    city: { input: '', isValid: true },
    state: { input: '', isValid: true },
    postalCode: { input: '', isValid: true },
    country: { input: '', isValid: true },
    phone: { input: '', isValid: true }
  }
}

const createParcelItemConstructor = () => {
  return {
    description: { input: '', isValid: true },
    value: { input: '', isValid: true },
    quantity: { input: '', isValid: true },
    weight: { input: '', isValid: true }
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

const storeInfoConstructor = () => {
  return {
    index: NaN,
    text: ''
  }
}

export { createAddressConstructor, notificationConstructor, errorNotificationConstructor, createParcelItemConstructor, storeInfoConstructor }
