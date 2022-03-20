<template>
  <div>
    <div v-if="showOptions" class="fixed w-screen h-screen top-0 left-0 z-10" @click.stop>
      <div class="h-full" @click="onBlur" />
    </div>
    <div class="mt-1 relative">
      <div v-if="menu">
        <button
          id="menu-button"
          type="button"
          class="bg-gray-100 ml-1 rounded-full flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
          aria-expanded="true"
          aria-haspopup="true"
          @click="toggleShowOptions"
        >
          <span class="sr-only">Open options</span>
          <!-- Heroicon name: solid/dots-vertical -->
          <svg
            class="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
            />
          </svg>
        </button>
      </div>
      <div v-else>
        <input
          ref="filter"
          v-model="computedValue"
          type="text"
          class="bg-white text-xs text-gray-900 w-full border border-gray-300 rounded-md shadow-sm pl-0.5 pr-0.5 py-0.5 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          @keyup="onInputKeyup($event.key)"
          @click="onInputClick"
        />
        <span class="absolute inset-y-0 right-0 flex items-center pr-0 pointer-events-none">
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
      </div>
    </div>
    <transition
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <ul
        v-if="showOptions"
        class="absolute z-20 mt-1 w-auto bg-white text-xs shadow-lg rounded-md py-1 ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none"
        tabindex="-1"
        :class="short ? 'max-h-20' : 'max-h-60'"
        role="listbox"
        aria-labelledby="listbox-label"
        aria-activedescendant="listbox-option-3"
        @blur="onBlur"
      >
        <li
          v-for="(option, idx) in filteredOptions"
          id="listbox-option-0"
          ref="li"
          :key="option.id"
          :class="selectedItem(idx)"
          class="text-gray-900 cursor-default select-none relative bg-white py-px pl-3 pr-9 hover:text-white hover:bg-indigo-600"
          role="option"
          @click="setSelectOption(option)"
        >
          <span
            :class="[isSelected(option) ? 'font-semibold' : 'font-normal', 'block truncate']"
          >{{ option.name || option.value }}</span>
          <span
            v-if="isSelected(option)"
            class="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4 hover:text-white"
          >
            <!-- Heroicon name: solid/check -->
            <svg
              class="h-3 w-3"
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
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { events, models } from '~/shared/constants'
export default {
  name: 'HeaderSelectOption',
  props: {
    value: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    },
    menu: {
      type: Boolean,
      default: false
    },
    short: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showOptions: false,
      filterOptionsValue: '',
      selectedIdx: -1,
      keyboardMode: false
    }
  },
  computed: {
    ...mapState([models.selectedClient]),
    computedValue: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit(events.input, value)
        this.filterOptionsValue = value
      }
    },
    filteredOptions () {
      return this.options.filter((option) => {
        const nameFilter = option.name?.toLowerCase().includes(this.filterOptionsValue.toLowerCase())
        const valueFilter = option.value?.toLowerCase().includes(this.filterOptionsValue.toLowerCase())
        return nameFilter || valueFilter
      })
    },
    shownValue () {
      return this.options.find(option => option.value === this.value)?.name
    }
  },
  watch: {
    showOptions (value) {
      if (value) {
        this.$refs.filter?.focus()
      }
    },
    selectedClient (newVal, oldVal) {
      if (newVal.id !== oldVal.id) {
        this.computedValue = ''
      }
    }
  },
  methods: {
    onInputClick () {
      this.toggleShowOptions()
      this.$refs.filter?.focus()
    },
    toggleShowOptions () {
      this.showOptions = !this.showOptions
      this.selectedIdx = this.showOptions ? 0 : -1
    },
    setSelectOption (option) {
      this.filterOptionsValue = option.value
      this.computedValue = option.value
      this.showOptions = false
    },
    onBlur () {
      this.showOptions = false
    },
    isSelected (option) {
      if (option.value) {
        return option.value === this.computedValue
      }
    },
    onArrowDownPress () {
      this.keyboardMode = true
      if (!this.showOptions) {
        this.showOptions = true
      } else if (this.selectedIdx < this.filteredOptions.length - 1) {
        this.selectedIdx++
        this.$refs.li[this.selectedIdx]?.scrollIntoView()
      }
    },
    onArrowUpPress () {
      this.keyboardMode = true
      if (!this.showOptions) {
        this.showOptions = true
      } else if (this.selectedIdx > 0) {
        this.selectedIdx--
        this.$refs.li[this.selectedIdx]?.scrollIntoView()
      }
    },
    onEnterPress () {
      this.keyboardMode = true
      if (this.hoverIndex > -1) {
        this.setSelectOption(this.filteredOptions[this.selectedIdx] || this.computedValue)
      }
      this.selectedIdx = -1
      this.keyboardMode = false
    },
    onInputKeyup (key) {
      if (key === 'ArrowDown') {
        this.onArrowDownPress()
      } else if (key === 'ArrowUp') {
        this.onArrowUpPress()
      } else if (key === 'Enter') {
        this.onEnterPress()
      }
    },
    selectedItem (idx) {
      const keyboardHover = this.keyboardMode && this.selectedIdx === idx
      return { keyboardHover }
    }
  }
}

</script>

<style scoped>
.keyboardHover {
  @apply text-white bg-indigo-600;
}
</style>
