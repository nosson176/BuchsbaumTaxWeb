<template>
  <div class="border-t border-gray-300 space-x-1 flex shadow">
    <Tab v-for="(filingType ,idx) in filingTypes" :key="idx" :active="filingType === activeFilingType" @click="handleClick(filingType)">
      <span v-if="filingHasFilingType(filingType)" class="uppercase">{{ filingType }}</span>
      <span v-else class="text-sm font-semibold text-gray-300 uppercase flex items-center"><AddRowButton /> {{ filingType }}</span>
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
      default: () => []
    },
    activeFilingType: {
      type: String,
      default: ''
    },
    taxYear: {
      type: Object,
      default: () => null
    }
  },
  computed: {
    ...mapState([models.selectedClient]),
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
      return this.$emit(events.click, filingType)
    },
    filingHasFilingType (filingType) {
      return this.filings.some(filing => filing.filingType === filingType)
    },
    addFiling (filingType) {
      const headers = this.$api.getHeaders()
      const defaultValues = {
        filingType,
        taxYearId: this.taxYear.id
      }
      const filing = Object.assign({}, defaultValues)
      this.$api.createFiling(headers, { filing })
        .then((data) => {
          this.$emit(events.change, data)
          this.emitClick(filingType)
        })
    }
  }
}
</script>

<style scoped>

</style>
