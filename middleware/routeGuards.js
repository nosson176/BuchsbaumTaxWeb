import { models, routes } from '~/shared/constants'

const guardedRoutes = new Set([routes.root, routes.values])

export default function ({ route, redirect, store }) {
  const isAuthenticated = Object.keys(store.state[models.token]).length > 0
  if (route.name) {
    if (!isAuthenticated) {
      if (guardedRoutes.has(route.name)) {
        redirect({ name: routes.login })
      }
    }
  }
}
