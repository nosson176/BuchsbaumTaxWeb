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
        return Object.assign(
          Object.values(this.selectedClient.taxYearData)
            .filter(taxYear => this.showArchived === taxYear.archived)
            .sort((a, b) => {
              return a.year > b.year ? 1 : -1
            })
        )
      } else {
        return null
      }
    },
    isClientSelected () {
      return this.selectedClient.length || Object.entries(this.selectedClient).length
    },
    federalFilingInfo () {
      return this.filings.filter(filing => filing.filingType === filingTypes.federal)[0]
    }
  }
}
</script>

<style scoped>

</style>
