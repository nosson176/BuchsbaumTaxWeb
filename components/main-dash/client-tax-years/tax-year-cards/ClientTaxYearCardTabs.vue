<template>
  <div class="border-t border-gray-300 space-x-1 flex shadow">
    <Tab
      v-for="(filing, idx) in filings"
      :key="idx"
      :active="idx === activeFilingIdx"
      @click="handleClick(idx)"
    >
      <span v-if="displayTab(filing)" class="uppercase">{{ filing.filingType }}</span>
    </Tab>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { events, filingTypes, models } from '~/shared/constants'

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
  computed: {
    ...mapState([models.selectedClient]),
    filingTypes() {
      const types = {}
      for(const key in filingTypes){
        if(filingTypes[key] !== filingTypes.ext){
          types[key] = filingTypes[key]
        }
      }
      return types
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
      return filing.filingType !== filingTypes.ext
    }
  }
}
</script>

<style scoped></style>
