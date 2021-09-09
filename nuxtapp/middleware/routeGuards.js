import {
  ROUTE_LOGIN
} from '@/shared/constants'

const unguardedRoutesHash = {
  [ROUTE_LOGIN]: true
}

export default function ({ route, redirect, store }) {
  const isAuthenticated = false
  if (route.name) {
    if (!isAuthenticated) {
      if (!unguardedRoutesHash[route.name]) {
        redirect({ name: ROUTE_LOGIN })
      }
    }
  }
}
