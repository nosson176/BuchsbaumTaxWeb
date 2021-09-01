<template>
  <div />
</template>

<script>
import { ROUTE_HOME } from '~/shared/constants'
export default {
  name: 'IndexPage',
  middleware ({ redirect }) {
    return redirect({ name: ROUTE_HOME })
  }
}
</script>
