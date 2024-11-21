import { models, routes } from '~/shared/constants'

const guardedRoutes = new Set([routes.root, routes.values])

export default function ({ route, redirect, store }) {
  console.log(1)
  const isAuthenticated = Object.keys(store.state[models.token]).length > 0
  console.log(2)
  if (route.name) {
    console.log(3)
    if (!isAuthenticated) {
      console.log(4)
      if (guardedRoutes.has(route.name)) {
        console.log(5)
        redirect({ name: routes.login })
      }
    }
    console.log(6)
  }
}
