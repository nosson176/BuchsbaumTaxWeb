<template>
  <form @submit.prevent="handleSubmit">
    <h4 class="text-3xl">
      Example Form
    </h4>
    <ExampleFormFields v-model="formModel" />
    <button type="submit" class="bg-gray-200 py-1 px-2.5 rounded-md focus:outline-none">
      Submit
    </button>
  </form>
</template>

<script>
import { mapGetters } from 'vuex'

const formModelConstructor = () => {
  return {
    stringProp: '',
    numberProp: 0
  }
}
export default {
  name: 'ExampleForm',
  data () {
    return {
      formModel: null
    }
  },
  computed: {
    ...mapGetters([])
  },
  created () {
    this.initializeFormModel()
  },
  methods: {
    handleSubmit () {

    },
    initializeFormModel () {
      this.formModel = formModelConstructor()
      this.formModel.stringProp = 'example string prop value'
      this.formModel.numberProp = 100
    }
  }
}
</script>

<style scoped>

</style>
