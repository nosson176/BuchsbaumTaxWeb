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
    <span v-else class="cursor-pointer">{{ shownValue }}</span>
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
    }
  },
  computed: {
    selected () {
      if (this.multiple) {
        const selected = this.splitOptions.slice(1)
        console.log(selected)
        return selected
      } else {
        return this.selectedOption
      }
    },
    multiple () {
      return this.splitOptions.length > 1
    },
    splitOptions () {
      return this.selectedOption.split('\u000B')
    },
    shownValue () {
      if (this.multiple) {
        return this.splitOptions[0]
      } else {
        return this.selectedOption
      }
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
      if (this.multiple) {
        return this.selected.includes(value)
      } else {
        return this.selected === value
      }
    },
    splitMulti (value) {
      return value ? value.split('\u000B')[0] : []
    }
  }
}
</script>

<style scoped>

</style>
