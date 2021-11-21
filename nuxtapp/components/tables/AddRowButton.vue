<template>
  <button type="button" class="ml-0.5 inline-flex items-center p-0.5 border border-transparent rounded-full shadow-sm w-4 h-4 text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500" @click="emitClick">
    <!-- Heroicon name: solid/plus-sm -->
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
    </svg>
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
