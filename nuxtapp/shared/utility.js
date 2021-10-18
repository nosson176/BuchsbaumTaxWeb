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

export {
  delayPromConstructor,
  getAppUniqueId,
  formatAsUSCurrency,
  formatAsILCurrency,
  downloadFile,
  getOrdinalNum
}
