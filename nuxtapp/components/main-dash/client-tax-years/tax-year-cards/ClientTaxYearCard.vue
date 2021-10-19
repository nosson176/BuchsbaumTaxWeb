<template>
  <div>
    <div class="bg-white shadow overflow-hidden w-64">
      <div class="p-2 divide-y divide-gray-200">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ year }}
        </h3>
      </div>
      <ClientTaxYearCardTabs :filings="filings" :active-filing-type="activeFilingType" @click="setActiveFilingType" />
      <ClientTaxYearCardFilingInfo :filing="displayedFilingInfo" />
    </div>
  </div>
</template>

<script>
import { filingTypes } from '~/shared/constants'
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
    year () {
      return this.yearData.year
    },
    filings () {
      return this.yearData.filings
    },
    displayedFilingInfo () {
      return this.filings.filter(filing => filing.filingType === this.activeFilingType)
    }
  },
  methods: {
    setActiveFilingType (filingType) {
      this.activeFilingType = filingType
    }
  }
}
</script>

<style scoped>

</style>
