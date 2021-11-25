<template>
  <div ref="div" tabindex="0" :class="showEditMode ? 'edit-mode' : 'read-mode'">
    <input
      v-if="showEditMode"
      ref="input"
      v-model="computedValue"
      autofocus
      type="text"
      class="block w-full shadow-sm m-0 border-transparent outline-none border focus:border-indigo-500 text-xs p-0 absolute top-0 text-center min-h-full"
      @blur="onBlur"
    >
    <span v-else class="cursor-pointer">{{ computedValue || '' }}</span>
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
      default: ''
    },
    isEditable: {
      type: Boolean,
      required: true
    },
    isCurrency: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    computedValue: {
      get () {
        if (this.isCurrency) {
          return formatAsNumber(this.value)
        }
        return this.value
      },
      set (newVal) {
        this.$emit(events.input, newVal)
      }
    },
    showEditMode () {
      return this.isEditable && !this.readonly
    }
  },
  updated () {
    if (this.isEditable) {
      if (this.readonly) {
        this.$refs.div.focus()
      } else {
        this.$refs.input.focus()
      }
    }
  },
  methods: {
    formatAsCurrency (amount) {
      return formatAsNumber(amount)
    },
    onBlur () {
      this.$emit(events.blur)
    }
  }
}
</script>

<style scoped>
.edit-mode {
  @apply relative z-10 overflow-visible -mt-2.5 outline-none;
}

.read-mode {
  @apply overflow-hidden overflow-ellipsis border-transparent outline-none border focus:border-indigo-500;
}
</style>
