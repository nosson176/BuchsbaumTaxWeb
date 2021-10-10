<template>
  <div
    class="bg-gray-100 flex justify-between items-center"
    :class=" idx % 2 === 0 ? 'even': ''"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'TableRow',
  props: {
    idx: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped>
.even {
  @apply bg-gray-300;
}
</style>
