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
      @input="onInput"
    />
    <span v-else class="cursor-pointer" :class="computedValue ? '' : 'text-gray-400 italic'">
      {{ displayedValue || placeholder }}
    </span>
  </div>
</template>

<script>
import { events } from '~/shared/constants'
import { formatDateForClient } from '~/shared/domain-utilities'
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
        return this.value
      },
      set (newVal) {
        this.$emit('input', newVal)
        console.log({ newVal })
        this.$emit(events.blur)
      }
    },
    format () {
      return this.isTypeDate ? 'M/D/YY' : 'HH:mm:ss'
    },
    valueType () {
      return this.isTypeDate ? 'YYYY-MM-DD' : 'HH:mm:ss'
    },
    isTypeDate () {
      return this.type === 'date'
    },
    displayedValue () {
      return this.isTypeDate && this.computedValue ? formatDateForClient(this.computedValue) : this.computedValue
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
    onFocus () {
      this.showPicker = true
    },
    onInput (newVal) {
      this.computedValue = newVal
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
