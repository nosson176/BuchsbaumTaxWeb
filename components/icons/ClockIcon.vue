<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" @click="emitClick">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
</template>

<script>
import { events } from '~/shared/constants'

export default {
  name: 'ClockIcon',
  methods: {
    emitClick() {
      this.$emit(events.click)
    },
  },
}
</script>

<style scoped>

</style>
