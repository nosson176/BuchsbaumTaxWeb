<template>
  <div class="flex flex-col max-h-screen">
    <div class="bg-black text-white w-full flex">
      HEADER
    </div>
    <div class="grid flex-grow overflow-hidden p-2">
      <div class="shadow rounded flex flex-col client-list">
        <ClientListHeader @change="toggleShowArchivedClients" />
        <ClientList :show-archived="showArchivedClients" />
      </div>
      <div class="bg-gray-100 border border-gray-500 shadow-md rounded flex flex-col client-tax-years">
        <ClientTaxYearsHeader />
        <ClientTaxYears />
      </div>
      <div class="border border-green-500 bg-green-100 fees-checklists">
        fees/checklists
      </div>
      <div class="border border-yellow-500 bg-yellow-100 smart-views">
        smartviews
      </div>
      <div class="shadow rounded flex flex-col logs-income-fbar">
        <LogsIncomeFbarHeader @change="toggleShowArchivedLogsIncomeFbar" @click="switchLogsIncomeFbarTab" />
        <LogsIncomeFbarBody :show-archived="showArchivedLogsIncomeFbar" :current-tab="currentLogsIncomeFbarTab" @delete="openDeleteModal" />
      </div>
      <div class="shadow rounded flex flex-col personal-contact">
        <PersonalContactHeader @change="toggleShowArchivedPersonals" @click="switchPersonalsTab" />
        <PersonalContactBody :show-archived="showArchivedPersonals" :current-tab="currentPersonalsTab" @delete="openDeleteModal" />
      </div>
      <Modal :showing="showDeleteModal">
        <DeleteCard :id="deleteId" :type="deleteType" @hide="closeDeleteModal" />
      </Modal>
    </div>
    <div class="bg-black text-white flex">
      FOOTER
    </div>
  </div>
</template>

<script>
import { tabs } from '~/shared/constants'
export default {
  name: 'Home',
  data () {
    return {
      showArchivedClients: false,
      showArchivedPersonals: false,
      currentPersonalsTab: tabs.tax_personals,
      showArchivedLogsIncomeFbar: false,
      currentLogsIncomeFbarTab: tabs.logs,
      showDeleteModal: false,
      deleteId: '',
      deleteType: ''
    }
  },
  methods: {
    toggleShowArchivedClients () {
      this.showArchivedClients = !this.showArchivedClients
    },
    toggleShowArchivedPersonals () {
      this.showArchivedPersonals = !this.showArchivedPersonals
    },
    switchPersonalsTab (tab) {
      this.currentPersonalsTab = tab
    },
    toggleShowArchivedLogsIncomeFbar () {
      this.showArchivedLogsIncomeFbar = !this.showArchivedLogsIncomeFbar
    },
    switchLogsIncomeFbarTab (tab) {
      this.currentLogsIncomeFbarTab = tab
    },
    openDeleteModal ({ id, type }) {
      this.showDeleteModal = true
      this.deleteId = id
      this.deleteType = type
    },
    closeDeleteModal () {
      this.showDeleteModal = false
    }
  }
}
</script>

<style scoped>
.grid {
  gap: 0.5rem;
  grid-template-rows: repeat(4, minmax(0, 1fr));
  grid-template-columns: repeat(9, minmax(0, 1fr));
}

.client-list {
  @apply row-start-1 col-start-1 row-span-3;
}

.fees-checklists {
  @apply row-start-1 row-span-2 col-start-9;
}

.client-tax-years {
  @apply row-start-1 row-span-2 col-start-2 col-span-7;
}

.smart-views {
  @apply row-start-4 col-start-1;
}

.logs-income-fbar {
  @apply row-start-3 row-span-2 col-start-2 col-span-5;
}

.personal-contact {
  @apply row-start-3 row-span-2 col-start-7 col-span-3;
}
</style>
