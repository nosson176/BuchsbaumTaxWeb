import { models, mutations, COOKIE_KEY_SESSION_TOKEN } from '@/shared/constants'
import { getCookieByKey } from '@/shared/cookie-utilities'

function extend (app, mixin) {
  if (!app.mixins) {
    app.mixins = []
  }
  app.mixins.push(mixin)
}

export default function ({ app, store }) {
  extend(app, {
    created () {
      const token = getCookieByKey(COOKIE_KEY_SESSION_TOKEN)
      if (token) {
        store.commit(mutations.setModelResponse, { model: models.token, data: { token } })
      }
    }
  })
}
