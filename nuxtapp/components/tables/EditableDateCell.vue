<template>
  <div :class="isEditable ? 'edit-mode' : 'read-mode'">
    <input
      v-if="isEditable"
      ref="input"
      v-model="computedValue"
      type="date"
      @blur="onBlur"
    >
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
  updated () {
    if (this.isEditable) {
      this.$refs.input.focus()
      this.$refs.input.select()
    }
  },
  methods: {
    formatDate (date) {
      return date ? formatDateForTable(date) : ''
    },
    onBlur () {
      this.$emit(events.blur)
    }
  }
}
</script>

<style scoped>
input {
  @apply w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded text-xs p-0 absolute top-0;
}

.edit-mode {
  @apply relative z-10 overflow-visible -mt-1;
}

.read-mode {
  @apply overflow-hidden overflow-ellipsis;
}
</style>
