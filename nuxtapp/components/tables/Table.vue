<template>
  <div class="flex flex-col flex-grow overflow-hidden" @keydown.tab.prevent="emitKeyDown">
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
    emitKeyDown (e) {
      console.log(e)
      this.$emit(events.keyup, e)
    }
  }
}
</script>

<style scoped>

</style>
