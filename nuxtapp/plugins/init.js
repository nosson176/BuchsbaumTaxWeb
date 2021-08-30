import {
  A_AFTER_EACH_ROUTE,
  APP_CLIENT_SIDE_INIT
} from '@/shared/constants'

function extend (app, mixin) {
  if (!app.mixins) {
    app.mixins = []
  }
  app.mixins.push(mixin)
}

export default function ({ app, store }) {
  app.router.afterEach((to, from) => {
    store.dispatch(A_AFTER_EACH_ROUTE, { to, from })
  })
  extend(app, {
    created () {
      store.dispatch(APP_CLIENT_SIDE_INIT)
    }
  })
}
