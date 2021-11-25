<template>
  <div>
    <input
      ref="checkbox"
      v-model="computedValue"
      autofocus
      type="checkbox"
      class="h-3 w-3 text-indigo-600 border-gray-300 rounded cursor-pointer"
    >
  </div>
</template>

<script>
import { events } from '~/shared/constants'
export default {
  name: 'EditableCheckBoxCell',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    isEditable: {
      type: Boolean,
      default: false
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
  watch: {
    isEditable (newValue) {
      if (newValue) {
        this.$refs.checkbox.focus()
      }
    }
  }
}
</script>

<style scoped>

</style>
