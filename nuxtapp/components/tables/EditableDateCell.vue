<template>
  <div :class="isEditable ? 'edit-mode' : 'read-mode'">
    <date-picker
      v-if="isEditable"
      ref="input"
      v-model="computedValue"
      :open="showPicker"
      value-type="format"
      format="M/D/YY"
      type="date"
      @blur="onBlur"
    />
    <span v-else class="cursor-pointer">{{ computedValue }}</span>
  </div>
</template>

<script>
import { events } from '~/shared/constants'
import { formatDateForClient, formatDateForServer } from '~/shared/domain-utilities'
export default {
  name: 'EditableDateCell',
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
  data () {
    return {
      showPicker: false
    }
  },
  computed: {
    computedValue: {
      get () {
        return this.formatDateForClient(this.value)
      },
      set (newVal) {
        this.$emit(events.input, this.formatDateForServer(newVal))
        this.$emit(events.blur)
      }
    }
  },
  updated () {
    if (this.isEditable) {
      this.$refs.input.focus()
      this.showPicker = true
    }
  },
  methods: {
    formatDateForClient (date) {
      return date ? formatDateForClient(date) : ''
    },
    formatDateForServer (date) {
      return date ? formatDateForServer(date) : ''
    },
    onBlur (event) {
      if (!event.explicitOriginalTarget.data) {
        this.$emit(events.blur)
      }
    }
  }
}
</script>

<style scoped>
input {
  @apply w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 text-xs p-0 absolute top-0;
}

.edit-mode {
  @apply relative z-10 overflow-visible -mt-1;
}

.read-mode {
  @apply overflow-hidden overflow-ellipsis;
}
</style>
