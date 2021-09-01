import {
  ROUTE_LOGIN,
  GET_DOES_USER_HAVE_SESSION
} from '@/shared/constants'

const unguardedRoutesHash = {
  [ROUTE_LOGIN]: true
}

export default function ({ route, redirect, store }) {
  const isAuthenticated = store.getters[GET_DOES_USER_HAVE_SESSION]
  if (!isAuthenticated) {
    if (!unguardedRoutesHash[route.name]) {
      redirect({ name: ROUTE_LOGIN })
    }
  }
}
