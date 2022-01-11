<template>
  <div class="grid grid-cols-12 gap-2 items-center px-1" :class="even ? 'bg-white' : 'bg-gray-100'">
    <div class="col-span-1">
      <Input v-model="groupNum" />
    </div>
    <div class="col-span-5">
      <HeaderSelectOption v-model="fieldName" :options="searchOptions" />
    </div>
    <div class="col-span-2">
      <HeaderSelectOption v-model="operator" :options="operators" />
    </div>
    <div class="col-span-3">
      <Input v-model="searchValue" />
    </div>
    <div class="col-span-1">
      <DeleteButton />
    </div>
  </div>
</template>

<script>
import { events, searchOptions, operators } from '~/shared/constants'

export default {
  name: 'SmartviewLine',
  props: {
    line: {
      type: Object,
      required: true
    },
    idx: {
      type: Number,
      default: 0
    }
  },
  computed: {
    computedLine: {
      get () {
        return this.line
      },
      set (newVal) {
        this.$emit(events.input, { newVal, idx: this.idx })
      }
    },
    groupNum: {
      get () {
        return this.computedLine.groupNum
      },
      set (newVal) {
        this.computedLine = Object.assign({}, this.computedLine, { groupNum: newVal })
      }
    },
    fieldName: {
      get () {
        return this.computedLine.fieldName
      },
      set (newVal) {
        this.computedLine = Object.assign({}, this.computedLine, { fieldName: newVal })
      }
    },
    operator: {
      get () {
        return this.computedLine.operator
      },
      set (newVal) {
        this.computedLine = Object.assign({}, this.computedLine, { operator: newVal })
      }
    },
    searchValue: {
      get () {
        return this.computedLine.searchValue
      },
      set (newVal) {
        this.computedLine = Object.assign({}, this.computedLine, { searchValue: newVal })
      }
    },
    searchOptions () {
      return searchOptions.map((option) => {
        if (option.value) {
          return {
            name: option.name,
            value: option.name
          }
        }
        return {}
      })
    },
    operators () {
      return operators
    },
    even () {
      return this.idx % 2 === 0
    }
  }
}
</script>

<style scoped>

</style>
