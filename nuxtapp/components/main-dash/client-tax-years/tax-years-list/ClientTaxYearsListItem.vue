<template>
  <div class="px-3 py-1 text-xs tracking-tighter h-16 cursor-pointer border border-gray-300 border-opacity-0 hover:border-opacity-100" :class="classObj">
    <div class="flex flex-col space-y-3">
      <div class="flex">
        <span class="font-bold mr-2">{{ year }}</span>
        <span> {{ status }}</span>
        <span class="ml-auto">{{ owes }}</span>
      </div>
      <div class="flex">
        <span class="mr-2"> {{ taxForm }}</span>
        <span>{{ statusDetail }}</span>
        <span class="ml-auto">{{ paid }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { filingTypes } from '~/shared/constants'
import { formatAsILCurrency } from '~/shared/utility'
export default {
  name: 'ClientTaxYearsListItem',
  props: {
    idx: {
      type: Number,
      default: NaN
    },
    taxYear: {
      type: Object,
      default: () => null
    }
  },
  computed: {
    federalFilingInfo () {
      return this.taxYear.filings.filter(filing => filing.filingType === filingTypes.federal)[0]
    },
    year () {
      return this.taxYear.year
    },
    status () {
      return this.federalFilingInfo.status
    },
    owes () {
      return this.federalFilingInfo.owes ? this.formatAsILS(this.federalFilingInfo.owes).split('.')[0] : ''
    },
    taxForm () {
      return this.federalFilingInfo.taxForm
    },
    statusDetail () {
      return this.federalFilingInfo.statusDetail
    },
    paid () {
      return this.federalFilingInfo.paid ? this.formatAsILS(this.federalFilingInfo.paid).split('.')[0] : ''
    },
    classObj () {
      const even = this.idx % 2 === 0
      return { even }
    }
  },
  methods: {
    formatAsILS (amt) {
      return formatAsILCurrency(amt)
    }
  }
}
</script>

<style scoped>
.even {
  @apply bg-gray-50;
}
</style>
