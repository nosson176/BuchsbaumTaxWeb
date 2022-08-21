<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <p v-if="$fetchState.pending">Fetching Data...</p>
    <Home v-else />
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  async fetch() {
    await this.$api.getClientList(this.headers)
  },
  computed: {
    headers() {
      return this.$api.getHeaders()
    },
  },
  async created() {
    await this.$api.getValueTypes(this.headers)
    await this.$api.getAllUsers(this.headers)
    await this.$api.getValueTaxGroups(this.headers)
    await this.$api.getAllClientFees(this.headers)
    await this.$api.getClientsHistory(this.headers)
    await this.$api.getSmartviews(this.headers)
  },
}
</script>
