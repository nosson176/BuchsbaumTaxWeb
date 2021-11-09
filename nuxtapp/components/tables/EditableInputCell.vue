<template>
  <div>
    <input v-if="isEditable" ref="input" v-model="computedValue" autofocus type="text">
    <span v-else class="cursor-pointer">{{ computedValue }}</span>
  </div>
</template>

<script>
import { events } from '~/shared/constants'
import { formatAsNumber } from '~/shared/utility'

export default {
  name: 'EditableInputCell',
  props: {
    value: {
      type: String,
      default: ''
    },
    isEditable: {
      type: Boolean,
      required: true
    },
    isCurrency: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    computedValue: {
      get () {
        if (this.isCurrency) {
          return formatAsNumber(this.value)
        }
        return this.value
      },
      set (newVal) {
        this.$emit(events.input, newVal)
      }
    }
  },
  updated () {
    if (this.isEditable) {
      this.$refs.input.focus()
    }
  },
  methods: {
    formatAsCurrency (amount) {
      return formatAsNumber(amount)
    }
  }
}
</script>

<style scoped>
input {
  @apply block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded text-xs p-0;
}
</style>
