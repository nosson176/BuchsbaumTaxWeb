<template>
  <div
    :draggable="draggable"
    class="flex items-center bg-gray-50"
    :class="idx % 2 === 0 ? 'even' : ''"
    @dragstart="emitDragstart($event)"
  >
    <slot />
  </div>
</template>

<script>
import { events } from '@/shared/constants'

export default {
  name: 'TableRow',
  props: {
    idx: {
      type: Number,
      default: 0,
    },
    draggable: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    emitDragstart(evt) {
      this.$emit(events.dragstart, evt)
    },
  },
}
</script>

<style scoped>
.even {
  @apply bg-white;
}
</style>
