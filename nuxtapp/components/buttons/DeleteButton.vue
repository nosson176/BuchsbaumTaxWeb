<template>
  <div class="flex items-center justify-center">
    <div class="flex justify-center items-center rounded-full cursor-pointer bg-gray-500 text-white w-4 h-4 leading-tight text-center" tabindex="0" @click="emitClick" @keypress.enter="emitClick">
      <CloseIcon class="w-3 h-3" />
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
