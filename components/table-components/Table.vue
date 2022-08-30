<template>
  <div
    class="flex flex-col flex-grow overflow-hidden bg-white"
    @keydown.tab.prevent="emitKeyDown"
    @keyup.tab.prevent="emitKeyUp"
  >
    <slot name="header" />
    <div class="flex-grow overflow-auto">
      <slot name="body" />
    </div>
  </div>
</template>

<script>
import { events } from '~/shared/constants'
export default {
  name: 'Table',
  methods: {
    emitKeyDown(e) {
      this.$emit(events.keydown, e)
    },
    emitKeyUp(e) {
      this.$emit(events.keyup, e)
    },
  },
}
</script>

<style scoped></style>
