<template>
  <div class="flex-grow flex">
    <div class="bg-white shadow w-80 flex flex-col overflow-hidden">
      <div class="p-2 flex justify-between">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ year }}
        </h3>
      </div>
      <ClientTaxYearCardTabs class="z-10 shadow" :filings="filings" :active-filing-type="activeFilingType" @click="setActiveFilingType" />
      <div class="mt-2" />
      <ClientTaxYearCardFilingInfo :filing="displayedFilingInfo" @input="updateOnClient" />
      <div class="mt-2" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { filingTypes, models, mutations } from '~/shared/constants'

const filingConstructor = {
  taxForm: '1040',
  status: 'FILED',
  statusDetail: 'FEE RECEIEVED',
  statusDate: '2021-10-17',
  memo: 'TEST',
  includeInRefund: true,
  owes: 1500.00,
  paid: 0,
  includeFee: true,
  owesFee: 100,
  paidFee: 0,
  fileType: 'MFJ',
  refund: 3000,
  rebate: 150,
  completed: true,
  deliveryContact: 'TEST',
  secondDeliveryContact: 'TEST',
  dateFiled: '2021-10-01',
  filingType: 'federal',
  state: 'AZ',
  taxYearId: 14,
  amount: 100
}

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
    ...mapState([models.selectedClient]),
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
      console.log('setActiveFilingType', filingType)
      this.activeFilingType = filingType
    },
    updateOnClient (updatedFiling) {
      const taxYearData = JSON.parse(JSON.stringify(this.selectedClient.taxYearData))
      const taxYearIndex = taxYearData.findIndex(taxYear => taxYear.id === this.yearData.id)
      const filings = taxYearData[taxYearIndex].filings
      const editedFilingIndex = filings.findIndex(filing => filing.id === updatedFiling.id)
      filings[editedFilingIndex] = updatedFiling
      taxYearData[taxYearIndex].filings = filings
      const data = Object.assign({}, this.selectedClient, { taxYearData })
      this.$store.commit(mutations.setModelResponse, { model: models.selectedClient, data })
    },
    addFiling () {
      const headers = this.$api.getHttpConfig()
      const clientId = this.selectedClient.id
      const defaultValues = {
        clientId,
        category: this.categoryOptions[2].value,
        years: this.yearNameOptions[0].value,
        taxType: this.taxTypeOptions[0].value,
        taxGroup: this.taxGroupOptions[0].value,
        job: this.jobOptions[0].value,
        currency: this.currencyOptions[0].value
      }
      const filing = Object.assign({}, filingConstructor, defaultValues)
      this.$api.createFiling(headers, { filing })
        .then((data) => {
          this.addRowOnClient(data)
        })
    }
  }
}
</script>

<style scoped>

</style>
