<template>
  <div v-if="filing" class="p-2 overflow-auto flex flex-grow">
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
      <div class="col-span-2 cursor-pointer" @click="setEditable('memo')">
        <EditableTextAreaCell
          v-model="memo"
          placeholder="Memo"
          :is-editable="isEditable('memo')"
          @blur="onBlur"
          @input="debounceUpdate"
        />
      </div>
      <div class="flex items-center">
        <div @click="setEditable('includeInRefund')">
          <EditableCheckBoxCell
            v-model="includeInRefund"
            :is-editable="isEditable('includeInRefund')"
            @blur="onBlur"
            @input="debounceUpdate"
          />
        </div>
        <div class="flex flex-col">
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
      </div>
      <div class="flex items-center">
        <div @click="setEditable('includeFee')">
          <EditableCheckBoxCell
            v-model="includeFee"
            :is-editable="isEditable('includeFee')"
            @blur="onBlur"
            @input="debounceUpdate"
          />
        </div>
        <div class="flex flex-col">
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
      <!-- spacing -->
      <div />
      <!-- end of spacing -->
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
      <div class="col-span-2 flex justify-evenly py-1 items-center" :class="sumClassObj">
        <div>
          <span class="text-white font-semibold text-sm">
            {{ sum }}
          </span>
        </div>
        <div @click="setEditable('completed')">
          <EditableCheckBoxCell
            v-model="completed"
            :is-editable="isEditable('completed')"
            @blur="onBlur"
            @input="debounceUpdate"
          />
        </div>
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
import { filingTypes, models } from '~/shared/constants'

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
      editable: '',
      formModel: null
    }
  },
  computed: {
    ...mapState([models.valueTypes, models.selectedClient]),
    headers () {
      return this.$api.getHeaders()
    },
    taxForm: {
      get () {
        return this.formModel.taxForm
      },
      set (newValue) {
        this.formModel.taxForm = newValue
      }
    },
    status: {
      get () {
        return this.formModel.status
      },
      set (newVal) {
        this.formModel.status = newVal
      }
    },
    statusDetail: {
      get () {
        return this.formModel.statusDetail
      },
      set (newVal) {
        this.formModel.statusDetail = newVal
      }
    },
    statusDate: {
      get () {
        return this.formModel.statusDate
      },
      set (newVal) {
        this.formModel.statusDate = newVal
      }
    },
    memo: {
      get () {
        return this.formModel.memo
      },
      set (newVal) {
        this.formModel.memo = newVal
      }
    },
    includeInRefund: {
      get () {
        return this.formModel.includeInRefund
      },
      set (newVal) {
        this.formModel.includeInRefund = newVal
      }
    },
    owes: {
      get () {
        return this.formModel.owes
      },
      set (newVal) {
        this.formModel.owes = newVal
      }
    },
    paid: {
      get () {
        return this.formModel.paid
      },
      set (newVal) {
        this.formModel.paid = newVal
      }
    },
    includeFee: {
      get () {
        return this.formModel.includeFee
      },
      set (newVal) {
        this.formModel.includeFee = newVal
      }
    },
    owesFee: {
      get () {
        return this.formModel.owesFee
      },
      set (newVal) {
        this.formModel.owesFee = newVal
      }
    },
    paidFee: {
      get () {
        return this.formModel.paidFee
      },
      set (newVal) {
        this.formModel.paidFee = newVal
      }
    },
    fileType: {
      get () {
        return this.formModel.fileType
      },
      set (newVal) {
        this.formModel.fileType = newVal
      }
    },
    refund: {
      get () {
        return this.formModel.refund
      },
      set (newVal) {
        this.formModel.refund = newVal
      }
    },
    rebate: {
      get () {
        return this.formModel.rebate
      },
      set (newVal) {
        this.formModel.rebate = newVal
      }
    },
    completed: {
      get () {
        return this.formModel.completed
      },
      set (newVal) {
        this.formModel.completed = newVal
      }
    },
    sum () {
      return this.refund - this.rebate
    },
    sumClassObj () {
      return {
        'bg-gray-400': this.sum === 0,
        'bg-yellow-400': this.sum > 0 && !this.completed,
        'bg-green-400': this.sum > 0 && this.completed,
        'bg-blue-400': this.sum < 0 && !this.completed,
        'bg-red-400': this.sum < 0 && this.completed
      }
    },
    deliveryContact: {
      get () {
        return this.formModel.deliveryContact
      },
      set (newVal) {
        this.formModel.deliveryContact = newVal
      }
    },
    secondDeliveryContact: {
      get () {
        return this.formModel.secondDeliveryContact
      },
      set (newVal) {
        this.formModel.secondDeliveryContact = newVal
      }
    },
    dateFiled: {
      get () {
        return this.formModel.dateFiled
      },
      set (newVal) {
        this.formModel.dateFiled = newVal
      }
    },
    filingType () {
      return this.filing.filingType
    },
    debounceUpdate () {
      return debounce(this.handleUpdate, 500)
    },
    taxFormOptions () {
      return this.valueTypes.tax_form.filter(taxForm => taxForm.show)
    },
    statusOptions () {
      if (this.filingType === filingTypes.fbar) {
        return this.valueTypes.fbar_status.filter(status => status.show)
      } else if (this.filingType === filingTypes.state) {
        return this.valueTypes.state_status.filter(status => status.show)
      } else {
        return this.valueTypes.tax_year_status.filter(status => status.show)
      }
    },
    statusDetailOptions () {
      const parentId = this.statusOptions.find(statusOption => statusOption.value === this.formModel.status)?.id
      if (this.filingType === filingTypes.fbar) {
        return this.valueTypes.fbar_status_detail.filter((status) => {
          if (this.formModel.status) {
            return status.show && status.parentId === parentId
          } else {
            return status.show
          }
        })
      } else if (this.filingType === filingTypes.state) {
        return this.valueTypes.state_status_detail.filter((status) => {
          if (this.formModel.status) {
            return status.show && status.parentId === parentId
          } else {
            return status.show
          }
        })
      } else {
        return this.valueTypes.tax_year_status_detail.filter((status) => {
          if (this.formModel.status) {
            return status.show && status.parentId === parentId
          } else {
            return status.show
          }
        })
      }
    },
    fileTypeOptions () {
      return this.valueTypes.file_type.filter(fileType => fileType.show)
    },
    contactTypeOptions () {
      return this.valueTypes.contact_type.filter(contactType => contactType.show)
    }
  },
  watch:
  {
    filing: {
      handler () {
        this.formModel = JSON.parse(JSON.stringify(this.filing))
      },
      deep: true
    }
  },
  created () {
    this.formModel = JSON.parse(JSON.stringify(this.filing))
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
    handleUpdate () {
      this.$api.updateFiling(this.headers, { clientId: this.selectedClient.id, filingId: this.filing.id }, this.formModel)
    }
  }
}
</script>

<style scoped>

</style>
