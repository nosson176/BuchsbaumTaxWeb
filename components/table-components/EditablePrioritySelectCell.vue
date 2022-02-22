<template>
  <div :class="isEditable ? 'edit-mode' : 'read-mode'">
    <div v-if="isEditable" ref="selectDiv" class="relative m-0 p-0">
      <button
        ref="button"
        type="button"
        tabindex="0"
        class="p-0 text-xs relative h-5 w-full bg-white text-gray-900 text-left cursor-pointer outline-none border-blue-600 border-2"
        @click="onButtonClick"
      >
        <span class="block truncate mr-3">
          <div class="h-3 w-3 rounded-full" :class="priorityColor(computedValue)" />
        </span>
      </button>
      <ul
        v-if="showOptions"
        ref="select"
        class="absolute z-10 bg-white max-h-32 text-base w-10 shadow-md overflow-auto transition ease-in duration-100 focus:outline-none m-0 p-0"
        :class="showOptions ? 'opacity-100' : 'opacity-0'"
        tabindex="-1"
        role="listbox"
        aria-labelledby="listbox-label"
        aria-activedescendant="listbox-option-3"
        @blur="onBlur"
      >
        <li
          v-for="(option, idx) in priorityOptions"
          :id="idx"
          :key="idx"
          class="flex items-center justify-start cursor-pointer select-none relative py-1 px-1 hover:bg-gray-300 space-x-1"
          role="option"
          @click="emitChange(option.value)"
        >
          <div class="h-3 w-3 rounded-full" :class="priorityColor(option.value)" />
          <div v-if="isSelected(option)" class="text-indigo-600 inset-y-0 flex items-center p-0">
            <!-- Heroicon name: solid/check -->
            <svg class="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
        </li>
      </ul>
    </div>
    <span v-else class="cursor-pointer m-px inline-flex justify-center items-center" :class="computedValue ? '' : 'text-gray-400 italic'">
      <div class="h-3 w-3 rounded-full" :class="priorityColor(computedValue)" />
    </span>
  </div>
</template>

<script>
import { events, priorityOptions } from '~/shared/constants'

export default {
  name: 'EditablePrioritySelectCell',
  props: {
    value: {
      type: Number,
      default: 0
    },
    isEditable: {
      type: Boolean,
      required: true
    },
    placeholder: {
      type: String,
      default: ''
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
      set (newVal) {
        this.$emit(events.input, newVal)
      }
    },
    priorityOptions () {
      return priorityOptions
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
    priorityColor (priority) {
      return this.priorityOptions.find(option => option.value === priority)?.color
    },
    emitChange (value) {
      this.computedValue = value
      this.onBlur()
    },
    isSelected ({ value }) {
      return this.computedValue === value
    },
    onBlur () {
      this.showOptions = false
      this.$emit(events.blur)
    },
    onButtonClick () {
      this.showOptions = !this.showOptions
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

.pink {
  @apply bg-pink-500;
}

.green {
  @apply bg-green-200;
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

.black {
  @apply bg-black;
}
</style>