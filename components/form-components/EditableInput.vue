<template>
  <div ref="div" tabindex="0" :class="showEditMode ? 'edit-mode' : 'read-mode'">
    <div v-if="showEditMode" class="fixed w-screen h-screen top-0 left-0 z-10" @click.stop>
      <div class="h-full" @click="onBlur" />
    </div>
    <input v-if="showEditMode" ref="input" v-model="computedValue" autofocus type="text"
      class="block w-full shadow-sm m-0 border-transparent outline-none border focus:border-indigo-500 text-xs p-0 pl-px min-h-full"
      tabindex="0" :placeholder="placeholder" @keydown.enter="onEnter" @blur="onBlur" />
    <span v-else class="cursor-pointer" :class="computedValue ? '' : 'text-gray-400 italic'">
      {{ computedValue || placeholder }}
    </span>
  </div>
</template>

<script>
import { events } from '~/shared/constants'
import { formatAsNumber } from '~/shared/utility'

export default {
  name: 'EditableInput',
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
  },
  computed: {
    computedValue: {
      get() {
        if (this.currency) {
          return this.value ? formatAsNumber(this.value) : ''
        }
        return this.value
      },
      set(newVal) {
        if (/^-?\d*\.?\d*$/.test(newVal)) {
          this.$emit(events.input, newVal)
        } else {
          this.$emit(events.input, newVal)
        }
      },
    },
    showEditMode() {
      return this.isEditable && !this.readonly
    },
  },
  updated() {
    if (this.isEditable) {
      if (this.readonly) {
        this.$refs.div.focus()
      } else {
        this.$refs.input.focus()
      }
    }
  },

  mounted() {
    if (this.isEditable) document.addEventListener('keydown', this.handleKey)
  },

  watch: {
    isEditable(newVal) {
      if (newVal) {
        document.addEventListener('keydown', this.handleKey);
      } else {
        document.removeEventListener('keydown', this.handleKey);
      }
    }
  },

  methods: {
    onBlur(event) {
      this.$emit(events.blur, event)
    },
    onClick() {
      this.$emit(events.blur)
    },
    handleKey(event) {
      if (event.key === 'Enter') {
        this.onBlur(event);
      }
    },
    onEnter() {
      this.$emit('enter') // Custom event for Enter key
    },
  },
}
</script>

<style scoped>
.edit-mode {
  @apply overflow-visible outline-none w-auto;
}

.read-mode {
  @apply overflow-hidden overflow-ellipsis border-transparent outline-none border-2 focus:border-blue-600;

  overflow: hidden;
  text-wrap: nowrap;
  text-overflow: ellipsis;
}

input::placeholder {
  @apply italic text-gray-600;
}
</style>
