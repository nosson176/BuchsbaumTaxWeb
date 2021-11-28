<template>
  <div class="flex items-center justify-center">
    <div class="rounded-full cursor-pointer bg-gray-500 text-white w-5 h-5 leading-tight text-center" tabindex="0" @click="emitClick" @keypress.enter="emitClick">
      <CloseIcon class="w-5 h-5" />
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
