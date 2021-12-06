const delayPromConstructor = (ms) => {
  return new Promise((resolve, reject) => setTimeout(() => resolve(), ms))
}

const formatAsUSCurrency = (s) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(s)
}

const formatAsILCurrency = (s) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'ILS'
  }).format(s)
}

const formatAsNumber = (s) => {
  return s.toLocaleString('en-US')
}

let uuid = 1
const getAppUniqueId = () => {
  const n = uuid
  uuid++
  return n
}

const downloadFile = (data, filename, mime, bom) => {
  const blobData = (typeof bom !== 'undefined') ? [bom, data] : [data]
  const blob = new Blob(blobData, { type: mime || 'application/octet-stream' })
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    // IE workaround for "HTML7007: One or more blob URLs were
    // revoked by closing the blob for which they were created.
    // These URLs will no longer resolve as the data backing
    // the URL has been freed."
    window.navigator.msSaveBlob(blob, filename)
  } else {
    const blobURL = (window.URL && window.URL.createObjectURL) ? window.URL.createObjectURL(blob) : window.webkitURL.createObjectURL(blob)
    const tempLink = document.createElement('a')
    tempLink.style.display = 'none'
    tempLink.href = blobURL
    tempLink.setAttribute('download', filename)
    // Safari thinks _blank anchor are pop ups. We only want to set _blank
    // target if the browser does not support the HTML5 download attribute.
    // This allows you to download files in desktop safari if pop up blocking
    // is enabled.
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank')
    }
    document.body.appendChild(tempLink)
    tempLink.click()
    // Fixes "webkit blob resource error 1"
    setTimeout(function () {
      document.body.removeChild(tempLink)
      window.URL.revokeObjectURL(blobURL)
    }, 200)
  }
}

const getOrdinalNum = (number) => {
  let selector
  if (number <= 0) {
    selector = 4
  } else if ((number > 3 && number < 21) || number % 10 > 3) {
    selector = 0
  } else {
    selector = number % 10
  }
  return number + ['th', 'st', 'nd', 'rd', ''][selector]
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

/**
 * Parse a localized number to a float.
 * @param {string} stringNumber - the localized number
 * @param {string} locale - [optional] the locale that the number is represented in. Omit this parameter to use the current locale.
 */
const parseLocaleNumber = (stringNumber, locale) => {
  const thousandSeparator = Intl.NumberFormat(locale).format(11111).replace(/\p{Number}/gu, '')
  const decimalSeparator = Intl.NumberFormat(locale).format(1.1).replace(/\p{Number}/gu, '')

  return parseFloat(stringNumber
    .replace(new RegExp('\\' + thousandSeparator, 'g'), '')
    .replace(new RegExp('\\' + decimalSeparator), '.')
  )
}

export {
  delayPromConstructor,
  getAppUniqueId,
  formatAsUSCurrency,
  formatAsILCurrency,
  formatAsNumber,
  downloadFile,
  getOrdinalNum,
  searchArrOfObjs,
  capitalizeFirstLetter,
  parseLocaleNumber
}
