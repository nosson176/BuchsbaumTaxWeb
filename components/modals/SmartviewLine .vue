<template>
  <div class="grid grid-cols-12 gap-2 items-center px-1 h-8" :class="even ? 'bg-gray-50' : 'bg-gray-100'">
    <div class="col-span-1">
      <Input v-model="groupNum" />
    </div>
    <div class="col-span-5">
      <HeaderSelectOption v-model="fieldName" :options="smartviewOptions" />
    </div>
    <div class="col-span-2">
      <HeaderSelectOption v-model="operator" :options="operators" />
    </div>
    <div class="col-span-3">
      <Input v-model="searchValue" />
    </div>
    <div class="col-span-1">
      <DeleteButton @click="emitDelete" />
    </div>
  </div>
</template>

<script>
import { events, smartviewOptions, operators } from '~/shared/constants'

export default {
  name: 'SmartviewLine',
  props: {
    line: {
      type: Object,
      required: true,
    },
    idx: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    computedLine: {
      get() {
        return this.line
      },
      set(newVal) {
        this.$emit(events.input, { newVal, idx: this.idx })
      },
    },
    groupNum: {
      get() {
        return this.computedLine.groupNum || ''
      },
      set(newVal) {
        this.computedLine = Object.assign({}, this.computedLine, { groupNum: newVal })
      },
    },
    fieldName: {
      get() {
        return this.computedLine.fieldName
      },
      set(newVal) {
        this.computedLine = Object.assign({}, this.computedLine, { fieldName: newVal })
      },
    },
    operator: {
      get() {
        return this.computedLine.operator
      },
      set(newVal) {
        this.computedLine = Object.assign({}, this.computedLine, { operator: newVal })
      },
    },
    searchValue: {
      get() {
        return this.computedLine.searchValue
      },
      set(newVal) {
        this.computedLine = Object.assign({}, this.computedLine, { searchValue: newVal })
      },
    },
    smartviewOptions() {
      return smartviewOptions
    },
    operators() {
      return operators
    },
    even() {
      return this.idx % 2 === 0
    },
  },
  methods: {
    emitDelete() {
      this.$emit(events.delete, this.idx)
    },
  },
}
</script>

<style scoped></style>
