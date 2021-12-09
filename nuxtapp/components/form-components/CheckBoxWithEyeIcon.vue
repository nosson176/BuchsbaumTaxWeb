<template>
  <div>
    <div class="grid">
      <input
        id="show"
        v-model="computedValue"
        type="checkbox"
        name="show"
        class="opacity-0 h-3 w-3 col-start-1 row-start-1 col-span-1 row-span-1 cursor-pointer"
      >
      <div
        class="border border-gray-300 rounded h-3 w-3 shadow-inner text-indigo-600 focus-within:ring ring-indigo-600 ring-offset-2 col-start-1 row-start-1 col-span-1 row-span-1"
        @click="onClick"
      >
        <EyeIcon v-if="computedValue" class="p-px" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CheckBoxWithEyeIcon',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    computedValue: {
      get () {
        return this.value
      },
      set (newVal) {
        this.$emit('input', newVal)
      }
    }
  },
  methods: {
    onClick () {
      this.computedValue = !this.computedValue
    }
  }
}
</script>

<style scoped>

</style>
