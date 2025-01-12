<template>
  <div :class="isEditable ? 'edit-mode' : 'read-mode'">
    <div v-if="isEditable" ref="selectDiv" class="relative m-0 p-0 z-20" v-click-outside="handleClickOutside">
      <input ref="button" v-model="computedValue" type="number" tabindex="0"
        class="p-0 text-xs relative h-5 w-full bg-white text-gray-900 text-left cursor-pointer outline-none border-blue-600 border-2"
        @mousedown.stop="onButtonClick" @keyup.prevent="onInputKeyup($event.key)" />
      <ul v-if="showOptions" ref="select"
        class="absolute z-10 bg-white max-h-32 text-base w-10 shadow-md overflow-auto transition ease-in duration-100 focus:outline-none m-0 p-0"
        :class="showOptions ? 'opacity-100' : 'opacity-0'" tabindex="-1" role="listbox" aria-labelledby="listbox-label"
        aria-activedescendant="listbox-option-3" @click.stop @blur="onBlur">
        <li v-for="(option, idx) in priorityOptions" :id="idx" :key="idx" ref="option"
          class="flex items-center justify-start cursor-pointer select-none relative py-1 px-1 hover:bg-gray-300 space-x-1"
          role="option" @click="emitChange(option.value)">
          <div class="h-3 w-3 rounded-full" :class="priorityColor(option.value)" />
          <div v-if="isSelected(option)" class="text-indigo-600 inset-y-0 flex items-center p-0">
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
    <span v-else class="cursor-pointer m-px inline-flex justify-center items-center"
      :class="computedValue ? '' : 'text-gray-400 italic'">
      <div class="h-3 w-3 rounded-full" :class="priorityColor(computedValue)" />
    </span>
  </div>
</template>

<script>
import { events, priorityOptions } from '~/shared/constants'

export default {
  name: 'EditablePrioritySelectCell',
  directives: {
    'click-outside': {
      bind(el, binding, vnode) {
        el.clickOutsideEvent = function (event) {
          if (!(el === event.target || el.contains(event.target))) {
            vnode.context[binding.expression](event)
          }
        }
        document.addEventListener('mousedown', el.clickOutsideEvent)
      },
      unbind(el) {
        document.removeEventListener('mousedown', el.clickOutsideEvent)
      },
    },
  },
  props: {
    value: {
      type: Number,
      default: 0,
    },
    isEditable: {
      type: Boolean,
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      showOptions: false,
      hoverIndex: -1,
      mouseMode: false,
    }
  },
  computed: {
    computedValue: {
      get() {
        return this.value || ''
      },
      set(newVal) {
        if (newVal) {
          this.$emit(events.input, newVal)
        }
      },
    },
    priorityOptions() {
      return priorityOptions
    },
  },
  watch: {
    async isEditable(val) {
      if (!val) {
        this.showOptions = false
      } else {
        this.showOptions = true
        await this.$nextTick(() => {
          this.$refs.button.focus()
        })
      }
    },
  },
  methods: {
    handleClickOutside(event) {
      if (this.showOptions) {
        this.showOptions = false
        this.$refs.button?.blur()
        this.onBlur()
      }
    },
    priorityColor(priority) {
      return this.priorityOptions.find((option) => option.value === priority)?.color
    },
    emitChange(value) {
      this.computedValue = value
      this.showOptions = false
      this.onBlur()
    },
    isSelected({ value }) {
      return this.computedValue === value
    },
    onBlur() {
      this.$emit(events.blur)
    },
    onButtonClick(event) {
      event.preventDefault()
      event.stopPropagation()
      this.showOptions = !this.showOptions
    },
    onInputKeyup(key) {
      if (key === 'Enter') {
        this.onEnterPress()
      }
    },
    onEnterPress() {
      this.$emit(events.tab)
    },
    onMouseOver(idx) {
      this.hoverIndex = idx
    },
    scrollSelectedIntoView() {
      if (this.$refs.option) {
        if (this.$refs.option[this.hoverIndex]) {
          this.$refs.option[this.hoverIndex].scrollIntoView({
            block: 'center',
          })
        }
      }
    },
  },
}
</script>

<style scoped>
.edit-mode {
  @apply relative z-10 overflow-visible min-h-full outline-none;
}

.read-mode {
  @apply overflow-hidden overflow-ellipsis m-px outline-none;
}

.pink {
  @apply bg-pink-500;
}

.turquoise {
  background-color: #40E0D0
}

.green {
  @apply bg-green-500;
}

.blue {
  @apply bg-blue-200;
}

.yellow {
  @apply bg-yellow-200;
}

.red {
  @apply bg-red-500;
}

.orange {
  @apply bg-yellow-500;
}

.light-pink {
  @apply bg-pink-200;
}

.purple {
  @apply bg-purple-600;
}

.black {
  @apply bg-black;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;
}
</style>