<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <Home />
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
  mounted() {
    this.$api.getValueTypes(this.headers)
    this.$api.getAllUsers(this.headers)
    this.$api.getValueTaxGroups(this.headers)
    this.$api.getAllClientFees(this.headers)
    this.$api.getClientsHistory(this.headers)
    this.$api.getSmartviews(this.headers)
    this.$api.getCurrentUser(this.headers)
  },
}
</script>
