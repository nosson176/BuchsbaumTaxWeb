<template>
  <div class="p-2 overflow-auto flex flex-grow">
    <div class="w-full grid grid-cols-1 gap-x-1 gap-y-4 text-xs sm:grid-cols-2">
      <div @click="setEditable('taxForm')">
        <EditableSelectCell
          v-model="taxForm"
          :options="taxFormOptions"
          :is-editable="isEditable('taxForm')"
          placeholder="Tax Form"
          @blur="onBlur"
          @input="debounceUpdate"
        />
      </div>
      <div @click="setEditable('status')">
        <EditableSelectCell
          v-model="status"
          :options="statusOptions"
          :is-editable="isEditable('status')"
          placeholder="Status"
          @blur="onBlur"
          @input="debounceUpdate"
        />
      </div>
      <div @click="setEditable('statusDetail')">
        <EditableSelectCell
          v-model="statusDetail"
          :options="statusDetailOptions"
          :is-editable="isEditable('statusDetail')"
          placeholder="Detail"
          @blur="onBlur"
          @input="debounceUpdate"
        />
      </div>
      <div @click="setEditable('statusDate')">
        <EditableDate
          v-model="statusDate"
          placeholder="Date"
          type="date"
          :is-editable="isEditable('statusDate')"
          @blur="onBlur"
          @input="debounceUpdate"
        />
      </div>
      <div @click="setEditable('memo')">
        <EditableTextArea
          v-model="memo"
          placeholder="Memo"
          :is-editable="isEditable('memo')"
          @blur="onBlur"
          @input="debounceUpdate"
        />
      </div>
      <!-- spacing -->
      <div />
      <div />
      <div />
      <!-- end of spacing -->
      <div class="flex">
        <div @click="setEditable('includeInRefund')">
          <EditableCheckBoxCell
            v-model="includeInRefund"
            :is-editable="isEditable('includeInRefund')"
            @blur="onBlur"
            @input="debounceUpdate"
          />
        </div>
        <div @click="setEditable('owes')">
          <EditableInput
            v-model="owes"
            placeholder="Owes"
            currency
            :is-editable="isEditable('owes')"
            @blur="onBlur"
            @input="debounceUpdate"
          />
        </div>
        /
        <div @click="setEditable('paid')">
          <EditableInput
            v-model="paid"
            placeholder="Paid"
            currency
            :is-editable="isEditable('paid')"
            @blur="onBlur"
            @input="debounceUpdate"
          />
        </div>
      </div>
      <div class="flex">
        <div @click="setEditable('includeFee')">
          <EditableCheckBoxCell
            v-model="includeFee"
            :is-editable="isEditable('includeFee')"
            @blur="onBlur"
            @input="debounceUpdate"
          />
        </div>
        <div @click="setEditable('owesFee')">
          <EditableInput
            v-model="owesFee"
            placeholder="FC"
            currency
            :is-editable="isEditable('owesFee')"
            @blur="onBlur"
            @input="debounceUpdate"
          />
        </div>
        /
        <div @click="setEditable('paidFee')">
          <EditableInput
            v-model="paidFee"
            placeholder="Insur"
            currency
            :is-editable="isEditable('paidFee')"
            @blur="onBlur"
            @input="debounceUpdate"
          />
        </div>
      </div>
      <div @click="setEditable('fileType')">
        <EditableSelectCell
          v-model="fileType"
          :options="fileTypeOptions"
          :is-editable="isEditable('fileType')"
          placeholder="File Type"
          @blur="onBlur"
          @input="debounceUpdate"
        />
      </div>
      <div @click="setEditable('refund')">
        <EditableInput
          v-model="refund"
          placeholder="Refund"
          currency
          :is-editable="isEditable('refund')"
          @blur="onBlur"
          @input="debounceUpdate"
        />
      </div>
      <div @click="setEditable('rebate')">
        <EditableInput
          v-model="rebate"
          placeholder="Rebate"
          currency
          :is-editable="isEditable('rebate')"
          @blur="onBlur"
          @input="debounceUpdate"
        />
      </div>
      <!-- spacing -->
      <div />
      <!-- end of spacing -->
      <div @click="setEditable('sum')">
        <EditableInput
          v-model="sum"
          placeholder="Sum"
          currency
          :is-editable="isEditable('sum')"
          @blur="onBlur"
          @input="debounceUpdate"
        />
      </div>
      <div @click="setEditable('deliveryContact')">
        <EditableSelectCell
          v-model="deliveryContact"
          :options="contactTypeOptions"
          :is-editable="isEditable('deliveryContact')"
          placeholder="Delivery1"
          @blur="onBlur"
          @input="debounceUpdate"
        />
      </div>
      <div @click="setEditable('secondDeliveryContact')">
        <EditableSelectCell
          v-model="secondDeliveryContact"
          :options="contactTypeOptions"
          :is-editable="isEditable('secondDeliveryContact')"
          placeholder="Delivery2"
          @blur="onBlur"
          @input="debounceUpdate"
        />
      </div>
      <div @click="setEditable('dateFiled')">
        <EditableDate
          v-model="dateFiled"
          placeholder="Date Filed"
          type="date"
          :is-editable="isEditable('dateFiled')"
          @blur="onBlur"
          @input="debounceUpdate"
        />
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
    formModel () {
      return {
        ...this.filing
      }
    },
    taxForm () {
      return this.formModel.taxForm
    },
    status () {
      return this.formModel.status
    },
    statusDetail () {
      return this.formModel.statusDetail
    },
    statusDate () {
      return this.formModel.statusDate
    },
    memo () {
      return this.formModel.memo
    },
    includeInRefund () {
      return this.formModel.includeInRefund
    },
    owes () {
      return this.formModel.owes
    },
    paid () {
      return this.formModel.paid
    },
    includeFee () {
      return this.formModel.includeFee
    },
    owesFee () {
      return this.formModel.owesFee
    },
    paidFee () {
      return this.formModel.paidFee
    },
    fileType () {
      return this.formModel.fileType
    },
    refund () {
      return this.formModel.refund
    },
    rebate () {
      return this.formModel.rebate
    },
    sum () {
      return this.refund - this.rebate
    },
    deliveryContact () {
      return this.formModel.deliveryContact
    },
    secondDeliveryContact () {
      return this.formModel.secondDeliveryContact
    },
    dateFiled () {
      return this.formModel.dateFiled
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
    },
    fileTypeOptions () {
      return this.valueTypes.file_type.filter(fileType => fileType.show)
    },
    contactTypeOptions () {
      return this.valueTypes.contact_type.filter(contactType => contactType.show)
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
