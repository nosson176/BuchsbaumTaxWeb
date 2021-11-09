<template>
  <div>
    <select
      v-if="isEditable"
      ref="select"
      name="category"
      class="mt-1 block w-full p-0 text-xs border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded"
      :multiple="multiple"
      @change="emitChange"
    >
      <option v-for="(option, idx) in options" :id="idx" :key="idx" :value="option.value" :selected="isSelected(option)">
        {{ option.value }}
      </option>
    </select>
    <span v-else class="cursor-pointer">{{ selectedOption }}</span>
  </div>
</template>

<script>
import { events } from '~/shared/constants'
export default {
  name: 'EditableSelectCell',
  props: {
    selectedOption: {
      type: String,
      default: ''
    },
    isEditable: {
      type: Boolean,
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  updated () {
    if (this.isEditable) {
      this.$refs.select.focus()
      this.$refs.select.click()
    }
  },
  methods: {
    emitChange (value) {
      this.$emit(events.change, value)
    },
    isSelected ({ value }) {
      return value === this.selectedOption
    }
    // splitMulti () {
    //   return value ? value.split('\u000B')[0] : []
    // },
    // selectedOptionsMulti () {
    //   const options = value ? value.split('\u000B')[1] : []
    //   options.shift()
    //   console.log(options)
    //   return options
    // }
  }
}
</script>

<style scoped>

</style>
