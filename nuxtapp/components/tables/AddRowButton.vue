<template>
  <div @click="emitClick">
    <AddIcon class="h-4 w-4 text-green-500 cursor-pointer" />
  </div>
</template>

<script>
import { events } from '~/shared/constants'
export default {
  name: 'AddRowButton',
  methods: {
    emitClick () {
      this.$emit(events.click)
    }
  }
}
</script>

<style scoped>

</style>
