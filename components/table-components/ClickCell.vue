<template>
  <div>
    <div class="flex items-center justify-center h-5 w-5 cursor-pointer text-xs font-extralight hover:bg-gray-400 hover:text-white" @click="emitClick">
      <slot />
    </div>
  </div>
</template>

<script>
import { events } from '~/shared/constants'
export default {
  name: 'ClickCell',
  methods: {
    emitClick () {
      this.$emit(events.click)
    }
  }
}
</script>

<style scoped>

</style>
