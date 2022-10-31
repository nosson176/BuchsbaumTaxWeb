<template>
  <div class="flex flex-row-reverse overflow-x-auto overflow-y-hidden space-x-4 px-4">
    <template v-for="(yearData, idx) in displayedTaxYearData">
      <div v-if="idx === 0" :key="yearData.id" class="mr-52"></div>
      <ClientTaxYearCard :key="yearData.id" :year-data="yearData" />
    </template>
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
    ...mapState([models.selectedClient, models.selectedTaxYearId]),
    displayedTaxYearData() {
      if (this.isClientSelected) {
        const items = Object.assign(
          Object.values(this.selectedClient.taxYearData)
            .filter((taxYear) => taxYear.show && this.showArchived === taxYear.archived)
            .sort((a, b) => {
              return a.year - b.year
            })
        )
        return items.reverse()
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
