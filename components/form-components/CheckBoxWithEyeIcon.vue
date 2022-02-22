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
        class="h-4 w-4 col-start-1 row-start-1 col-span-1 row-span-1"
        :class="computedValue ? 'text-indigo-600' : 'text-gray-400'"
        @click="onClick"
      >
        <EyeIcon />
      </div>
    </div>
  </div>
</template>

<script>
import { events } from '~/shared/constants'

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
        this.$emit(events.input, newVal)
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
