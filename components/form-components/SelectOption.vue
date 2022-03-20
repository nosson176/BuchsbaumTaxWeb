<template>
  <div>
    <div class="mt-1 relative">
      <button
        type="button"
        class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-1 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        aria-haspopup="listbox"
        aria-expanded="true"
        aria-labelledby="listbox-label"
        @click="toggleShowOptions"
      >
        <span class="block truncate">{{ computedValue }}</span>
        <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <!-- Heroicon name: solid/selector -->
          <svg
            class="h-3 w-3 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </button>
      <ul
        v-if="showOptions"
        class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
        tabindex="-1"
        role="listbox"
        aria-labelledby="listbox-label"
        aria-activedescendant="listbox-option-3"
      >
        <li
          v-for="(option, index) in options"
          id="listbox-option-0"
          :key="index"
          class="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 group hover:text-white hover:bg-indigo-600"
          role="option"
          @click="setSelectOption(option)"
        >
          <span
            class="block truncate"
            :class="isSelected(option) ? 'font-semibold' : 'font-normal'"
          >{{ option }}</span>
          <span
            v-if="isSelected(option)"
            class="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4 group-hover:text-white"
          >
            <!-- Heroicon name: solid/check -->
            <svg
              class="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { events } from '~/shared/constants'

export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      default: () => [],
    },
    label: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      showOptions: false,
    }
  },
  computed: {
    computedValue: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit(events.input, value);
      },
    },
  },
  methods: {
    toggleShowOptions () {
      this.showOptions = !this.showOptions
    },
    isSelected (option) {
      return this.computedValue === option
    },
    setSelectOption (option) {
      this.computedValue = option
      this.showOptions = false
    },
  },
}
</script>
