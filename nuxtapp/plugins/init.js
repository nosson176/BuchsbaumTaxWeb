import { getCookieByKey } from '@/shared/cookie-utilities'
import { models, mutations, COOKIE_KEY_SESSION_TOKEN } from '@/shared/constants'

function extend (app, mixin) {
  if (!app.mixins) {
    app.mixins = []
  }
  app.mixins.push(mixin)
}

function loadTokenFromCookie (store) {
  const token = getCookieByKey(COOKIE_KEY_SESSION_TOKEN)
  if (token) {
    store.commit(mutations.setModelResponse, { model: models.token, data: token })
  }
}

export default function ({ app, store }) {
  extend(app, {
    created () {
      loadTokenFromCookie(store)
    }
  })
}
