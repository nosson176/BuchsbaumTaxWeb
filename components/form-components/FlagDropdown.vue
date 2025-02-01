<template>
  <div>
    <div class="fixed w-screen h-screen top-0 left-0 z-10" @click.stop>
      <div class="h-full" @click="onBlur" />
    </div>
    <div class="relative m-0 p-0 z-20">
      <ul
        class="absolute z-10 bg-white max-h-32 text-base w-10 shadow-md overflow-auto transition ease-in duration-100 focus:outline-none m-0 p-0"
        tabindex="-1" role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-option-3"
        @click.stop @blur="onBlur">
        <li v-for="(option, idx) in options" :id="idx" :key="idx"
          class="flex items-center justify-start cursor-pointer select-none relative py-1 px-1 hover:bg-gray-300 space-x-1"
          role="option" @click="emitChange(option)">
          <FlagIcon v-if="option !== 11" class="h-4 w-4" :color="option" />
          <span v-else class="font-bold text-black text-xs">None</span> <!-- Display "None" in bold -->
          <div v-if="isSelected(option)" class="text-indigo-600 inset-y-0 flex items-center p-0">
            <!-- Heroicon name: solid/check -->
            <svg class="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
              aria-hidden="true">
              <path fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd" />
            </svg>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { events } from '~/shared/constants'

export default {
  name: 'FlagDropdown',
  props: {
    value: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      hoverIndex: -1,
      mouseMode: false,
    }
  },
  computed: {
    options() {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    },
    computedValue: {
      get() {
        return this.value || 4
      },
      set(newVal) {
        if (newVal) {
          this.$emit(events.input, newVal)
        }
      },
    },
  },
  methods: {
    emitChange(value) {
      console.log(value)
      this.computedValue = value
    },
    isSelected(value) {
      return this.computedValue === value
    },
    onBlur() {
      this.$emit(events.blur)
    },
    onMouseOver(idx) {
      this.hoverIndex = idx
    },
  },
}
</script>

<style scoped></style>
