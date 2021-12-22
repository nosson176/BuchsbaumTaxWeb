<template>
  <div :class="isEditable ? 'edit-mode' : 'read-mode'" @keydown="onKeyPress" @keyup="onKeyUp">
    <div v-if="isEditable" ref="selectDiv" class="relative m-0 p-0">
      <button
        ref="button"
        type="button"
        tabindex="0"
        class="p-0 text-xs relative h-5 w-full bg-white text-gray-900 text-left cursor-pointer outline-none border-blue-600 border-2"
        @click="onButtonClick"
      >
        <span class="block truncate mr-3">
          {{ shownValue }}
        </span>
      </button>
      <ul
        v-if="showOptions"
        ref="select"
        class="absolute overflow-x-hidden z-10 w-auto bg-white max-h-32 text-base shadow-md overflow-auto transition ease-in duration-100 focus:outline-none m-0 p-0"
        :class="showOptions ? 'opacity-100' : 'opacity-0'"
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
    <span v-else class="cursor-pointer m-px" :class="computedValue ? '' : 'text-gray-400 italic'">
      {{ shownValue }}
    </span>
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
    },
    placeholder: {
      type: String,
      default: ''
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
        return this.computedValue || this.placeholder
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
  @apply relative z-10 overflow-visible min-h-full outline-none;
}

.read-mode {
  @apply overflow-hidden overflow-ellipsis m-px outline-none;
}
</style>
