<template>
  <div class="flex items-center justify-center">
    <div class="rounded-full cursor-pointer bg-gray-200 w-5 h-5 leading-tight text-center" @click="emitClick">
      <CloseIcon class="w-2 h-2" />
    </div>
  </div>
</template>

<script>
import { events } from '~/shared/constants'

export default {
  name: 'DeleteButton',
  methods: {
    emitClick () {
      this.$emit(events.click)
    }
  }
}
</script>

<style scoped>

</style>
