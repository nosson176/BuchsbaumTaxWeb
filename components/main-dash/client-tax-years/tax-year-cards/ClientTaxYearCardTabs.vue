<template>
  <div class="border-t border-gray-300 space-x-1 flex shadow">
    <Tab
      v-for="(filingType, idx) in filingTypes"
      :key="idx"
      :active="filingType === activeFilingType"
      @click="handleClick(filingType)"
    >
      <span v-if="filingHasFilingType(filingType)" class="uppercase">{{ filingType }}</span>
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
    activeFilingType: {
      type: String,
      default: '',
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
    handleClick(filingType) {
      this.emitClick(filingType)
    },
    emitClick(filingType) {
      return this.$emit(events.click, filingType)
    },
    filingHasFilingType(filingType) {
      return this.filings.some((filing) => filing.filingType === filingType)
    }
  }
}
</script>

<style scoped></style>
