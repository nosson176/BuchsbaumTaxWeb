<template>
  <div>
    <textarea v-if="isEditable" ref="input" v-model="computedValue" />
    <span v-else class="cursor-pointer">{{ computedValue }}</span>
  </div>
</template>

<script>
import { events } from '~/shared/constants'

export default {
  name: 'EditableTextAreaCell',
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
    }
  }
}
</script>

<style scoped>
textarea {
  @apply text-xs shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500  border border-gray-300 rounded;

  resize: none;
}
</style>
