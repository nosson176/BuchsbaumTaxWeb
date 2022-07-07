<template>
  <div class="border-t border-gray-300 space-x-1 flex shadow">
    <Tab
      v-for="(filing, idx) in filings"
      :key="idx"
      :active="idx === activeFilingIdx"
      @click="handleClick(idx)"
    >
      <span
        v-if="displayTab(filing)"
        class="uppercase text-xs"
        :class="{'text-gray-300': !filing.taxForm && !filing.state}"
      >
        {{ filing.taxForm || filing.state || filing.filingType }}
      </span>
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
      default: () => [],
    },
    activeFilingIdx: {
      type: Number,
      default: NaN,
    },
    taxYear: {
      type: Object,
      default: () => null,
    },
  },
  methods: {
    handleClick(filingIdx) {
      this.emitClick(filingIdx)
    },
    emitClick(filingIdx) {
      return this.$emit(events.click, filingIdx)
    },
    displayTab(filing) {
      return filing.filingType !== filingTypes.ext && filing.filingType !== filingTypes.fbar
    }
  }
}
</script>

<style scoped></style>
