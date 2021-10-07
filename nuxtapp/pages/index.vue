<template>
  <div class="min-h-screen">
    <Home />
  </div>
</template>

<script>
import { error, routes } from '~/shared/constants'

export default {
  name: 'IndexPage',
  created () {
    const headers = this.$api.getHttpConfig()
    this.$api.getClientList(headers)
      .then()
      .catch((e) => {
        if (e.message === error.axios_401) {
          this.$api.signout()
          this.$router.replace(routes.login)
        }
      })
  }
}
</script>
