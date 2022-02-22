<template>
  <div :class="isEditable ? 'edit-mode' : 'read-mode'">
    <textarea
      v-if="isEditable"
      ref="input"
      v-model="computedValue"
      tabindex="0"
      class="resize-none text-xs shadow-sm block w-full m-0 border-transparent outline-none border focus:border-indigo-500 absolute top-0 min-h-full"
      @blur="onBlur"
      @keydown.tab.prevent
    />
    <span v-else tabindex="0" class="cursor-pointer" :class="computedValue ? '' : 'text-gray-400 italic'">
      {{ computedValue || placeholder }}
    </span>
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
.edit-mode {
  @apply relative z-10 overflow-visible -mt-3 outline-none h-8;
}

.read-mode {
  @apply overflow-hidden overflow-ellipsis border-transparent outline-none border focus:border-indigo-500 h-5;
}
</style>