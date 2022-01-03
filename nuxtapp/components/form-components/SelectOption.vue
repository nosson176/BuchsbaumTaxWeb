<template>
  <div>
    <div class="mt-1 relative" @keydown.prevent="onKeyPress">
      <button
        type="button"
        class="bg-white text-xs text-gray-900 relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        aria-haspopup="listbox"
        aria-expanded="true"
        aria-labelledby="listbox-label"
        @click="toggleShowOptions"
      >
        <span class="block truncate">
          {{ shownValue || computedValue }}
        </span>
        <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <!-- Heroicon name: solid/selector -->
          <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
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
            v-for="(option, idx) in options"
            id="listbox-option-0"
            :key="option.id"
            ref="option"
            class="cursor-default select-none relative bg-white py-2 pl-3 pr-9"
            :class="hoverIndex === idx ? 'text-white bg-indigo-600' : 'text-gray-900'"
            role="option"
            @mouseover="onMouseOver(idx)"
            @click="setSelectOption(option)"
          >
            <span :class="[option.selected ? 'font-semibold' : 'font-normal','block truncate']">
              {{ option.value }}
            </span>
            <span v-if="option.selected" class="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4 hover:text-white">
              <!-- Heroicon name: solid/check -->
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
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
    },
    shownValue: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showOptions: false,
      hoverIndex: 0
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
    onKeyPress (evt) {
      if (evt.key === 'Enter') {
        this.computedValue = this.options[this.hoverIndex].value
      } else if (evt.key === 'ArrowDown') {
        if (this.hoverIndex < this.options.length - 1) {
          this.hoverIndex++
          this.scrollSelectedIntoView()
        }
      } else if (evt.key === 'ArrowUp') {
        if (this.hoverIndex > 0) {
          this.hoverIndex--
          this.scrollSelectedIntoView()
        }
      }
    },
    onMouseOver (idx) {
      this.hoverIndex = idx
    },
    scrollSelectedIntoView () {
      if (this.$refs.option) {
        if (this.$refs.option[this.hoverIndex]) {
          this.$refs.option[this.hoverIndex].scrollIntoView({
            block: 'center'
          })
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
