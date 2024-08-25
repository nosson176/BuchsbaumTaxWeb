<template>
  <div ref="div" :class="showEditMode ? 'edit-mode' : 'read-mode'">
    <div v-if="isEditable" class="fixed w-screen h-screen top-0 left-0 z-10" @click.stop>
      <div class="h-full" @click="onBlur" />
    </div>
    <input v-if="showEditMode" ref="input" v-model="computedValue" autofocus selectAll type="text"
      class="block w-full shadow-sm m-0 border-transparent outline-none border focus:border-indigo-500 text-xs p-0 absolute top-0 pl-px min-h-full z-20"
      tabindex="0" :placeholder="placeholder" @keydown.enter="emitEnter" />
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
  computed: {
    computedValue: {
      get() {
        if (this.rounded) {
          return this.value ? formatAsNumber(Math.round(this.value)) : ''
        } else if (this.currency) {
          return this.value ? formatAsNumber(this.value) : ''
        }
        return this.value
      },
      set(newVal) {
        this.$emit(events.input, newVal)
      },
    },
    showEditMode() {
      console.log(this.selectAll)
      return this.isEditable && !this.readonly
    },
  },
  updated() {
    if (this.isEditable) {
      if (this.readonly) {
        this.$refs.div.focus()
      } else if (this.selectAll) {
        this.$refs.input.select()
      } else this.$refs.input.focus()
    }
  },
  methods: {
    formatAsCurrency(amount) {
      return formatAsNumber(amount)
    },
    onBlur() {
      this.$emit(events.blur)
    },
    emitEnter() {
      this.$emit(events.submit)
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
