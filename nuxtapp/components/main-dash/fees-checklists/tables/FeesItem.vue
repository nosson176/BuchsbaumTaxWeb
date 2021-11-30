<template>
  <div class="px-3 py-1 text-xs tracking-tighter h-auto border border-gray-300 border-opacity-0 hover:border-opacity-100" :class="classObj">
    <div class="flex flex-col space-y-1.5 justify-center">
      <div class="flex justify-between">
        <span class=" align-top">{{ count }}</span>
        <div class="flex flex-col">
          <div @click="setEditable('feeType')">
            <EditableSelectCell
              v-model="feeType"
              :is-editable="isEditable('feeType')"
              :options="feeTypeOptions"
              @blur="onBlur"
              @input="debounceUpdate"
            />
          </div>
          <div @click="setEditable('year')">
            <EditableSelectCell
              v-model="year"
              :is-editable="isEditable('year')"
              :options="yearOptions"
              @blur="onBlur"
              @input="debounceUpdate"
            />
          </div>
        </div>
        <div class="flex flex-col">
          <span :class="formModel.status ? '' : 'missing'">{{ status }}</span>
          <span :class="formModel.statusDetail ? '' : 'missing'"> {{ statusDetail }}</span>
        </div>
        <div class="flex items-center space-x-1">
          <CheckBoxToDisplayTrueFalse :checked="formModel.sum" />
          <div class="flex flex-col">
            <span>{{ manualAmount }}</span>
            <span> {{ paidAmount }}</span>
          </div>
        </div>
      </div>
      <div class="flex justify-between">
        <EditableCheckBoxCell v-model="include" />
        <div class="flex space-x-2">
          <span class="missing">Time</span>
          <span>{{ dateFee }}</span>
        </div>
        <div class="flex">
          <span :class="formModel.rate ? '' : 'missing'">{{ rate }}</span>
        </div>
      </div>
      <div class="flex">
        <span :class="formModel.notes ? '' : 'missing'">{{ notes }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { debounce } from 'lodash'
import { formatAsILCurrency } from '~/shared/utility'
import { events, models } from '~/shared/constants'
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
    feeType () {
      return this.formModel.feeType || 'Type'
    },
    year: {
      get () {
        return this.formModel.year || 'Year'
      },
      set (newVal) {
        this.formModel.year = newVal
      }
    },
    status: {
      get () {
        return this.formModel.status || 'Status'
      },
      set (newVal) {
        this.formModel.status = newVal
      }
    },
    statusDetail: {
      get () {
        return this.formModel.statusDetail || 'Detail'
      },
      set (newVal) {
        this.formModel.statusDetail = newVal
      }
    },
    manualAmount: {
      get () {
        return this.formatAsILS(this.formModel.manualAmount)
      },
      set (newVal) {
        this.formModel.manualAmount = newVal
      }
    },
    paidAmount: {
      get () {
        return this.formatAsILS(this.formModel.paidAmount)
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
        return this.formModel.rate || 'Rate/hr'
      },
      set (newVal) {
        this.formModel.rate = newVal
      }
    },
    notes: {
      get () {
        return this.formModel.notes || 'Notes'
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
    yearOptions () {
      return this.valueTypes.year_name.filter(year => year.show)
    },
    feeTypeOptions () {
      return this.valueTypes.fee_type.filter(feeType => feeType.show)
    },
    debounceUpdate () {
      return debounce(this.handleUpdate, 500)
    }
  },
  methods: {
    formatAsILS (amt) {
      return formatAsILCurrency(amt)
    },
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
    }
  }
}
</script>

<style scoped>
.missing {
  @apply italic opacity-75;
}
</style>
