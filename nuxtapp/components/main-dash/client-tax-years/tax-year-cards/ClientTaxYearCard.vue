<template>
  <div class="flex-grow flex">
    <div class="bg-white shadow w-80 flex flex-col overflow-hidden">
      <div class="p-2 flex justify-between">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ year }}
        </h3>
      </div>
      <ClientTaxYearCardTabs
        class="z-10 shadow"
        :filings="filings"
        :active-filing-type="activeFilingType"
        :tax-year="yearData"
        @change="updateOnClient"
        @click="setActiveFilingType"
      />
      <div class="mt-2" />
      <ClientTaxYearCardFilingInfo :filing="displayedFilingInfo" @input="updateOnClient" />
      <div class="mt-2" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { filingTypes, models, mutations } from '~/shared/constants'

export default {
  name: 'ClientTaxYearCard',
  props: {
    yearData: {
      type: Object,
      default: () => null
    }
  },
  data () {
    return {
      activeFilingType: filingTypes.federal
    }
  },
  computed: {
    ...mapState([models.selectedClient]),
    year () {
      return this.yearData.year
    },
    filings () {
      return this.yearData.filings
    },
    displayedFilingInfo () {
      return this.filings.filter(filing => filing.filingType === this.activeFilingType)[0]
    }
  },
  methods: {
    setActiveFilingType (filingType) {
      this.activeFilingType = filingType
    },
    updateOnClient (updatedFiling) {
      const taxYearData = JSON.parse(JSON.stringify(this.selectedClient.taxYearData))
      const taxYearIndex = taxYearData.findIndex(taxYear => taxYear.id === this.yearData.id)
      const filings = taxYearData[taxYearIndex].filings
      const editedFilingIndex = filings.findIndex(filing => filing.id === updatedFiling.id)
      if (editedFilingIndex !== -1) {
        filings[editedFilingIndex] = updatedFiling
      } else {
        filings.push(updatedFiling)
      }
      taxYearData[taxYearIndex].filings = filings
      const data = Object.assign({}, this.selectedClient, { taxYearData })
      this.$store.commit(mutations.setModelResponse, { model: models.selectedClient, data })
    }
  }
}
</script>

<style scoped>

</style>
