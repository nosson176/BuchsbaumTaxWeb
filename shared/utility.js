import { format, parseISO } from 'date-fns'
import moment from 'moment-timezone'

const formatAsUSCurrency = (s) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(s)
}

const formatAsILCurrency = (s) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'ILS',
    maximumFractionDigits: 0,
  }).format(s)
}

const formatAsNumber = (s) => {
  return s.toLocaleString('en-US')
}

// const setAsValidNumber = (input) => {
//   console.log(input)
//   let newNumber = 0
//   if (isNaN(input) || !input) {
//     if (input.includes(',')) {
//       newNumber = input.replace(',', '')
//     }
//   } else {
//     newNumber = input
//   }
//   return newNumber
// }
const setAsValidNumber = (input) => {
  console.log('Input:', input)

  let newNumber = 0

  // Check if input is not a valid number
  if (typeof input === 'string' && isNaN(input)) {
    // Handle string inputs, especially if they contain a comma
    if (input.includes(',')) {
      newNumber = input.replace(',', '') // Remove commas from the string
    }
  } else if (!isNaN(input)) {
    // If input is already a valid number, return it
    newNumber = input
  }

  console.log('Converted number:', newNumber)
  return newNumber
}

const searchArrOfObjs = (arr, searchKey) => {
  if (!arr) {
    return []
  }
  if (!searchKey) {
    return arr
  }
  return arr.filter(function (obj) {
    return Object.keys(obj).some(function (key) {
      if (typeof obj[key] === 'string') {
        return obj[key].toLowerCase().includes(searchKey.toLowerCase())
      }
      return false
    })
  })
}
const boldSearchWord = (arr, searchKey) => {
  if (!arr) {
    return []
  }
  if (!searchKey) {
    return arr
  }

  // Create a regular expression to find the searchKey
  const regex = new RegExp(`(${searchKey})`, 'gi')

  return arr.map((el) => {
    // Check if el.note contains the searchKey
    if (el.note && regex.test(el.note)) {
      // Bold the searchKey in el.note
      return {
        ...el,
        note: el.note.replace(regex, "<span class='text-black font-extrabold'>$1</span>"),
      }
    }
    return el
  })
}

const formatToHHmm = (dateStrings) => {
  const date = parseISO(dateStrings)
  return format(date, 'HH:mm')
}

const formatDate = (dateString) => {
  // console.log(dateString)
  const date = parseISO(dateString)
  // console.log(date)
  return format(date, 'dd/MM/yyyy')
}

const convertToISOString = (workTime) => {
  // Combine date and time, and create a Date object in UTC
  workTime.startTime = `${workTime.date}T${workTime.startTime}:00Z`
  workTime.endTime = `${workTime.date}T${workTime.endTime}:00Z`
  workTime.sumHoursWork = 0
  // Create a new Date object from the combined datetime string
  workTime.startTime = new Date(workTime.startTime)
  workTime.startTime.toISOString()
  workTime.endTime = new Date(workTime.endTime)
  workTime.endTime.toISOString()

  return workTime
}

const capitalizeFirstLetter = (string) => {
  const arr = string.split(' ')
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
  }
  return arr.join(' ')
}

const promptConfirm = () => {
  let result = prompt('bagin work? (yes/no)')
  if (result === null) return // User canceled the prompt
  result = result.toLowerCase()
  while (result !== 'yes' && result !== 'no') {
    alert('Please use just yes or no')
    result = prompt('bagin work? (yes/no)')
    if (result === null) return // User canceled the prompt during the loop
    result = result.toLowerCase()
  }
  return result
}

const generateRandomId = (min = 160700, max = 999999) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const formatUnixTimestampWithMoment = (unixTimeMillis) => {
  if (unixTimeMillis === null) return
  return moment(unixTimeMillis).tz('Asia/Jerusalem').format('YYYY-MM-DD') // No timezone offset
}

const formatUnixTimestampFee = (unixTimeMillis) => {
  return moment(unixTimeMillis).tz('Asia/Jerusalem').format('YYYY-MM-DD') // No timezone offset
}

const formatUnixTimestamp = (timestamp) => {
  // console.log(timestamp)
  // Check if the timestamp is already in the 'YYYY-MM-DD' format
  const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/

  // Check if the timestamp is in the 'YYYY-MM-DD HH:mm:ss' format
  const dateTimeFormatRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/

  // Check if the timestamp is in the 'DD-MM-YYYY HH:mm' format
  const customDateTimeFormatRegex = /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/

  if (typeof timestamp === 'string') {
    if (dateFormatRegex.test(timestamp)) {
      // Return the timestamp in DD/MM/YYYY format
      const [year, month, day] = timestamp.split('-')
      return `${day}/${month}/${year}`
    }

    if (dateTimeFormatRegex.test(timestamp)) {
      // Return the timestamp in DD/MM/YYYY HH:mm format
      const [datePart, timePart] = timestamp.split(' ')

      // Extract day, month, year from datePart
      const [year, month, day] = datePart.split('-')

      // Extract hour and minutes from timePart
      const [hour, minutes] = timePart.split(':')

      return `${day}/${month}/${year} ${hour}:${minutes}`
    }

    if (customDateTimeFormatRegex.test(timestamp)) {
      // If the timestamp is in the 'DD-MM-YYYY HH:mm' format, convert '-' to '/' and return
      const [datePart, timePart] = timestamp.split(' ')
      const [day, month, year] = datePart.split('-')
      return `${day}/${month}/${year} ${timePart}`
    }

    // Convert string timestamp to number if it's not in the above formats
    timestamp = Number(timestamp)
  }

  // Ensure the timestamp is a valid number
  if (isNaN(timestamp) || timestamp <= 0) {
    console.error('Timestamp is not a valid number:', typeof timestamp, timestamp)
    return
  }

  // Create Date object from the timestamp
  const date = new Date(timestamp)
  if (isNaN(date.getTime())) {
    console.error('Date is invalid for timestamp:', typeof timestamp, timestamp)
    return
  }

  // Format the date as DD/MM/YYYY
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

export {
  formatAsUSCurrency,
  formatAsILCurrency,
  formatAsNumber,
  formatToHHmm,
  formatDate,
  searchArrOfObjs,
  capitalizeFirstLetter,
  setAsValidNumber,
  boldSearchWord,
  convertToISOString,
  promptConfirm,
  generateRandomId,
  formatUnixTimestamp,
  formatUnixTimestampFee,
  formatUnixTimestampWithMoment,
}
