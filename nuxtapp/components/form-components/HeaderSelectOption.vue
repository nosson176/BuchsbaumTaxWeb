<template>
  <div>
    <div class="mt-1 relative" @blur="onBlur">
      <button
        type="button"
        class="bg-white text-xs text-gray-900 relative w-full border border-gray-300 rounded-md shadow-sm pl-1 pr-4 py-0.5 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        aria-haspopup="listbox"
        aria-expanded="true"
        aria-labelledby="listbox-label"
        @click="toggleShowOptions"
      >
        <span class="block truncate h-4">
          {{ shownValue || computedValue }}
        </span>
        <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <!-- Heroicon name: solid/selector -->
          <svg class="h-3 w-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </span>
      </button>
      <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <ul
          v-if="showOptions"
          class="absolute z-20 mt-1 w-auto bg-white text-xs shadow-lg max-h-60 rounded-md py-1 ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none"
          tabindex="-1"
          role="listbox"
          aria-labelledby="listbox-label"
          aria-activedescendant="listbox-option-3"
        >
          <li
            v-for="option in options"
            id="listbox-option-0"
            :key="option.id"
            class="text-gray-900 cursor-default select-none relative bg-white py-px pl-3 pr-9 hover:text-white hover:bg-indigo-600"
            role="option"
            @click="setSelectOption(option)"
          >
            <span :class="[isSelected(option) ? 'font-semibold' : 'font-normal','block truncate']">
              {{ option.name || option.value }}
            </span>
            <span v-if="isSelected(option)" class="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4 hover:text-white">
              <!-- Heroicon name: solid/check -->
              <svg class="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </span>
          </li>
        </ul>
      </transition>
    </div>
  </div>
</template>

<script>
import { events } from '~/shared/constants'
export default {
  name: 'SelectOption',
  props: {
    value: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      showOptions: false
    }
  },
  computed: {
    computedValue: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit(events.input, value)
      }
    },
    shownValue () {
      return this.options.find(option => option.value === this.value)?.name
    }
  },
  methods: {
    toggleShowOptions () {
      this.showOptions = !this.showOptions
    },
    setSelectOption (option) {
      this.computedValue = option.value
      this.showOptions = false
    },
    onBlur () {
      this.showOptions = false
    },
    isSelected (option) {
      return option.value === this.computedValue
    }
  }
}
</script>

<style scoped>

</style>
