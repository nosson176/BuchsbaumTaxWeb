<template>
  <div :class="isEditable ? 'edit-mode' : 'read-mode'">
    <div v-if="showOptions" class="fixed w-screen h-screen top-0 left-0 z-10" @click.stop>
      <div class="h-full" @click="onBlur" />
    </div>
    <div v-if="isEditable" ref="selectDiv" class="relative m-0 p-0">
      <input
        ref="button"
        v-model="inputValue"
        type="text"
        tabindex="0"
        class="p-0 text-xs relative h-5 w-full bg-white text-gray-900 text-left cursor-pointer outline-none border-blue-600 border-2"
        @click="onButtonClick"
        @keyup="onInputKeyup($event.key)"
      >
      <ul
        v-if="showOptions && isEditable"
        ref="select"
        class="absolute z-10 w-auto bg-white max-h-32 text-base shadow-md overflow-auto transition ease-in duration-100 focus:outline-none m-0 p-0"
        :class="showOptions && isEditable ? 'opacity-100' : 'opacity-0'"
        tabindex="-1"
        role="listbox"
        aria-labelledby="listbox-label"
        aria-activedescendant="listbox-option-3"
      >
        <li
          v-for="(option, idx) in filteredOptions"
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
    <span v-else class="cursor-pointer m-px" :class="computedValue[0] ? '' : 'text-gray-400 italic'">
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
      hoverIndex: -1,
      mouseMode: false,
      filterOptionsValue: ''
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
    inputValue: {
      get () {
        return this.showOptions ? this.filterOptionsValue : this.shownValue
      },
      set (value) {
        this.filterOptionsValue = value
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
    filteredOptions () {
      return this.options.filter((option) => {
        return option.value.toLowerCase().includes(this.filterOptionsValue.toLowerCase())
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
          this.$refs.button.focus()
          this.inputValue = ''
        })
      }
    }
  },
  mounted () {
    document.addEventListener('keydown', (e) => {
      if ((e.code === 'ShiftLeft' || e.code === 'ShiftRight') && this.isEditable) {
        this.onShiftPress()
      }
    })
    document.addEventListener('keyup', (e) => {
      if ((e.code === 'ShiftLeft' || e.code === 'ShiftRight') && this.isEditable) {
        this.onShiftUp()
      }
    })
  },
  methods: {
    emitChange (value) {
      if (this.shiftActive) {
        const isSelected = this.computedValue.includes(value)
        if (isSelected) {
          this.removeValue(value)
        } else {
          this.addValue(value)
        }
      } else {
        this.computedValue = value
        this.onBlur()
      }
    },
    removeValue (value) {
      const index = this.computedValue.indexOf(value)
      if (index > -1) {
        this.computedValue.splice(index, 1)
      }
    },
    addValue (value) {
      this.computedValue.push(value)
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
    onArrowDownPress () {
      if (this.hoverIndex < this.filteredOptions.length - 1) {
        this.hoverIndex++
        this.scrollSelectedIntoView()
      }
    },
    onArrowUpPress () {
      if (this.hoverIndex > 0) {
        this.hoverIndex--
        this.scrollSelectedIntoView()
      }
    },
    onEnterPress () {
      if (this.hoverIndex > -1) {
        this.emitChange(this.filteredOptions[this.hoverIndex].value)
      }
    },
    onShiftPress () {
      this.shiftActive = true
    },
    onShiftUp () {
      this.shiftActive = false
      this.computedValue.unshift(MULT)
      this.computedValue = this.computedValue.join('\u000B')
      this.onBlur()
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
