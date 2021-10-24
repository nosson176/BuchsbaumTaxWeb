<template>
  <div class="flex-grow overflow-auto">
    <ClientTaxYearsListItem v-for="(taxYear, idx) in displayedTaxYearData" :key="taxYear.id" :idx="idx" :tax-year="taxYear" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { filingTypes, models } from '~/shared/constants'

export default {
  name: 'ClientTaxYearsList',
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
            return a.year > b.year ? 1 : -1
          })
      )
    },
    archived () {
      return Object.assign(
        Object.values(this.selectedClient.taxYearData)
          .filter(taxYear => taxYear.archived)
          .sort((a, b) => a.year > b.year ? 1 : -1)
      )
    },
    federalFilingInfo () {
      return this.filings.filter(filing => filing.filingType === filingTypes.federal)[0]
    }
  }
}
</script>

<style scoped>

</style>
