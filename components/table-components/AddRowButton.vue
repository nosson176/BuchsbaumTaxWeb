<template>
  <button type="button" class="ml-0.5 inline-flex items-center p-0.5 " @click="emitClick">
    <!-- Heroicon name: solid/plus-sm -->
    <AddIcon class="border border-transparent rounded-full shadow-sm w-4 h-4 text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500" />
  </button>
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
