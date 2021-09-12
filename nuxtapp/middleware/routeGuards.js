import { models, routes } from '~/shared/constants'

const unguardedRoutesHash = {
  [routes.login]: true
}

export default function ({ route, redirect, store }) {
  const isAuthenticated = Object.entries(store.state[models.token]).length > 0
  if (route.name) {
    if (!isAuthenticated) {
      if (!unguardedRoutesHash[route.name]) {
        redirect({ name: routes.login })
      }
    }
  }
}
