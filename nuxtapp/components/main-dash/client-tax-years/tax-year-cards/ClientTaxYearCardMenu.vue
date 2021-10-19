<template>
  <div class="flex flex-row-reverse overflow-auto">
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
    ...mapState([models.selectedClient]),
    displayedTaxYearData () {
      if (this.isClientSelected) {
        if (!this.showArchived) {
          return this.notArchived
        } else {
          return this.archived
        }
      } else {
        return null
      }
    },
    isClientSelected () {
      return this.selectedClient.length || Object.entries(this.selectedClient).length
    },
    notArchived () {
      return Object.assign(
        Object.values(this.selectedClient.taxYearData)
          .filter(taxYear => !taxYear.archived)
          .sort((a, b) => {
            return a.years < b.years ? 1 : -1
          })
      )
    },
    archived () {
      return Object.assign(
        Object.values(this.selectedClient.taxYearData)
          .filter(taxYear => taxYear.archived)
          .sort((a, b) => a.years < b.years ? 1 : -1)
      )
    }
  }
}
</script>

<style scoped>

</style>
