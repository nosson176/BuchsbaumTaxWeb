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
      default: false,
    },
  },
  computed: {
    ...mapState([models.selectedClient, models.shownTaxYears, models.selectedTaxYearId]),
    displayedTaxYearData() {
      if (this.isClientSelected) {
        const items = Object.assign(
          Object.values(this.selectedClient.taxYearData)
            .filter((taxYear) => this.shownTaxYears?.includes(taxYear.id))
            .sort((a, b) => {
              return a.year - b.year
            })
        )
        if (this.selectedTaxYearId) {
          const selectedIndex = items.findIndex((item) => item.id === this.selectedTaxYearId)
          const selectedItem = items.splice(selectedIndex, 1)
          items.unshift(selectedItem[0])
        }
        return items
      } else {
        return null
      }
    },
    isClientSelected() {
      return this.selectedClient.length || Object.entries(this.selectedClient).length
    },
  },
}
</script>

<style scoped></style>
