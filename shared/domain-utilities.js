import { format, parseISO } from 'date-fns'
import { dateformat } from '~/shared/constants'

const isNameValid = (str) => {
  return str.length > 0
}
const isPasswordValid = (str) => {
  return str.length > 6
}

const formatDateForClient = (date) => format(parseISO(date), dateformat.client)

const userConstructor = () => {
  return {
    allowTexting: false,
    notifyOfLogins: false,
    secondsInDay: 0,
    selectable: false,
    sendLoginNotifications: false,
    userType: 'user',
    username: '',
    password: '',
    phoneNumber: '',
  }
}

export { isNameValid, isPasswordValid, formatDateForClient, userConstructor }
