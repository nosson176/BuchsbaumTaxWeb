<template>
  <div :class="isEditable ? 'edit-mode' : 'read-mode'">
    <textarea
      v-if="isEditable"
      ref="input"
      v-model="computedValue"
      tabindex="0"
      :placeholder="placeholder"
      @blur="onBlur"
      @keydown.tab.prevent
    />
    <span v-else tabindex="0" class="cursor-pointer">{{ computedValue || placeholder }}</span>
  </div>
</template>

<script>
import { events } from '~/shared/constants'

export default {
  name: 'EditableTextArea',
  props: {
    value: {
      type: String,
      default: ''
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
  computed: {
    computedValue: {
      get () {
        return this.value
      },
      set (newVal) {
        this.$emit(events.input, newVal)
      }
    }
  },
  updated () {
    if (this.isEditable) {
      this.$refs.input.focus()
    }
  },
  methods: {
    onBlur () {
      this.$emit(events.blur)
    }
  }
}
</script>

<style scoped>
textarea {
  @apply text-xs shadow-sm block w-full m-0 border-transparent outline-none border focus:border-indigo-500 min-h-full;

  resize: none;
}

.edit-mode {
  @apply overflow-visible outline-none;
}

.read-mode {
  @apply overflow-hidden overflow-ellipsis border-transparent outline-none border focus:border-indigo-500;
}
</style>
