<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <Values />
  </div>
</template>

<script>
export default {
  name: 'ValuesPage',
  async created () {
    const headers = this.$api.getHeaders()
    await this.$api.getValueTypes(headers)
  }
};
</script>

<style scoped>
</style>
