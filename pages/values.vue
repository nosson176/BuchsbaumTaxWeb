<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <p v-if="$fetchState.pending">Fetching Values...</p>
    <Values v-else />
  </div>
</template>

<script>
export default {
  name: 'ValuesPage',
  async fetch() {
    const headers = this.$api.getHeaders()
    await this.$api.getValueTypes(headers)
  },
}
</script>

<style scoped></style>
