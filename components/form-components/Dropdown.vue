<!-- <template>
  <div class="relative inline-block text-left">
    <div>
      <button id="menu-button" type="button"
        class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-1 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
        aria-expanded="true" aria-haspopup="true" @click="toggleShowOptions">
        {{ shownValue || computedValue }}
        <svg class="-mr-1 ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
          aria-hidden="true">
          <path fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd" />
        </svg>
      </button>
    </div>
    <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="showOptions"
        class="z-50 origin-top-right absolute left-0 mt-2 h-64 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none"
        role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
        <div class="py-1 overflow-hidden" role="none">
          <a v-for="(option, idx) in options" :id="`menu-item-${idx}`" :key="option.id" href="#"
            class="text-gray-700 block px-4 py-2 text-xs hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
            role="menuitem" tabindex="-1" @click="setSelectOption(option)">
            {{ option.name || option.value || option }}
          </a>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { events } from '~/shared/constants'
export default {
  name: 'Dropdown',
  props: {
    value: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      default: () => [],
    },
    shownValue: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      showOptions: false,
    }
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
    toggleShowOptions() {
      this.showOptions = !this.showOptions
    },
    setSelectOption(option) {
      this.computedValue = option.value
      this.showOptions = false
    },
  },
}
</script>

<style scoped></style> -->
<template>
  <div class="relative inline-block text-left">
    <div ref="selectButton">
      <button id="menu-button" type="button"
        class="inline-flex mt-0 justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-1 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
        aria-expanded="true" aria-haspopup="true" @click="toggleShowOptions">
        {{ value || shownValue || computedValue }}
        <svg class="-mr-1 ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
          aria-hidden="true">
          <path fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd" />
        </svg>
      </button>
    </div>
    <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="showOptions"
        class="z-50 origin-top-right absolute left-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none"
        role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1"
        :style="{ width: optionsWidth, maxHeight: '16rem' }">
        <div class="py-1" role="none">
          <a v-for="(option, idx) in options" :id="`menu-item-${idx}`" :key="option.id || idx" href="#"
            class="text-gray-700 block px-4 py-2 text-xs hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
            role="menuitem" tabindex="-1" @click.prevent="setSelectOption(option)">
            {{ option.value ? (option.name || option.value || option) : ' ' }}

          </a>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { events } from '~/shared/constants'

export default {
  name: 'Dropdown',
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    options: {
      type: Array,
      default: () => [],
    },
    shownValue: {
      type: String,
      default: '',
    },
    showArrow: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      showOptions: false,
      optionsWidth: 'auto',
    }
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
    toggleShowOptions() {
      this.showOptions = !this.showOptions
      if (this.showOptions) {
        this.$nextTick(() => {
          this.calculateOptionsWidth()
        })
      }
    },
    setSelectOption(option) {
      this.computedValue = typeof option === 'object' ? option.value : option
      this.showOptions = false
    },
    calculateOptionsWidth() {
      const selectWidth = this.$refs.selectButton.offsetWidth
      const maxOptionWidth = Math.max(...this.options.map(option => {
        const text = option.name || option.value || option
        return this.getTextWidth(text)
      }))
      this.optionsWidth = `${Math.max(selectWidth, maxOptionWidth + 32)}px` // 32px for padding
    },
    getTextWidth(text) {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      context.font = getComputedStyle(this.$el).font
      return context.measureText(text).width
    },
  },
}
</script>
