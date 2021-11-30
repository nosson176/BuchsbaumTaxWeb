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
            />
          </div>
          <div @click="setEditable('year')">
            <EditableSelectCell
              v-model="year"
              :is-editable="isEditable('year')"
              :options="yearOptions"
              @blur="onBlur"
            />
          </div>
        </div>
        <div class="flex flex-col">
          <span :class="fee.status ? '' : 'missing'">{{ status }}</span>
          <span :class="fee.statusDetail ? '' : 'missing'"> {{ statusDetail }}</span>
        </div>
        <div class="flex items-center space-x-1">
          <CheckBoxToDisplayTrueFalse :checked="fee.sum" />
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
          <span :class="fee.rate ? '' : 'missing'">{{ rate }}</span>
        </div>
      </div>
      <div class="flex">
        <span :class="fee.notes ? '' : 'missing'">{{ notes }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { formatAsILCurrency } from '~/shared/utility'
import { models } from '~/shared/constants'
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
    ...mapState([models.valueTypes]),
    classObj () {
      const even = this.idx % 2 === 0
      return { even }
    },
    count () {
      return this.idx + 1
    },
    feeType () {
      return this.fee.feeType || 'Type'
    },
    year () {
      return this.fee.year || 'Year'
    },
    status () {
      return this.fee.status || 'Status'
    },
    statusDetail () {
      return this.fee.statusDetail || 'Detail'
    },
    manualAmount () {
      return this.formatAsILS(this.fee.manualAmount)
    },
    paidAmount () {
      return this.formatAsILS(this.fee.paidAmount)
    },
    dateFee () {
      return this.fee.dateFee
    },
    rate () {
      return this.fee.rate || 'Rate/hr'
    },
    notes () {
      return this.fee.notes || 'Notes'
    },
    include () {
      return this.fee.include
    },
    yearOptions () {
      return this.valueTypes.year_name.filter(year => year.show)
    },
    feeTypeOptions () {
      return this.valueTypes.fee_type.filter(feeType => feeType.show)
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
      console.log('blur')
      this.editable = ''
    }
  }
}
</script>

<style scoped>
.missing {
  @apply italic opacity-75;
}
</style>
