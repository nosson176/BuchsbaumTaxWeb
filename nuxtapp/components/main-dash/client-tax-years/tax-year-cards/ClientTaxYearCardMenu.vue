<template>
  <div class="flex overflow-x-auto overflow-y-hidden space-x-4 px-4">
    <ClientTaxYearCard v-for="yearData in displayedTaxYearData" :key="yearData.id" :year-data="yearData" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { models } from '~/shared/constants'

export default {
  name: 'ClientTaxYearCardMenu',
  props: {
    showArchived: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState([models.selectedClient, models.shownTaxYears]),
    displayedTaxYearData () {
      if (this.isClientSelected) {
        return Object.assign(
          Object.values(this.selectedClient.taxYearData)
            .filter(taxYear => this.shownTaxYears.includes(taxYear.id))
        )
      } else {
        return null
      }
    },
    isClientSelected () {
      return this.selectedClient.length || Object.entries(this.selectedClient).length
    }
  }
}
</script>

<style scoped>

</style>
