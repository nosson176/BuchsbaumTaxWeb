<template>
  <div tabindex="-1" class="flex items-center justify-center">
    <div
      class="flex justify-center border items-center border-transparent rounded-full cursor-pointer bg-gray-500 text-white leading-tight text-center hover:shadow hover:border-indigo-500"
      :class="small ? 'w-3 h-3' : 'w-4 h-4'"
      tabindex="0"
      @click="emitClick"
      @keypress.enter="emitClick"
    >
      <CloseIcon :class="small ? 'w-2 h-2' : 'w-3 h-3'" />
    </div>
  </div>
</template>

<script>
import { events } from '~/shared/constants'

export default {
  name: 'DeleteButton',
  props: {
    small: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    emitClick () {
      this.$emit(events.click)
    }
  }
}
</script>

<style scoped>
</style>
