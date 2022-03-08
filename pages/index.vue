<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <Home />
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  created () {
    const headers = this.$api.getHeaders()
    this.$api.getClientList(headers)
      .then(() => {
        this.$api.getValueTypes(headers)
        this.$api.getAllUsers(headers)
        this.$api.getValueTaxGroups(headers)
        this.$api.getAllClientFees(headers)
        this.$api.getClientsHistory(headers)
        this.$api.getSmartviews(headers)
      })
  }
}
</script>
