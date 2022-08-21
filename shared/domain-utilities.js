import { format, formatISO, parse, parseISO } from 'date-fns'
import { dateformat } from '~/shared/constants'

const isNameValid = (str) => {
  return str.length > 0
}
const isPasswordValid = (str) => {
  return str.length > 6
}
const isEmailValid = (str) => {
  return /\S+@\S+\.\S+/.test(str)
}
const isConfirmPasswordValid = (str1, str2) => {
  return str1 === str2
}
const isPhoneValid = (str) => {
  return str.length > 0
}
const isAddressNameValid = (str) => {
  return str.length > 0
}
const isAddressAddressValid = (str) => {
  return str.length > 0
}
const isAddressCityValid = (str) => {
  return str.length > 0
}
const isAddressStateValid = (str) => {
  return str.length > 0
}
const isAddressPostalCodeValid = (str) => {
  return str.length > 0
}
const isAddressCountryValid = (str) => {
  return str.length > 0
}
const isAddressPhoneValid = (str) => {
  return isPhoneValid(str)
}
const isFieldEmpty = (str) => {
  return str.length === 0
}

const isAddressFormValid = (addressFormModel) => {
  return (
    isAddressPhoneValid(addressFormModel.phone.input) &&
    isAddressAddressValid(addressFormModel.address.input) &&
    isAddressCityValid(addressFormModel.city.input) &&
    isAddressPostalCodeValid(addressFormModel.postalCode.input) &&
    isAddressCountryValid(addressFormModel.country.input) &&
    isAddressNameValid(addressFormModel.name.input)
  )
}

const isNotificationValid = (notification) => {
  return notification.time > 0 && notification.type !== '' && notification.message !== ''
}

const formatDateForClient = (date) => format(parseISO(date), dateformat.client)
const formatDateForServer = (date) => formatISO(parse(date, dateformat.client, new Date()))

const userConstructor = () => {
  return {
    allowTexting: false,
    notifyOfLogins: false,
    secondsInDay: 0,
    selectable: false,
    sendLoginNotifications: false,
    userType: 'user',
    username: 'NEWUSER',
  }
}

export {
  isNameValid,
  isEmailValid,
  isPasswordValid,
  isConfirmPasswordValid,
  isAddressNameValid,
  isAddressPhoneValid,
  isAddressCityValid,
  isAddressStateValid,
  isAddressPostalCodeValid,
  isAddressCountryValid,
  isAddressAddressValid,
  isAddressFormValid,
  isNotificationValid,
  isFieldEmpty,
  formatDateForClient,
  formatDateForServer,
  userConstructor,
}
