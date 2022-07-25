<template>
  <div class="flex items-center bg-gray-50" :class="idx % 2 === 0 ? 'even' : ''" @click="emitClick">
    <slot />
  </div>
</template>

<script>
import { events } from '~/shared/constants'
export default {
  name: 'TableRow',
  props: {
    idx: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    emitClick(e) {
      this.$emit(events.click, e)
    },
  },
}
</script>

<style scoped>
.even {
  @apply bg-white;
}
</style>
