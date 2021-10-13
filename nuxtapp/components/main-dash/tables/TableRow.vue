<template>
  <tr class="bg-white" :class="idx % 2 === 0 ? 'even': ''">
    <slot />
  </tr>
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
  @apply bg-gray-50;
}
</style>
