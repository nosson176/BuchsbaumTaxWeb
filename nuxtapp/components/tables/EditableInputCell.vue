<template>
  <div :class="isEditable ? 'edit-mode' : 'read-mode'">
    <input
      v-if="isEditable"
      ref="input"
      v-model="computedValue"
      autofocus
      type="text"
      @blur="onBlur"
    >
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
      type: [String, Number],
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
    },
    onBlur () {
      this.$emit(events.blur)
    }
  }
}
</script>

<style scoped>
input {
  @apply block w-full shadow-sm m-0 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded text-xs p-0 absolute top-0;
}

.edit-mode {
  @apply relative z-10 overflow-visible -mt-2.5;
}

.read-mode {
  @apply overflow-hidden overflow-ellipsis;
}
</style>
