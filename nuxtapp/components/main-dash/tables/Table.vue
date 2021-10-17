<template>
  <div class="flex-grow overflow-auto">
    <slot name="header" />
    <slot name="body" />
  </div>
</template>

<script>
export default {
  name: 'Table'
}
</script>

<style scoped>

</style>
