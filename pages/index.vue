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
  async fetch () {
    const headers = this.$api.getHeaders()
    await this.$api.getClientList(headers)
    await this.$api.getValueTypes(headers)
    await this.$api.getAllUsers(headers)
    await this.$api.getValueTaxGroups(headers)
    await this.$api.getAllClientFees(headers)
    await this.$api.getClientsHistory(headers)
    await this.$api.getSmartviews(headers)

  }
}
</script>
