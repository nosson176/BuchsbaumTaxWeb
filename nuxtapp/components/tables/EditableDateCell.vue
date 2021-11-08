<template>
  <div>
    <input v-if="isEditable" v-model="computedValue" type="date">
    <span v-else class="cursor-pointer">{{ formatDate(computedValue) }}</span>
  </div>
</template>

<script>
import { events } from '~/shared/constants'
import { formatDateForTable } from '~/shared/domain-utilities'
export default {
  name: 'EditableDateCell',
  props: {
    value: {
      type: String,
      default: ''
    },
    isEditable: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    computedValue: {
      get () {
        return this.value
      },
      set (newVal) {
        this.$emit(events.input, newVal)
      }
    }
  },
  methods: {
    formatDate (date) {
      return date ? formatDateForTable(date) : ''
    }
  }
}
</script>

<style scoped>
input {
  @apply block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded text-xs p-0.5;
}
</style>
