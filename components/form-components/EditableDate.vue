<template>
  <div tabindex="-1" :class="isEditable ? 'edit-mode' : 'read-mode'">
    <div v-if="isEditable" class="fixed w-screen h-screen top-0 left-0 z-10" @click.stop>
      <div class="h-full" @click="onBlur" />
    </div>
    <date-picker v-if="isEditable" ref="input" v-model="computedValue" :value-type="valueType" tabindex="0"
      :format="format" :type="type" :placeholder="placeholder" :open.sync="showPicker" @focus="onFocus"
      @input="onInput">
      <template #header="{ emit }">
        <button class="w-full bg-gray-200 flex items-center justify-center mx-btn mx-btn-text"
          @click="emit(new Date())">
          Today
        </button>
      </template>
    </date-picker>
    <span v-else class="cursor-pointer" :class="computedValue ? '' : 'text-gray-400 italic'">
      {{ displayedValue || placeholder }}
    </span>
  </div>
</template>

<script>
import { events } from '~/shared/constants'
// import { formatDateForClient } from '~/shared/domain-utilities'
import { formatUnixTimestamp } from '~/shared/utility';
export default {
  name: 'EditableDate',
  props: {
    value: {
      type: [String, Number],
      default: null,
    },
    isEditable: {
      type: Boolean,
      required: true,
    },
    type: {
      type: [String, Number],
      default: 'date',
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      showPicker: false,
    }
  },
  computed: {
    computedValue: {
      get() {
        if (this.value === "null") return false
        return this.value
      },
      set(newVal) {
        const date = new Date(newVal).getTime()
        this.$emit('input', date)
        this.$emit(events.blur)
      },
    },
    format() {
      return this.isTypeDate ? 'M/D/YY' : 'HH:mm:ss'
    },
    valueType() {
      return this.isTypeDate ? 'YYYY-MM-DD' : 'HH:mm:ss'
    },
    isTypeDate() {
      return this.type === 'date'
    },
    displayedValue() {
      return this.isTypeDate && this.computedValue ? formatUnixTimestamp(this.computedValue) : this.computedValue
    },
  },
  updated() {
    if (this.isEditable) {
      this.$refs.input.focus()
    }
  },
  methods: {
    onFocus() {
      this.showPicker = true
    },
    onInput(newVal) {
      this.computedValue = newVal
    },
    onBlur() {
      this.$emit(events.blur)
    },
  },
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