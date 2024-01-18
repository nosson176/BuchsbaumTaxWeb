<template>
  <input
    ref="input"
    v-model="computedValue"
    autofocus
    type="text"
    class="block w-full shadow-sm m-0 border-transparent outline-none border focus:border-indigo-500 text-xs p-0 pl-px min-h-full"
    tabindex="0"
    :placeholder="placeholder"
    size="1"
    @blur="onBlur"
  />
</template>

<script>
import { events } from '~/shared/constants'

export default {
  name: 'Input',
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
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
  methods: {
    onBlur() {
      this.$emit(events.blur)
    },
  },
}
</script>

<style scoped></style>
