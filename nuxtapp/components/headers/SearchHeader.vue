<template>
  <div>
    <div class="mt-1 relative rounded-md shadow-sm">
      <input :id="id" type="text" :name="name" class="focus:ring-indigo-500 focus:border-indigo-500 block w-full py-0.5 pr-10 sm:text-sm border-gray-300 rounded-full" placeholder="Search">
      <div class="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
        <CloseIcon class="h-4 w-4 bg-gray-500 rounded-full text-white" />
      </div>
    </div>
  </div>
</template>

<script>
import { events } from '~/shared/constants'
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
  }
}
</script>

<style scoped>

</style>
