<template>
  <div>
    <div class="h-5 w-5 cursor-pointer bg-indigo-200 rounded-full" @click="emitClick" />
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
