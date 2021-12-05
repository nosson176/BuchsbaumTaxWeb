<template>
  <div class="flex-grow flex">
    <div class="bg-white shadow w-80 flex flex-col overflow-hidden">
      <div class="p-2 divide-y divide-gray-200 flex">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ year }}
        </h3>
      </div>
      <ClientTaxYearCardTabs class="z-10 shadow" :filings="filings" :active-filing-type="activeFilingType" @click="setActiveFilingType" />
      <div class="mt-2" />
      <ClientTaxYearCardFilingInfo :filing="displayedFilingInfo" />
      <div class="mt-2" />
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
      return this.filings.filter(filing => filing.filingType === this.activeFilingType)[0]
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
