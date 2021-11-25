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
      <div class="absolute inset-y-0 right-0 pr-2 flex items-center">
        <CloseIcon class="h-4 w-4 bg-gray-500 rounded-full cursor-pointer text-white " @click="onClearClick" />
      </div>
    </div>
  </div>
</template>

<script>
import { events, tabs } from '~/shared/constants'
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
      default: tabs.logs
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
      return `Search ${this.activeTab.replace('-', ' ')}`
    }
  },
  methods: {
    onClearClick () {
      this.computedValue = ''
    }
  }
}
</script>

<style scoped>

</style>
