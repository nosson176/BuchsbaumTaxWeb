<template>
  <div>
    <button
      type="button"
      class="relative inline-flex flex-shrink-0 h-3 w-5 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      :class="computedValue ? 'bg-indigo-600' : 'bg-gray-200'"
      role="switch"
      :aria-checked="computedValue"
      aria-labelledby="view-active"
      @click="onClick"
    >
      <span
        class="pointer-events-none relative inline-block h-2 w-2 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
        :class="computedValue ? 'translate-x-2' : 'translate-x-0'"
      >
        <span
          class="absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
          :class="computedValue ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200'"
          aria-hidden="true"
        >
          <svg class="h-1 w-1 text-gray-400" fill="none" viewBox="0 0 12 12">
            <path
              d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <span
          class="absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
          :class="computedValue ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100'"
          aria-hidden="true"
        >
          <svg class="h-1 w-1 text-indigo-600" fill="currentColor" viewBox="0 0 12 12">
            <path
              d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z"
            />
          </svg>
        </span>
      </span>
    </button>
  </div>
</template>

<script>
import { events } from '~/shared/constants'
export default {
  name: 'ToggleButton',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    computedValue: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit(events.input, value)
      },
    },
  },
  methods: {
    onClick() {
      this.computedValue = !this.value
    },
  },
}
</script>

<style scoped></style>
