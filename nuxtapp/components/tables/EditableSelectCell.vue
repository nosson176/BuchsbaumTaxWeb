<template>
  <div :class="isEditable ? 'edit-mode' : 'read-mode'" @keydown="onKeyPress" @keyup="onKeyUp">
    <div v-if="isEditable" class="relative m-0">
      <button
        type="button"
        class="p-0 text-xs relative w-auto bg-white border border-gray-300 py-0 text-left cursor-pointer focus:outline-none focus:border-indigo-500"
        aria-haspopup="listbox"
        aria-expanded="true"
        aria-labelledby="listbox-label"
        @click="onButtonClick"
      >
        <span class="block truncate mr-3">
          {{ shownValue }}
        </span>
        <span class="absolute inset-y-0 right-0 flex items-center pointer-events-none">
          <!-- Heroicon name: solid/selector -->
          <svg class="h-3 w-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </span>
      </button>
      <ul
        v-if="showOptions"
        ref="select"
        class="absolute z-10 w-auto bg-white max-h-60 text-base ring-1 ring-black ring-opacity-5 overflow-auto transition ease-in duration-100 focus:outline-none"
        :class="isEditable ? 'opacity-100' : 'opacity-0'"
        tabindex="-1"
        role="listbox"
        aria-labelledby="listbox-label"
        aria-activedescendant="listbox-option-3"
        @blur="onBlur"
      >
        <li
          v-for="(option, idx) in options"
          :id="idx"
          :key="idx"
          class="text-gray-900 text-xs cursor-default select-none relative py-0 pl-0 pr-1 hover:text-white hover:bg-indigo-600"
          role="option"
          @click="emitChange(option.value)"
        >
          <span class="ml-4 block truncate" :class="isSelected(option) ? 'font-semibold' : 'font-normal'">
            {{ option.value }}
          </span>
          <span v-if="isSelected(option)" class="text-indigo-600 absolute inset-y-0 left-0 flex items-center p-0 hover:text-white">
            <!-- Heroicon name: solid/check -->
            <svg class="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </span>
        </li>
      </ul>
    </div>
    <span v-else class="cursor-pointer">{{ shownValue }}</span>
  </div>
</template>

<script>
import { events } from '~/shared/constants'

const MULT = 'MULT'

export default {
  name: 'EditableSelectCell',
  props: {
    value: {
      type: String,
      default: ''
    },
    isEditable: {
      type: Boolean,
      required: true
    },
    options: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      showOptions: false,
      shiftActive: false
    }
  },
  computed: {
    computedValue: {
      get () {
        if (this.multiple) {
          let selected = []
          if (this.splitOptions[0] === MULT) {
            selected = this.splitOptions.slice(1)
          } else {
            selected = this.splitOptions
          }
          return selected
        } else {
          return this.value
        }
      },
      set (newVal) {
        this.$emit(events.input, newVal)
      }
    },
    multiple () {
      return this.splitOptions.length > 1
    },
    splitOptions () {
      return this.value.split('\u000B')
    },
    shownValue () {
      if (this.multiple) {
        return this.splitOptions[0]
      } else {
        return this.computedValue
      }
    }
  },
  watch: {
    async isEditable (val) {
      if (!val) {
        this.showOptions = false
      } else {
        this.showOptions = true
        await this.$nextTick(() => {
          this.$refs.select.focus()
        })
      }
    }
  },
  methods: {
    emitChange (value) {
      if (this.shiftActive) {
        this.computedValue = this.computedValue.join('\u000B').concat('\u000B' + value)
      } else {
        this.computedValue = value
      }
      this.onBlur()
    },
    isSelected ({ value }) {
      if (this.multiple) {
        return this.computedValue.includes(value)
      } else {
        return this.computedValue === value
      }
    },
    onBlur () {
      this.showOptions = false
      this.$emit(events.blur)
    },
    onButtonClick () {
      this.showOptions = !this.showOptions
    },
    onKeyPress (evt) {
      if (evt.key === 'Shift') {
        this.shiftActive = true
      }
    },
    onKeyUp (evt) {
      if (evt.key === 'Shift') {
        this.shiftActive = false
      }
    }
  }
}
</script>

<style scoped>
.edit-mode {
  @apply relative z-10 overflow-visible;
}

.read-mode {
  @apply overflow-hidden overflow-ellipsis;
}
</style>
