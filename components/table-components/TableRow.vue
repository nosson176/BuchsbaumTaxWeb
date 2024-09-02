<template>
  <div :draggable="draggable" class="flex items-center" :class="bgColorClassObj" @dragstart="emitDragstart($event)"
    @click="emitClick">
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
    selected: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    bgColorClassObj() {
      if (this.selected) {
        console.log("bgColorClassObj")
        return { 'bg-indigo-200': true }
      } else if (this.idx % 2 === 0) {
        return { 'bg-white': true }
      } else {
        return { 'bg-gray-50': true }
      }
    },
  },
  methods: {
    emitDragstart(evt) {
      this.$emit(events.dragstart, evt)
    },
    emitClick(e) {
      this.$emit(events.click, e)
    },
  },
}
</script>

<style scoped></style>
