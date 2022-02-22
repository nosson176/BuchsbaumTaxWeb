<template>
  <div>
    <div class="h-5 w-5 cursor-pointer hover:bg-gray-200" @click="emitClick">
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
