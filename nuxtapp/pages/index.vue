<template>
  <div class="min-h-screen">
    <Home />
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  created () {
    this.$api.getClientList()
  }
}
</script>
