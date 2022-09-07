<template>
  <div class="header">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'TableHeader',
}
</script>

<style scoped>
.header {
  @apply w-min flex bg-gray-50 z-10 shadow sticky top-0;
}

@media screen and (min-width: 1919px) {
  .header {
    @apply w-auto;
  }
}
</style>
