import cookies from 'js-cookie'

const getCookieByKey = (key) => {
  const v = cookies.get(key)
  return v || ''
}
const setCookieByKey = (key, value, options) => {
  const v = cookies.set(key, value, options)
  return v || ''
}

const removeCookieByKey = (key) => {
  cookies.remove(key)
}

export { getCookieByKey, setCookieByKey, removeCookieByKey }
