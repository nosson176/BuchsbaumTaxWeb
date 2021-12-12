<template>
  <div class="border-t border-gray-300 space-x-1 flex">
    <Tab v-for="(filingType ,idx) in filingTypes" :key="idx" :active="filingType === activeFilingType" @click="handleClick(filingType)">
      <span v-if="filingHasFilingType(filingType)" class="uppercase">{{ filingType }}</span>
      <span v-else class="text-sm font-semibold text-gray-500 uppercase flex items-center"><AddRowButton /> {{ filingType }}</span>
    </Tab>
  </div>
</template>

<script>
import { events, filingTypes } from '~/shared/constants'
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
  computed: {
    filingTypes () {
      return filingTypes
    }
  },
  methods: {
    handleClick (filingType) {
      if (this.filingHasFilingType(filingType)) {
        this.emitClick(filingType)
      } else {
        this.addFiling(filingType)
      }
    },
    emitClick (filingType) {
      console.log('emitClick', filingType)
      return this.$emit(events.click, filingType)
    },
    filingHasFilingType (filingType) {
      return this.filings.some(filing => filing.filingType === filingType)
    },
    addFiling (filingType) {
      this.emitClick(filingType)
      this.$emit('add-filing', filingType)
    }
  }
}
</script>

<style scoped>

</style>
