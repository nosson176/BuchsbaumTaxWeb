<template>
  <div :class="isEditable ? 'edit-mode' : 'read-mode'" @keydown.prevent="onKeyPress" @keyup.prevent="onKeyUp">
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
        v-if="showOptions && isEditable"
        ref="select"
        class="absolute z-10 w-auto bg-white max-h-32 text-base shadow-md overflow-auto transition ease-in duration-100 focus:outline-none m-0 p-0"
        :class="showOptions && isEditable ? 'opacity-100' : 'opacity-0'"
        tabindex="-1"
        role="listbox"
        aria-labelledby="listbox-label"
        aria-activedescendant="listbox-option-3"
        @blur="onBlur"
      >
        <li
          v-for="(option, idx) in sortedOptions"
          :id="idx"
          :key="idx"
          ref="option"
          class="text-xs cursor-default select-none relative py-0 pl-0 pr-1"
          :class="hoverIndex === idx ? 'text-white bg-indigo-600' : 'text-gray-900'"
          role="option"
          @mouseover="onMouseOver(idx)"
          @click.stop="emitChange(option.value)"
        >
          <span class="ml-4 block truncate" :class="isSelected(option) ? 'font-semibold' : 'font-normal'">
            {{ option.value }}
          </span>
          <span v-if="isSelected(option)" class="text-indigo-600 absolute inset-y-0 left-0 flex items-center p-0">
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

const MULT = 'MULTI'

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
      shiftActive: false,
      hoverIndex: 0,
      mouseMode: false
    }
  },
  computed: {
    computedValue: {
      get () {
        let selected = []
        if (this.splitOptions[0] === MULT) {
          selected = this.splitOptions.slice(1)
        } else {
          selected = this.splitOptions
        }
        return selected
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
      return this.splitOptions[0] || this.placeholder
    },
    sortedOptions () {
      const optionsCopy = [...this.options]
      return optionsCopy.sort((a, b) => {
        if (this.isSelected(a) && !this.isSelected(b)) {
          return -1
        }
        if (!this.isSelected(a) && this.isSelected(b)) {
          return 1
        }
        return 0
      })
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
        this.computedValue.push(value)
      } else {
        this.computedValue = value
        this.onBlur()
      }
    },
    isSelected ({ value }) {
      return this.computedValue.includes(value)
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
      } else if (evt.key === 'Enter') {
        this.emitChange(this.options[this.hoverIndex].value)
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
    onKeyUp (evt) {
      if (evt.key === 'Shift') {
        this.shiftActive = false
        this.computedValue.unshift(MULT)
        this.computedValue = this.computedValue.join('\u000B')
        this.onBlur()
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
.edit-mode {
  @apply relative z-10 overflow-visible min-h-full outline-none;
}

.read-mode {
  @apply overflow-hidden overflow-ellipsis m-px outline-none;
}
</style>
