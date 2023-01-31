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

const setAsValidNumber = (input) => {
  let newNumber = 0
  if (isNaN(input) || !input) {
    if (input.includes(',')) {
      newNumber = input.replace(',', '')
    }
  } else {
    newNumber = input
  }
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

const capitalizeFirstLetter = (string) => {
  const arr = string.split(' ')
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
  }
  return arr.join(' ')
}

export {
  formatAsUSCurrency,
  formatAsILCurrency,
  formatAsNumber,
  searchArrOfObjs,
  capitalizeFirstLetter,
  setAsValidNumber,
}
