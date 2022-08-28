<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <MapsDashboard />
  </div>
</template>

<script>
export default {
  name: 'MapsPage',
  async asyncData({ $api }) {
    const headers = $api.getHeaders()
    await $api.getClientList(headers)
    await $api.getSmartviews(headers)
  },
  data() {
    return {}
  },

  mounted() {},

  methods: {},
}
</script>

<style scoped></style>
