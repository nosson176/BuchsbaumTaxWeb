<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <MapsDashboard />
  </div>
</template>

<script>
export default {
  name: 'MapsPage',
  data() {
    return {}
  },
  async fetch() {
    const headers = this.$api.getHeaders()
    await this.$api.getClientList(headers)
    await this.$api.getSmartviews(headers)
  },

  mounted() {},

  methods: {},
}
</script>

<style scoped></style>
