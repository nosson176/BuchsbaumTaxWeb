<template>
  <div>
    <div
      class="flex h-20 px-1 py-1 border border-gray-300 border-opacity-0 hover:border-opacity-100 space-x-1"
      :class="classObj"
      @click="toggleSelectTaxYear"
    >
      <div class="text-xs tracking-tighter cursor-pointer w-full">
        <div class="flex flex-col">
          <div class="flex">
            <span class="font-bold mr-4">{{ year }}</span>
            <span> {{ status }}</span>
            <span class="ml-auto">{{ owes }}</span>
          </div>
          <div class="flex">
            <span class="mr-5"> {{ taxForm }}</span>
            <span>{{ statusDetail }}</span>
            <span class="ml-auto">{{ paid }}</span>
          </div>
          <div class="flex justify-between pt-6 pr-2 text-xs text-gray-600">
            <span v-if="amountFederalFilings">{{ amountFederalFilings }} Federal</span>
            <span v-if="amountStateFilings">{{ amountStateFilings }} State</span>
            <span v-if="amountFbarFilings">{{ amountFbarFilings }} Fbar</span>
            <span v-if="amountExtFilings">{{ amountExtFilings }} Ext</span>
          </div>
        </div>
      </div>
      <div class="flex flex-col items-center w-3 space-y-3.5 pl-2 pr-1" @click.stop>
        <CheckBoxWithEyeIcon v-model="showing" />
        <DeleteButton small @click="onDeleteClick()" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { currencies, events, filingTypes, models, mutations } from '~/shared/constants'
import { formatAsNumber } from '~/shared/utility'
export default {
  name: 'ClientTaxYearsListItem',
  props: {
    idx: {
      type: Number,
      default: NaN,
    },
    taxYear: {
      type: Object,
      default: () => null,
    },
  },
  computed: {
    ...mapState([models.selectedTaxYearId]),
    federalFilings() {
      return this.taxYear.filings.filter((filing) => filing.filingType === filingTypes.federal)
    },
    fbarFilings() {
      return this.taxYear.filings.filter((filing) => filing.filingType === filingTypes.fbar)
    },
    stateFilings() {
      return this.taxYear.filings.filter((filing) => filing.filingType === filingTypes.state)
    },
    extFilings() {
      return this.taxYear.filings.filter((filing) => filing.filingType === filingTypes.ext)
    },
    amountFederalFilings() {
      return this.federalFilings.length
    },
    amountFbarFilings() {
      return this.fbarFilings.length
    },
    amountStateFilings() {
      return this.stateFilings.length
    },
    amountExtFilings() {
      return this.extFilings.length
    },
    federalFilingInfo() {
      return this.federalFilings[0]
    },
    year() {
      return this.taxYear.year
    },
    status() {
      return this.federalFilingInfo?.status
    },
    owes() {
      return this.federalFilingInfo?.owes ? this.currencySymbol + formatAsNumber(this.federalFilingInfo.owes) : ''
    },
    taxForm() {
      return this.federalFilingInfo?.taxForm
    },
    statusDetail() {
      return this.federalFilingInfo?.statusDetail
    },
    paid() {
      return this.federalFilingInfo?.paid ? this.currencySymbol + formatAsNumber(this.federalFilingInfo.paid) : ''
    },
    classObj() {
      const selected = this.selectedTaxYearId === this.taxYear.id
      const even = this.idx % 2 === 0
      return { even, selected }
    },
    showing: {
      get() {
        return this.taxYear.show
      },
      set(newVal) {
        if (!newVal && this.taxYear.id === this.selectedTaxYearId) {
          this.$store.commit(mutations.setModelResponse, { model: models.selectedTaxYearId, data: [] })
        }
        this.$emit(events.change, newVal)
      },
    },
    currency() {
      return this.federalFilingInfo?.currency
    },
    currencySymbol() {
      if (this.currency === currencies.NIS.type) {
        return currencies.NIS.symbol
      } else {
        return currencies.USD.symbol
      }
    },
    currencyOptions() {
      return [{ value: currencies.USD.type }, { value: currencies.NIS.type }]
    },
  },
  methods: {
    toggleSelectTaxYear() {
      if (this.selectedTaxYearId === this.taxYear.id) {
        this.$store.commit(mutations.setModelResponse, { model: models.selectedTaxYearId, data: [] })
      } else {
        this.$store.commit(mutations.setModelResponse, { model: models.selectedTaxYearId, data: this.taxYear.id })
      }
    },
    onDeleteClick() {
      this.$emit(events.delete, this.taxYear.id)
    },
  },
}
</script>

<style scoped>
.even {
  @apply bg-gray-50;
}

.selected {
  @apply border-opacity-100 border-indigo-500;
}
</style>
