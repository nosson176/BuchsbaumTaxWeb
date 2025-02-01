<template>
  <div ref="div" :class="showEditMode ? 'edit-mode' : 'read-mode'">
    <div v-if="isEditable" class="fixed w-screen h-screen top-0 left-0 z-10" @click.stop>
      <div class="h-full" @click="onBlur" />
    </div>
    <input v-if="showEditMode" ref="input" v-model="computedValue" autofocus type="text"
      class="block w-full shadow-sm m-0 border-transparent outline-none border focus:border-indigo-500 text-xs p-0 absolute top-0 pl-px min-h-full z-20"
      tabindex="0" :placeholder="placeholder" @keydown.enter="emitEnter" @input="onInput" />
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
  data() {
    return {
      hasEdited: false,  // מצב שמעקב אחרי אם ערך שונה כבר הוזן
    }
  },
  computed: {
    computedValue: {
      get() {
        if (this.rounded) {
          return this.value ? formatAsNumber(Math.round(this.value)) : 0
        } else if (this.currency) {
          return this.value ? formatAsNumber(this.value) : 0
        }
        return this.value || 0
      },
      set(newVal) {
        console.log(newVal)
        this.$emit(events.input, newVal)
      },
    },
    showEditMode() {
      return this.isEditable && !this.readonly
    },
  },
  updated() {
    if (this.showEditMode && !this.hasEdited && this.$refs.input) {
      // אם לא הוזן ערך חדש, בחר את הערך במלואו
      this.$refs.input.select()
    } else if (this.showEditMode && this.hasEdited) {
      // אם הוזן ערך, אל תבחר את הערך יותר
      this.$refs.input.focus()
    }
  },
  methods: {
    formatAsCurrency(amount) {
      return formatAsNumber(amount)
    },
    onBlur(event) {
      this.$emit(events.blur, event)
    },
    emitEnter() {
      this.$emit(events.submit)
    },
    onInput() {
      if (!this.hasEdited) {
        this.hasEdited = true // ברגע שמתחילים להקליד, לא נבחר יותר את הערך
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
