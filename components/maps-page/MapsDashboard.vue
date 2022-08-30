<template>
  <div class="grid grid-cols-9 grid-rows-4 max-h-screen gap-2 p-2">
    <div class="shadow rounded flex col-start-1 col-span-1 row-start-1 flex-col row-span-3 bg-white overflow-hidden">
      <ClientListHeader @change="toggleShowArchivedClients" />
      <ClientList :show-archived="showArchivedClients" />
    </div>
    <div class="shadow rounded flex flex-col bg-white col-start-1 row-start-4">
      <SmartviewsHeader @change="toggleShowArchivedSmartviews" />
      <Smartviews :show-archived="showArchivedSmartviews" />
    </div>
    <MapView class="col-span-6 col-start-2 row-start-1 row-span-4" />
    <div class="col-span-2 col-start-8 row-span-4 row-start-1">
      <ContactsList />
    </div>
  </div>
</template>

<script>
export default {
  name: 'MapsDashboard',
  data() {
    return {
      showArchivedSmartviews: false,
      showArchivedClients: false,
    }
  },
  mounted() {},
  methods: {
    toggleShowArchivedSmartviews() {
      this.showArchivedSmartviews = !this.showArchivedSmartviews
    },
    toggleShowArchivedClients() {
      this.showArchivedClients = !this.showArchivedClients
    },
  },
}
</script>

<style scoped></style>
