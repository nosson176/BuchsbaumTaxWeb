<template>
  <div class="border-t border-gray-300 space-x-1 flex">
    <Tab v-for="(filing,idx) in filings" :key="idx" :active="filing.filingType === activeFilingType" @click="emitClick(filing.filingType)">
      <span class="uppercase">{{ filing.filingType }}</span>
    </Tab>
  </div>
</template>

<script>
import { events } from '~/shared/constants'
export default {
  name: 'ClientTaxYearCardTabs',
  props: {
    filings: {
      type: Array,
      default: () => []
    },
    activeFilingType: {
      type: String,
      default: ''
    }
  },
  methods: {
    emitClick (filingType) {
      return this.$emit(events.click, filingType)
    }
  }
}
</script>

<style scoped>

</style>
