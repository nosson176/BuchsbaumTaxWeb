<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <Values />
  </div>
</template>

<script>
export default {
  name: 'ValuesPage',
  async asyncData({ $api }) {
    const headers = $api.getHeaders()
    await $api.getValueTypes(headers)
  },
}
</script>

<style scoped></style>
