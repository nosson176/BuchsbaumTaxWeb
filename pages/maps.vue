<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <MapsDashboard />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { models } from '~/shared/constants'

export default {
  name: 'MapsPage',
  async fetch() {
    const headers = this.$api.getHeaders()
    await this.$api.getClientList(headers)
    await this.$api.getSmartviews(headers)
  },
  computed: {
    ...mapState([models.clientSearchValue]),
  },
}
</script>

<style scoped></style>
