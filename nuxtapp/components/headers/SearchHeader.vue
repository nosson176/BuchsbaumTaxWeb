<template>
  <div>
    <div class="mt-1 relative rounded-md shadow-sm">
      <input
        :id="id"
        v-model="computedValue"
        type="text"
        :name="name"
        class="focus:ring-indigo-500 focus:border-indigo-500 block w-full py-0.5 pr-10 sm:text-sm border-gray-300 rounded-full"
        :placeholder="placeholder"
      >
      <div class="absolute inset-y-0 right-0 pr-2 flex items-center cursor-pointer" @click="onClearClick">
        <div class="flex justify-center items-center rounded-full bg-gray-500 text-white w-4 h-4 leading-tight text-center" tabindex="0" @click="emitClick" @keypress.enter="emitClick">
          <CloseIcon class="w-3 h-3" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { events } from '~/shared/constants'
import { capitalizeFirstLetter } from '~/shared/utility'
export default {
  name: 'SearchHeader',
  props: {
    value: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: 'search-input'
    },
    name: {
      type: String,
      default: 'search-input'
    },
    activeTab: {
      type: String,
      default: ''
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
    },
    placeholder () {
      const tabName = capitalizeFirstLetter(this.activeTab.replace('-', ' '))
      return `Search ${tabName}`
    }
  },
  methods: {
    onClearClick () {
      this.computedValue = ''
      this.$emit(events.click)
    }
  }
}
</script>

<style scoped>

</style>
