<template>
  <select name="category" class="mt-1 block w-full p-0.5 text-xs border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded" @change="emitChange">
    <option v-for="(option, idx) in options" :id="idx" :key="idx" :value="option.value" :selected="isSelected(option)">
      {{ option.value }}
    </option>
  </select>
</template>

<script>
import { events } from '~/shared/constants'
export default {
  name: 'CustomSelectElement',
  props: {
    options: {
      type: Array,
      default: () => []
    },
    selectedOption: {
      type: String,
      default: ''
    }
  },
  methods: {
    isSelected ({ value }) {
      return value === this.selectedOption
    },
    emitChange ({ target: { value } }) {
      this.$emit(events.change, value)
    }
  }
}
</script>

<style scoped>

</style>
