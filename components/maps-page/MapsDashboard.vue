<template>
  <div class="grid grid-cols-6 h-full">
    <MapView class="col-span-4 col-start-2" />
    <div class="col-span-1 col-start-6">
      <ContactsList />
    </div>
  </div>
</template>

<script>
import MapView from './MapView.vue'
export default {
  name: 'MapsDashboard',
  components: { MapView },
  data() {
    return {}
  },
  mounted() {},
  methods: {},
}
</script>

<style scoped></style>
