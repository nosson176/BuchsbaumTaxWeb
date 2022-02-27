<template>
  <div>
    <div class="px-3 py-1 text-xs tracking-tighter my-auto h-32 border border-gray-300 border-opacity-0 hover:border-opacity-100" :class="classObj">
      <div class="flex h-full flex-col space-y-1.5 justify-center">
        <div class="flex justify-end pt-1">
          <DeleteButton small @click="onDeleteClick()" />
        </div>
        <div class="flex justify-between">
          <div class="flex flex-col w-1/3">
            <div @click="setEditable('feeType')">
              <EditableSelectCell
                v-model="feeType"
                placeholder="Type"
                :is-editable="isEditable('feeType')"
                :options="feeTypeOptions"
                @blur="onBlur"
                @input="debounceUpdate"
              />
            </div>
            <div :class="isRedBG ? 'bg-red-100' : ''" @click="setEditable('year')">
              <EditableSelectCell
                v-model="year"
                placeholder="Year"
                :is-editable="isEditable('year')"
                :options="yearOptions"
                @blur="onBlur"
                @input="debounceUpdate"
              />
            </div>
          </div>
          <div class="flex flex-col w-1/3">
            <div @click="setEditable('status')">
              <EditableSelectCell
                v-model="status"
                placeholder="Status"
                :is-editable="isEditable('status')"
                :options="feeStatusOptions"
                @blur="onBlur"
                @input="debounceUpdate"
              />
            </div>
            <div @click="setEditable('statusDetail')">
              <EditableSelectCell
                v-model="statusDetail"
                placeholder="Detail"
                :is-editable="isEditable('statusDetail')"
                :options="feeStatusDetailOptions"
                @blur="onBlur"
                @input="debounceUpdate"
              />
            </div>
          </div>
          <div class="flex items-center w-1/3 space-x-1">
            <div @click="setEditable('sum')">
              <EditableCheckBoxCell
                v-model="sum"
                placeholder="Sum"
                :is-editable="isEditable('sum')"
                @blur="onBlur"
                @input="debounceUpdate"
              />
            </div>
            <div class="flex flex-col">
              <div @click="setEditable('manualAmount')">
                <EditableInput
                  v-model="manualAmount"
                  placeholder="Amount"
                  currency
                  :is-editable="isEditable('manualAmount')"
                  @blur="onBlur"
                  @input="debounceUpdate"
                />
                <div v-if="isEditable('manualAmount')" />
              </div>
              <div @click="setEditable('paidAmount')">
                <EditableInput
                  v-model="paidAmount"
                  placeholder="Paid"
                  currency
                  :is-editable="isEditable('paidAmount')"
                  @blur="onBlur"
                  @input="debounceUpdate"
                />
                <div v-if="isEditable('paidAmount')" />
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-between">
          <div @click="setEditable('include')">
            <EditableCheckBoxCell
              v-model="include"
              :is-editable="isEditable('include')"
              @blur="onBlur"
              @input="debounceUpdate"
            />
          </div>
          <div class="flex space-x-2">
            <span class="missing">Time</span>
            <div @click="setEditable('dateFee')">
              <EditableDate
                v-model="dateFee"
                placeholder="Date"
                type="date"
                :is-editable="isEditable('dateFee')"
                @input="debounceUpdate"
                @blur="onBlur"
              />
            </div>
          </div>
          <div class="w-1/3">
            <div @click="setEditable('rate')">
              <EditableInput
                v-model="rate"
                :is-editable="isEditable('rate')"
                placeholder="Rate/hr"
                @blur="onBlur"
                @input="debounceUpdate"
              />
            </div>
          </div>
        </div>
        <div @click="setEditable('notes')">
          <EditableInput v-model="notes" placeholder="Notes" :is-editable="isEditable('notes')" @blur="onBlur" @input="debounceUpdate" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { debounce } from 'lodash'
import { events, models, currencySymbols } from '~/shared/constants'

export default {
  name: 'FeesItem',
  props: {
    fee: {
      type: Object,
      required: true
    },
    idx: {
      type: Number,
      default: NaN
    },
    isNew: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      editable: ''
    }
  },
  computed: {
    ...mapState([models.valueTypes, models.selectedClient]),
    classObj () {
      const even = this.idx % 2 === 0
      return { even }
    },
    formModel () {
      return {
        ...this.fee
      }
    },
    count () {
      return this.idx + 1
    },
    feeType: {
      get () {
        return this.formModel.feeType
      },
      set (newValue) {
        this.formModel.feeType = newValue
      }
    },
    year: {
      get () {
        return this.formModel.year
      },
      set (newVal) {
        this.formModel.year = newVal
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
    manualAmount: {
      get () {
        return this.formModel.manualAmount
      },
      set (newVal) {
        this.formModel.manualAmount = newVal
      }
    },
    paidAmount: {
      get () {
        return this.formModel.paidAmount
      },
      set (newVal) {
        this.formModel.paidAmount = newVal
      }
    },
    dateFee: {
      get () {
        return this.formModel.dateFee
      },
      set (newVal) {
        this.formModel.dateFee = newVal
      }
    },
    rate: {
      get () {
        return this.formModel.rate
      },
      set (newVal) {
        this.formModel.rate = newVal
      }
    },
    notes: {
      get () {
        return this.formModel.notes
      },
      set (newVal) {
        this.formModel.notes = newVal
      }
    },
    include: {
      get () {
        return this.formModel.include
      },
      set (newVal) {
        this.formModel.include = newVal
      }
    },
    sum: {
      get () {
        return this.formModel.sum
      },
      set (newVal) {
        this.formModel.sum = newVal
      }
    },
    yearOptions () {
      return this.valueTypes.year_name.filter(year => year.show)
    },
    feeTypeOptions () {
      return this.valueTypes.fee_type.filter(feeType => feeType.show)
    },
    feeStatusOptions () {
      return this.valueTypes.fee_status.filter(feeStatus => feeStatus.show)
    },
    feeStatusDetailOptions () {
      return this.valueTypes.fee_status_detail.filter((feeStatusDetail) => {
        const parentId = this.feeStatusOptions.find(statusOption => statusOption.value === this.formModel.status)?.id
        if (this.formModel.status) {
          return feeStatusDetail.parentId === parentId
        } else {
          return feeStatusDetail.show
        }
      })
    },
    debounceUpdate () {
      return debounce(this.handleUpdate, 500)
    },
    currencySymbols () {
      return currencySymbols
    },
    isRedBG () {
      return this.year === 'ITIN'
    }
  },
  watch: {
    fee: {
      handler () {
        if (this.isNew) {
          this.editable = 'feeType'
        }
      },
      deep: true
    }
  },
  methods: {
    setEditable (field) {
      this.editable = field
    },
    isEditable (field) {
      return this.editable === field
    },
    onBlur () {
      this.editable = ''
    },
    handleUpdate () {
      this.$emit(events.input, this.formModel)
    },
    onDeleteClick () {
      this.$emit(events.delete, this.fee.id)
    }
  }
}
</script>

<style scoped>
.missing {
  @apply italic text-gray-400;
}
</style>
