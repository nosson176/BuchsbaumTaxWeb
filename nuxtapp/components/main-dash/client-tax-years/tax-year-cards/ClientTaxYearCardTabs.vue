<template>
  <div class="border-t border-gray-300 space-x-1 flex shadow">
    <Tab v-for="(filingType ,idx) in filingTypes" :key="idx" :active="filingType === activeFilingType" @click="handleClick(filingType)">
      <span v-if="filingHasFilingType(filingType)" class="uppercase">{{ filingType }}</span>
      <span v-else class="text-sm font-semibold text-gray-500 uppercase flex items-center"><AddRowButton /> {{ filingType }}</span>
    </Tab>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { events, filingTypes, models } from '~/shared/constants'

const filingConstructor = {
  taxForm: '',
  status: '',
  statusDetail: '',
  statusDate: null,
  memo: '',
  includeInRefund: false,
  owes: 0,
  paid: 0,
  includeFee: false,
  owesFee: 0,
  paidFee: 0,
  fileType: '',
  refund: 0,
  rebate: 0,
  completed: false,
  deliveryContact: '',
  secondDeliveryContact: '',
  dateFiled: null,
  filingType: '',
  state: '',
  taxYearId: NaN,
  amount: 0
}

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
      const headers = this.$api.getHttpConfig()
      const defaultValues = {
        filingType,
        taxYearId: this.taxYear.id
      }
      const filing = Object.assign({}, filingConstructor, defaultValues)
      // const clientId = this.selectedClient.id
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
