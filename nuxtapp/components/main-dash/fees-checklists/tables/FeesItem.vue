<template>
  <div class="px-3 py-1 text-xs tracking-tighter h-16 cursor-pointer border border-gray-300 border-opacity-0 hover:border-opacity-100" :class="classObj">
    <div class="flex flex-col">
      <div class="flex justify-between">
        <span class=" align-top">{{ count }}</span>
        <div class="flex flex-col">
          <span :class="fee.feeType ? '' : 'missing'">{{ feeType }}</span>
          <span :class="fee.year ? '' : 'missing'"> {{ year }}</span>
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
        <div class="flex space-x-2">
          <span class="missing">Time</span>
          <span>{{ dateFee }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatAsILCurrency } from '~/shared/utility'
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

    }
  },
  computed: {
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
    }
  },
  methods: {
    formatAsILS (amt) {
      return formatAsILCurrency(amt)
    }
  }
}
</script>

<style scoped>
.missing {
  @apply italic opacity-75;
}
</style>
