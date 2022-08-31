<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <Home />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { models } from '~/shared/constants'

export default {
  name: 'IndexPage',
  async fetch() {
    if (!this.initLoaded) {
      await this.$api.getClientList(this.headers)
      await this.$api.getValueTypes(this.headers)
      await this.$api.getAllUsers(this.headers)
      await this.$api.getValueTaxGroups(this.headers)
      await this.$api.getAllClientFees(this.headers)
      await this.$api.getClientsHistory(this.headers)
      await this.$api.getSmartviews(this.headers)
    }
  },
  computed: {
    ...mapState([models.loaded]),
    headers() {
      return this.$api.getHeaders()
    },
    initLoaded() {
      return (
        this.loaded[models.clients] &&
        this.loaded[models.valueTypes] &&
        this.loaded[models.users] &&
        this.loaded[models.valueTaxGroups] &&
        this.loaded[models.allClientFees] &&
        this.loaded[models.clientsHistory] &&
        this.loaded[models.smartviews]
      )
    },
  },
}
</script>
