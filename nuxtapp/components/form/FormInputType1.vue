<template>
  <input
    :id="id"
    v-model="computedValue"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    @blur="onBlur"
  >
</template>

<script>
import { mapGetters } from 'vuex'
import { EVENT_NAME_INPUT } from '~/shared/constants'

export default {
  name: 'FormInputType1',
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    id: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    valid: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      touched: false
    }
  },
  computed: {
    ...mapGetters([]),
    computedValue: {
      get () {
        return this.value
      },
      set (newValue) {
        this.$emit(EVENT_NAME_INPUT, newValue)
      }
    },
    shouldShowValidation () {
      return !this.valid && this.touched
    },
    classObj () {
      const invalid = this.shouldShowValidation
      return {
        invalid
      }
    }

  },
  methods: {
    onBlur () {
      this.touched = true
    }
  }
}
</script>

<style scoped>
  input {
    @apply inline-block outline-none;
  }

  input.invalid {
    @apply border-2 border-red-500;
  }
</style>
