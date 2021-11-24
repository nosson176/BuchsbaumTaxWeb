<template>
  <div :class="isEditable ? 'edit-mode' : 'read-mode'">
    <textarea v-if="isEditable" ref="input" v-model="computedValue" @blur="onBlur" @keydown.tab.prevent />
    <span v-else class="cursor-pointer">{{ computedValue }}</span>
  </div>
</template>

<script>
import { events } from '~/shared/constants'

export default {
  name: 'EditableTextAreaCell',
  props: {
    value: {
      type: String,
      default: ''
    },
    isEditable: {
      type: Boolean,
      required: true
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
  @apply text-xs shadow-sm block w-full m-0 focus:ring-indigo-500 focus:border-indigo-500  border border-gray-300 rounded absolute top-0;

  resize: none;
}

.edit-mode {
  @apply relative z-10 overflow-visible -mt-2.5;
}

.read-mode {
  @apply overflow-hidden overflow-ellipsis;
}
</style>
