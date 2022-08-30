<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <Home />
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  async asyncData({ $api }) {
    const headers = $api.getHeaders()
    await $api.getClientList(headers)
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
  },
}
</script>
