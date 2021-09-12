<template>
  <div class="flex flex-col max-h-screen overflow-auto">
    <div class="bg-black text-white w-full flex">
      HEADER
    </div>
    <div class="grid flex-grow overflow-hidden p-2">
      <div class="bg-gray-100 border-2 border-gray-500 rounded client-list overflow-auto">
        <ClientListHeader @change="toggleShowArchivedClients" />
        <ClientList :show-archived="showArchivedClients" />
      </div>
      <div class="border border-blue-500 bg-blue-100 client-tax-years">
        client/tax years
      </div>
      <div class="border border-green-500 bg-green-100 fees-checklists">
        fees/checklists
      </div>
      <div class="border border-yellow-500 bg-yellow-100 smart-views">
        smartviews
      </div>
      <div class="border border-gray-500 bg-gray-100 logs-income-fbar">
        logs/income/fbar
      </div>
      <div class="border border-purple-500 bg-purple-100 personal-contact">
        personal/contact
      </div>
    </div>
    <div class="bg-black text-white flex">
      FOOTER
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      showArchivedClients: false
    }
  },
  methods: {
    toggleShowArchivedClients () {
      this.showArchivedClients = !this.showArchivedClients
    }
  }
}
</script>

<style scoped>
.grid {
  gap: 0.5rem;
  grid-template-rows: repeat(4, minmax(0, 1fr));
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

.client-list {
  @apply row-start-1 col-start-1 row-span-3;
}

.fees-checklists {
  @apply row-start-1 row-span-2 col-start-7;
}

.client-tax-years {
  @apply row-start-1 row-span-2 col-start-2 col-span-5;
}

.smart-views {
  @apply row-start-4 col-start-1;
}

.logs-income-fbar {
  @apply row-start-3 row-span-2 col-start-2 col-span-3;
}

.personal-contact {
  @apply row-start-3 row-span-2 col-start-5 col-span-3;
}
</style>
