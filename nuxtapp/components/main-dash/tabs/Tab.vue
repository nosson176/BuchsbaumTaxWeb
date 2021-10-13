<template>
  <div class="w-40 p-1 cursor-pointer rounded-t bg-gray-400 text-white text-center" @click="emitClick">
    <slot />
  </div>
</template>

<script>
import { events } from '~/shared/constants'
export default {
  name: 'Tab',
  methods: {
    emitClick () {
      this.$emit(events.click)
    }
  }
}
</script>

<style scoped>

</style>
