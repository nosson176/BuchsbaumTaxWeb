<template>
  <div ref="div" :class="showEditMode ? 'edit-mode' : 'read-mode'">
    <div v-if="isEditable" class="fixed w-screen h-screen top-0 left-0 z-10" @click.stop>
      <div class="h-full" @click="onBlur" />
    </div>
    <input v-if="showEditMode" ref="input" v-model="editModeValue" autofocus type="text"
      class="block w-full shadow-sm m-0 border-transparent outline-none border focus:border-indigo-500 text-xs p-0 absolute top-0 pl-px min-h-full z-20"
      tabindex="0" :placeholder="placeholder" @keydown.enter="emitEnter" @input="onInput" />
    <span v-else class="cursor-pointer">{{ readModeValue || '' }}</span>
  </div>
</template>

<script>
import { events } from '~/shared/constants'
import { formatAsNumber } from '~/shared/utility'

export default {
  name: 'EditableInputCell',
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    isEditable: {
      type: Boolean,
      required: true,
    },
    currency: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    rounded: {
      type: Boolean,
      default: false,
    },
    selectAll: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      hasEdited: false,
    }
  },
  computed: {
    editModeValue: {
      get() {
        // In edit mode, show the original precise value
        return this.value
      },
      set(newVal) {
        if (this.currency || this.rounded) {
          // Ensure numbers are always parsed correctly
          const parsedValue = parseFloat(String(newVal).replace(/,/g, '')) || 0
          this.$emit(events.input, parsedValue)
        } else {
          // Allow text input without formatting
          this.$emit(events.input, newVal)
        }
      },
    },
    readModeValue() {
      // In read mode, apply rounding if specified
      if (this.currency || this.rounded) {
        const value = parseFloat(this.value) || 0
        return formatAsNumber(Math.round(value))
      }
      // If not a number, return the raw value (text input case)
      return this.value ?? ''
    },
    showEditMode() {
      return this.isEditable && !this.readonly
    },
  },
  updated() {
    if (this.showEditMode && !this.hasEdited && this.$refs.input) {
      // If no value has been edited, select the entire input
      this.$refs.input.select()
    } else if (this.showEditMode && this.hasEdited) {
      // If value has been edited, just focus without selecting
      this.$refs.input.focus()
    }
  },
  methods: {
    onBlur(event) {
      this.$emit(events.blur, event)
    },
    emitEnter() {
      this.$emit(events.submit)
    },
    onInput() {
      if (!this.hasEdited) {
        this.hasEdited = true // Once typing starts, don't select all
      }
    },
  },
}
</script>

<style scoped>
.edit-mode {
  @apply relative z-10 overflow-visible -mt-2.5 outline-none w-full;
}

.read-mode {
  @apply overflow-hidden overflow-ellipsis border-transparent outline-none border-2 focus:border-blue-600;
}

input::placeholder {
  @apply italic text-gray-600;
}
</style>