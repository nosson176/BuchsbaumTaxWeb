<template>
  <div>
    <div>
      <FormInputType1
        id="example-form-string-input"
        v-model="stringProp"
        placeholder="example placeholder"
        valid
      />
    </div>
    <div>
      <FormInputType1
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
import { EVENT_NAME_INPUT } from '~/shared/constants'

export default {
  name: 'ExampleFormFields',
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  computed: {
    ...mapGetters([]),
    stringProp: {
      get () {
        return this.value.stringProp
      },
      set (stringProp) {
        this.emitInput({ ...this.value, stringProp })
      }
    },
    numberProp: {
      get () {
        return this.value.numberProp
      },
      set (numberProp) {
        this.emitInput({ ...this.value, numberProp })
      }
    }
  },
  methods: {
    emitInput (payload) {
      this.$emit(EVENT_NAME_INPUT, payload)
    }
  }
}
</script>

<style scoped>

</style>
