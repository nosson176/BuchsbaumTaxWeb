<template>
  <div class="flex flex-col max-h-screen bg-gray-100">
    <Keypress key-event="keydown" :key-code="91" prevent-default @success="onCmdPress" />
    <Keypress key-event="keyup" :key-code="91" prevent-default @success="onCmdUp" />
    <Header />
    <div class="grid flex-grow overflow-hidden p-2">
      <div class="shadow rounded flex flex-col client-list bg-white">
        <ClientListHeader @change="toggleShowArchivedClients" />
        <ClientList :show-archived="showArchivedClients" />
      </div>
      <div class="shadow rounded flex flex-col fees-checklists bg-white">
        <FeesChecklistsHeader @change="toggleShowArchivedFeesChecklists" @click="switchFeesChecklistsTab" />
        <FeesChecklistsBody :show-archived="showArchivedFeesChecklists" :current-tab="currentFeesChecklistsTab" />
      </div>
      <div class="shadow rounded flex flex-col smart-views bg-white">
        <SmartviewsHeader @change="toggleShowArchivedSmartviews" />
        <Smartviews :show-archived="showArchivedSmartviews" />
      </div>
      <div class="shadow rounded flex flex-col logs-income-fbar bg-white">
        <LogsIncomeFbarHeader @change="toggleShowArchivedLogsIncomeFbar" @click="switchLogsIncomeFbarTab" />
        <LogsIncomeFbarBody :show-archived="showArchivedLogsIncomeFbar" :current-tab="currentLogsIncomeFbarTab" />
      </div>
      <div class="shadow rounded flex flex-col personal-contact bg-white">
        <PersonalContactHeader @change="toggleShowArchivedPersonals" @click="switchPersonalsTab" />
        <PersonalContactBody :show-archived="showArchivedPersonals" :current-tab="currentPersonalsTab" />
      </div>
      <!-- because of some weird z-indexing this is at the bottom and flex-col-reverse -->
      <div class="bg-white shadow-md rounded-t flex flex-col-reverse client-tax-years">
        <ClientTaxYears />
        <ClientTaxYearsHeader />
      </div>
      <Modal :showing="showDeleteModal">
        <DeleteCard @hide="closeDeleteModal" />
      </Modal>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { tabs, models, mutations } from '~/shared/constants'

export default {
  name: 'Home',
  components: { Keypress: () => import('vue-keypress') },
  data () {
    return {
      currentFeesChecklistsTab: tabs.fees,
      currentLogsIncomeFbarTab: tabs.logs,
      currentPersonalsTab: tabs.tax_personals,
      deleteId: '',
      deleteType: '',
      showArchivedClients: false,
      showArchivedFeesChecklists: false,
      showArchivedLogsIncomeFbar: false,
      showArchivedPersonals: false,
      showArchivedSmartviews: false
    }
  },
  computed: {
    ...mapState([models.modals]),
    showDeleteModal () {
      let showModal = false
      if (this.modals.delete) {
        showModal = this.modals.delete.showing
      }
      return showModal
    }
  },
  methods: {
    toggleShowArchivedClients () {
      this.showArchivedClients = !this.showArchivedClients
    },
    toggleShowArchivedPersonals () {
      this.showArchivedPersonals = !this.showArchivedPersonals
    },
    toggleShowArchivedSmartviews () {
      this.showArchivedSmartviews = !this.showArchivedSmartviews
    },
    switchPersonalsTab (tab) {
      this.currentPersonalsTab = tab
    },
    toggleShowArchivedLogsIncomeFbar () {
      this.showArchivedLogsIncomeFbar = !this.showArchivedLogsIncomeFbar
    },
    toggleShowArchivedFeesChecklists () {
      this.showArchivedFeesChecklists = !this.showArchivedFeesChecklists
    },
    switchLogsIncomeFbarTab (tab) {
      this.currentLogsIncomeFbarTab = tab
    },
    switchFeesChecklistsTab (tab) {
      this.currentFeesChecklistsTab = tab
    },
    openDeleteModal ({ id, type }) {
      this.showDeleteModal = true
      this.deleteId = id
      this.deleteType = type
    },
    closeDeleteModal () {
      this.$store.commit(mutations.setModelResponse, { model: models.modals, data: { delete: { showing: false, data: {} } } })
    },
    onCmdPress () {
      this.$store.commit(mutations.setModelResponse, { model: models.cmdPressed, data: true })
    },
    onCmdUp () {
      this.$store.commit(mutations.setModelResponse, { model: models.cmdPressed, data: false })
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
