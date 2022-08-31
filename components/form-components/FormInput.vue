<template>
  <div>
    <label :for="name" class="sr-only">{{ label }}</label>
    <input
      :id="id"
      ref="input"
      v-model="computedValue"
      :name="name"
      :type="type"
      :autocomplete="autocomplete"
      :required="required"
      :placeholder="placeholder"
      class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
      :class="classObj"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { events } from '~/shared/constants'

export default {
  name: 'FormInput',
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    id: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    autocomplete: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
    valid: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
    first: {
      type: Boolean,
      default: false,
    },
    last: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      touched: false,
    }
  },
  computed: {
    ...mapGetters([]),
    computedValue: {
      get() {
        return this.value
      },
      set(newValue) {
        this.$emit(events.input, newValue)
      },
    },
    shouldShowValidation() {
      return !this.valid && this.touched
    },
    classObj() {
      const invalid = this.shouldShowValidation
      const first = this.first
      const last = this.last
      const rounded = !this.first && !this.last
      return { invalid, first, last, rounded }
    },
  },
  methods: {
    onBlur() {
      this.touched = true
    },
  },
}
</script>

<style scoped>
input.invalid {
  @apply border-2 border-red-500;
}

input.first {
  @apply rounded-t-md;
}

input.last {
  @apply rounded-b-md;
}

input.rounded {
  @apply rounded-md shadow-sm;
}
</style>
