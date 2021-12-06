<template>
  <div class="p-2 overflow-auto flex flex-grow">
    <div class="w-full grid grid-cols-1 gap-x-1 gap-y-4 text-xs sm:grid-cols-2">
      <div @click="setEditable('taxForm')">
        <EditableSelectCell v-model="taxForm" :options="taxFormOptions" :is-editable="isEditable('taxForm')" @blur="onBlur" />
      </div>
      <div @click="setEditable('status')">
        <EditableSelectCell v-model="status" :options="statusOptions" :is-editable="isEditable('status')" @blur="onBlur" />
      </div>
      <div @click="setEditable('statusDetail')">
        <EditableSelectCell v-model="statusDetail" :options="statusDetailOptions" :is-editable="isEditable('statusDetail')" @blur="onBlur" />
      </div>
      <div @click="setEditable('statusDate')">
        <EditableDate v-model="statusDate" placeholder="Date" type="date" :is-editable="isEditable('statusDate')" @blur="onBlur" />
      </div>
      <div @click="setEditable('memo')">
        <EditableTextArea v-model="memo" :is-editable="isEditable('memo')" @blur="onBlur" />
      </div>
      <!-- spacing -->
      <div />
      <div />
      <div />
      <!-- end of spacing -->
      <ClientTaxYearCardFilingInfoItem>
        <template #label>
          <div @click="setEditable('sum')">
            <EditableCheckBoxCell
              v-model="includeInRefund"
              :is-editable="isEditable('sum')"
              @blur="onBlur"
              @input="debounceUpdate"
            />
          </div>
          Owes/Paid
        </template>
        <template v-if="hasOwesOrPaid" #value>
          <span v-if="hasOwes"> {{ formattedOwes }}</span>/<span v-if="hasPaid">{{ formattedPaid }}</span>
        </template>
      </ClientTaxYearCardFilingInfoItem>
      <ClientTaxYearCardFilingInfoItem>
        <template #label>
          <CheckBoxToDisplayTrueFalse id="includeFee" name="includeFee" disabled :checked="includeFee" />
          FC/Insur
        </template>
        <template v-if="hasOwesFeeOrPaidFee" #value>
          <span v-if="hasOwesFee"> {{ formattedOwesFee }}</span>/<span v-if="hasPaidFee">{{ formattedPaidFee }}</span>
        </template>
      </ClientTaxYearCardFilingInfoItem>
      <ClientTaxYearCardFilingInfoItem>
        <template v-if="fileType" #value>
          {{ fileType }}
        </template>
        <template v-else #label>
          File Type
        </template>
      </ClientTaxYearCardFilingInfoItem>
      <ClientTaxYearCardFilingInfoItem>
        <template v-if="refund" #value>
          {{ formattedRefund }}
        </template>
        <template v-else #label>
          Refund
        </template>
      </ClientTaxYearCardFilingInfoItem>
      <ClientTaxYearCardFilingInfoItem>
        <template v-if="rebate" #value>
          {{ formattedRebate }}
        </template>
        <template v-else #label>
          Rebate
        </template>
      </ClientTaxYearCardFilingInfoItem>
      <!-- spacing -->
      <div />
      <!-- end of spacing -->
      <ClientTaxYearCardFilingInfoItem>
        <template v-if="hasSum" #value>
          {{ formattedSum }}
        </template>
        <template v-else #label>
          Sum
        </template>
      </ClientTaxYearCardFilingInfoItem>
      <ClientTaxYearCardFilingInfoItem>
        <template v-if="deliveryContact" #value>
          {{ deliveryContact }}
        </template>
        <template v-else #label>
          Delivery 1
        </template>
      </ClientTaxYearCardFilingInfoItem>
      <ClientTaxYearCardFilingInfoItem>
        <template v-if="secondDeliveryContact" #value>
          {{ secondDeliveryContact }}
        </template>
        <template v-else #label>
          Delivery 2
        </template>
      </ClientTaxYearCardFilingInfoItem>
      <div @click="setEditable('dateFiled')">
        <EditableDate v-model="dateFiled" placeholder="Date Filed" type="date" :is-editable="isEditable('dateFiled')" @blur="onBlur" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { debounce } from 'lodash'
import { formatAsILCurrency, formatAsUSCurrency } from '~/shared/utility'
import { models, mutations } from '~/shared/constants'

export default {
  name: 'ClientTaxYearCardFilingInfo',
  props: {
    filing: {
      type: Object,
      default: () => null
    }
  },
  data () {
    return {
      editable: ''
    }
  },
  computed: {
    ...mapState([models.valueTypes]),
    taxForm () {
      return this.filing.taxForm || 'Tax Form'
    },
    status () {
      return this.filing.status || 'Status'
    },
    statusDetail () {
      return this.filing.statusDetail || 'Detail'
    },
    statusDate () {
      return this.filing.statusDate
    },
    memo () {
      return this.filing.memo || 'Memo'
    },
    includeInRefund () {
      return this.filing.includeInRefund
    },
    owes () {
      return this.filing.owes
    },
    formattedOwes () {
      return this.formatAsILCurrency(this.owes)
    },
    paid () {
      return this.filing.paid
    },
    formattedPaid () {
      return this.formatAsILCurrency(this.paid)
    },
    hasOwes () {
      return this.owes
    },
    hasPaid () {
      return this.paid
    },
    hasOwesOrPaid () {
      return this.hasOwes || this.hasPaid
    },
    includeFee () {
      return this.filing.includeFee
    },
    owesFee () {
      return this.filing.owesFee
    },
    formattedOwesFee () {
      return this.formatAsILCurrency(this.owesFee)
    },
    paidFee () {
      return this.filing.paidFee
    },
    formattedPaidFee () {
      return this.formatAsILCurrency(this.paidFee)
    },
    hasOwesFee () {
      return this.owesFee
    },
    hasPaidFee () {
      return this.paidFee
    },
    hasOwesFeeOrPaidFee () {
      return this.hasOwesFee || this.hasPaidFee
    },
    fileType () {
      return this.filing.fileType
    },
    refund () {
      return this.filing.refund
    },
    formattedRefund () {
      return formatAsUSCurrency(this.refund)
    },
    rebate () {
      return this.filing.rebate
    },
    formattedRebate () {
      return formatAsUSCurrency(this.rebate)
    },
    hasSum () {
      return this.refund || this.rebate
    },
    sum () {
      return this.refund - this.rebate
    },
    formattedSum () {
      return formatAsUSCurrency(this.sum)
    },
    deliveryContact () {
      return this.filing.deliveryContact
    },
    secondDeliveryContact () {
      return this.filing.secondDeliveryContact
    },
    dateFiled () {
      return this.filing.dateFiled
    },
    debounceUpdate () {
      return debounce(this.handleUpdate, 500)
    },
    taxFormOptions () {
      return this.valueTypes.tax_form.filter(taxForm => taxForm.show)
    },
    statusOptions () {
      return this.valueTypes.tax_year_status.filter(status => status.show)
    },
    statusDetailOptions () {
      return this.valueTypes.tax_year_status_detail.filter(statusDetail => statusDetail.show)
    }
  },
  methods: {
    formatAsILCurrency (amt) {
      return formatAsILCurrency(amt)
    },
    formatAsUSCurrency (amt) {
      return formatAsUSCurrency(amt)
    },
    setEditable (editable) {
      this.editable = editable
    },
    isEditable (value) {
      return this.editable === value
    },
    onBlur () {
      this.setEditable('')
    },
    handleUpdate (filing) {
      this.updateOnBackend(filing)
      this.updateOnClient(filing)
    },
    updateOnBackend (filing) {
      this.$api.updateFiling(this.headers, { filingId: filing.id }, filing)
    },
    updateOnClient (updatedFiling) {
      const filing = JSON.parse(JSON.stringify(this.filing))
      const editedFilingIndex = filing.findIndex(filing => filing.id === updatedFiling.id)
      filing[editedFilingIndex] = updatedFiling
      const data = Object.assign({}, this.selectedClient, { filing })
      this.$store.commit(mutations.setModelResponse, { model: models.selectedClient, data })
    }
  }
}
</script>

<style scoped>

</style>
