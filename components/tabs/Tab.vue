<template>
  <div
    class="flex items-center cursor-pointer border-transparent border-b-2 hover:border-gray-300 hover:text-gray-700"
    :class="classObj"
    @click="emitClick"
  >
    <div v-if="count >= 0" class="text-white rounded-full bg-indigo-600 py-0.5 px-1.5 text-xs">
      {{ count }}
    </div>
    <div class="text-gray-500 inline-flex items-center py-0.5 px-1.5 text-sm font-medium">
      <slot />
    </div>
  </div>
</template>

<script>
import { events } from '~/shared/constants'
export default {
  name: 'Tab',
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    count: {
      type: Number,
      default: -1,
    },
  },
  computed: {
    classObj() {
      const active = this.active
      return { active }
    },
  },
  methods: {
    emitClick() {
      this.$emit(events.click)
    },
  },
}
</script>

<style scoped>
.active {
  @apply border-indigo-500 text-gray-900;
}
</style>
