<template>
  <div>
    <div>
      <FormInput id="example-form-string-input" v-model="stringProp" placeholder="example placeholder" valid />
    </div>
    <div>
      <FormInput
        id="example-form-number-input"
        v-model.number="numberProp"
        type="number"
        placeholder="example placeholder"
        valid
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { events } from '~/shared/constants'

export default {
  name: 'ExampleFormFields',
  props: {
    value: {
      type: Object,
      default: null,
    },
  },
  computed: {
    ...mapGetters([]),
    stringProp: {
      get() {
        return this.value.stringProp
      },
      set(stringProp) {
        this.emitInput({ ...this.value, stringProp })
      },
    },
    numberProp: {
      get() {
        return this.value.numberProp
      },
      set(numberProp) {
        this.emitInput({ ...this.value, numberProp })
      },
    },
  },
  methods: {
    emitInput(payload) {
      this.$emit(events.input, payload)
    },
  },
}
</script>

<style scoped></style>
