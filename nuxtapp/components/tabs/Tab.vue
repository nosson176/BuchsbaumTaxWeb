<template>
  <div
    class="cursor-pointer border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
    :class="classObj"
    @click="emitClick"
  >
    <slot />
  </div>
</template>

<script>
import { events } from '~/shared/constants'
export default {
  name: 'Tab',
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classObj () {
      const active = this.active
      return { active }
    }
  },
  methods: {
    emitClick () {
      this.$emit(events.click)
    }
  }
}
</script>

<style scoped>

.active {
  @apply border-indigo-500 text-gray-900;
}
</style>
