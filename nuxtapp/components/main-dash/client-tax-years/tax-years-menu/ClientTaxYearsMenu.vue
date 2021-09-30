<template>
  <div class="flex-grow overflow-auto">
    <div v-for="taxYear in displayedTaxYearData" :key="taxYear.id" class="px-3 tax-year">
      <span class="font-bold">{{ taxYear.yearName }}</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { models } from '~/shared/constants'

export default {
  name: 'ClientTaxYearsMenu',
  props: {
    showArchived: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState([models.selectedClient]),
    displayedTaxYearData () {
      if (this.selectedClient.length || Object.entries(this.selectedClient).length) {
        if (!this.showArchived) {
          return Object.fromEntries(Object.entries(this.selectedClient.taxYearData)
            .filter(([key, taxYear]) => taxYear.archived === false))
        } else {
          return this.selectedClient.taxYearData
        }
      } else {
        return null
      }
    }
  }
}
</script>

<style scoped>
.tax-year:nth-child(even) {
  @apply bg-gray-300;
}
</style>
