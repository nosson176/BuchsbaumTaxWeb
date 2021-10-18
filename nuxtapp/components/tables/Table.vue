<template>
  <div class="flex flex-col flex-grow overflow-hidden">
    <slot name="header" />
    <div class="flex-grow overflow-auto">
      <slot name="body" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Table'
}
</script>

<style scoped>

</style>
