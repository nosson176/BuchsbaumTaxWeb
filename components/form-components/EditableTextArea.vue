<template>
  <div :class="isEditable ? 'edit-mode' : 'read-mode'">
    <textarea v-if="isEditable" ref="input" v-model="computedValue"
      class="text-xs shadow-sm block w-full m-0 border-transparent outline-none border p-0 focus:border-indigo-500 min-h-full"
      tabindex="0" :placeholder="placeholder" :class="resize ? '' : 'resize-none'" :rows="rows" spellcheck
      @blur="onBlur" @keydown.tab.prevent />
    <span v-else tabindex="0" class="cursor-pointer" :class="computedValue ? '' : 'text-gray-400 italic'">
      {{ computedValue || placeholder }}
    </span>
  </div>
</template>

<script>
import { events } from '~/shared/constants'

export default {
  name: 'EditableTextArea',
  props: {
    value: {
      type: String,
      default: '',
    },
    isEditable: {
      type: Boolean,
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    resize: {
      type: Boolean,
      default: false,
    },
    rows: {
      type: Number,
      default: 3,
    },
  },
  computed: {
    computedValue: {
      get() {
        return this.value
      },
      set(newVal) {
        this.$emit(events.input, newVal)
      },
    },
  },
  updated() {
    if (this.isEditable) {
      this.$refs.input.focus()
    }
  },
  methods: {
    onBlur() {
      this.$emit(events.blur)
    },
  },
}
</script>

<style scoped>
.edit-mode {
  @apply overflow-visible outline-none;
}

.read-mode {
  @apply overflow-hidden overflow-ellipsis border-transparent outline-none border focus:border-indigo-500;

  overflow: hidden;
  text-wrap: nowrap;
  text-overflow: ellipsis;
}
</style>
