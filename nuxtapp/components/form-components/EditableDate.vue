<template>
  <div :class="isEditable ? 'edit-mode' : 'read-mode'">
    <date-picker
      v-if="isEditable"
      ref="input"
      v-model="computedValue"
      :value-type="valueType"
      :format="format"
      :type="type"
      :placeholder="placeholder"
      :open.sync="showPicker"
      @focus="onFocus"
    />
    <span v-else class="cursor-pointer">{{ computedValue || placeholder }}</span>
  </div>
</template>

<script>
import { events } from '~/shared/constants'
import { formatDateForClient, formatDateForServer } from '~/shared/domain-utilities'
export default {
  name: 'EditableDate',
  props: {
    value: {
      type: String,
      default: null
    },
    isEditable: {
      type: Boolean,
      required: true
    },
    type: {
      type: String,
      default: 'date'
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showPicker: false
    }
  },
  computed: {
    computedValue: {
      get () {
        if (this.isTypeDate && this.value) {
          return formatDateForClient(this.value)
        } else {
          return this.value
        }
      },
      set (newVal) {
        if (this.isTypeDate) {
          this.$emit('input', formatDateForServer(newVal))
        } else {
          this.$emit('input', newVal)
        }
        this.$emit(events.blur)
      }
    },
    format () {
      return this.isTypeDate ? 'M/D/YY' : 'HH:mm:ss'
    },
    valueType () {
      return 'format'
    },
    isTypeDate () {
      return this.type === 'date'
    }
  },
  updated () {
    if (this.isEditable) {
      this.$refs.input.focus()
    }
    if (!this.showPicker) {
      this.$emit(events.blur)
    }
  },
  methods: {
    formatDateForClient (date) {
      return date ? formatDateForClient(date) : ''
    },
    formatDateForServer (date) {
      return date ? formatDateForServer(date) : ''
    },
    onFocus () {
      this.showPicker = true
    }
  }
}
</script>

<style scoped>
input {
  @apply w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 text-xs p-0;
}

.edit-mode {
  @apply overflow-visible;
}

.read-mode {
  @apply overflow-hidden overflow-ellipsis;
}
</style>
