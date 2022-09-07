<template>
  <div v-hotkey="keymap" class="flex flex-col max-h-screen bg-gray-100 p-2 space-y-4">
      <div class="flex space-x-4 max-h-full">
        <div class="client-list">
          <ClientListHeader @change="toggleShowArchivedClients" />
          <ClientList :show-archived="showArchivedClients" @resetClock="resetClock" />
        </div>
        <!-- because of some weird z-indexing this is at the bottom and flex-col-reverse -->
        <div class="bg-white shadow-md rounded-t flex flex-col-reverse w-full">
          <ClientTaxYears />
          <ClientTaxYearsHeader />
        </div>
        <div class="shadow rounded flex flex-col bg-white">
          <FeesChecklistsHeader @click="switchFeesChecklistsTab" />
          <FeesChecklistsBody :current-tab="currentFeesChecklistsTab" />
        </div>
      </div>
      <div class="flex space-x-4">
        <div class="shadow rounded flex flex-col min-w-[60px] bg-white">
          <SmartviewsHeader @change="toggleShowArchivedSmartviews" />
          <Smartviews :show-archived="showArchivedSmartviews" />
        </div>
        <div class="shadow rounded flex flex-col w-full bg-white">
          <LogsIncomeFbarHeader @click="switchLogsIncomeFbarTab" />
          <LogsIncomeFbarBody ref="logsBodyRef" :current-tab="currentLogsIncomeFbarTab" />
        </div>
        <div class="shadow rounded flex flex-col bg-white">
          <PersonalContactHeader @click="switchPersonalsTab" />
          <PersonalContactBody :current-tab="currentPersonalsTab" />
        </div>
      </div>
      <Modal :showing="showDeleteModal">
        <DeleteCard @hide="closeDeleteModal" />
      </Modal>
      <Modal wide :showing="showSmartviewEditModal" @hide="closeSmartviewEditModal">
        <SmartviewEditCard :deleting="isLoading" @hide="closeSmartviewEditModal" @delete="confirmDelete" />
      </Modal>
      <Modal :showing="showDeleteConfirmation" @hide="closeDeleteModal">
        <DeleteType @hide="closeSmartviewDeleteModal" @delete="handleDeleteSmartview" />
      </Modal>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { tabs, models, mutations } from '~/shared/constants'

const initialState = () => ({
  currentFeesChecklistsTab: tabs.fees,
  currentLogsIncomeFbarTab: tabs.logs,
  currentPersonalsTab: tabs.contact,
  showArchivedClients: false,
  showArchivedSmartviews: false,
  showDeleteConfirmation: false,
  isLoading: false,
})

export default {
  name: 'Home',
  data() {
    return initialState()
  },

  computed: {
    ...mapState([models.modals, models.clientClicked]),
    showDeleteModal() {
      return this.modals.delete?.showing
    },
    showSmartviewEditModal() {
      return this.modals.smartview?.showing
    },
    keymap() {
      return {
        command: {
          keydown: this.onCmdPress,
          keyup: this.onCmdUp,
        },
        windows: {
          keydown: this.onCmdPress,
          keyup: this.onCmdUp,
        },
      }
    },
    smartview() {
      return JSON.parse(JSON.stringify(this.modals.smartview?.data))
    },
    headers() {
      return this.$api.getHeaders()
    },
  },
  watch: {
    clientClicked() {
      Object.assign(this.$data, initialState())
    },
  },
  methods: {
    toggleShowArchivedClients() {
      this.showArchivedClients = !this.showArchivedClients
    },
    toggleShowArchivedSmartviews() {
      this.showArchivedSmartviews = !this.showArchivedSmartviews
    },
    switchPersonalsTab(tab) {
      this.currentPersonalsTab = tab
    },
    switchLogsIncomeFbarTab(tab) {
      this.currentLogsIncomeFbarTab = tab
    },
    switchFeesChecklistsTab(tab) {
      this.currentFeesChecklistsTab = tab
    },
    closeDeleteModal() {
      this.$store.commit(mutations.setModelResponse, {
        model: models.modals,
        data: { delete: { showing: false, data: {} } },
      })
    },
    closeSmartviewEditModal() {
      this.$store.commit(mutations.setModelResponse, {
        model: models.modals,
        data: { smartview: { showing: false, data: {} } },
      })
    },
    onCmdPress() {
      this.$store.commit(mutations.setModelResponse, { model: models.cmdPressed, data: true })
    },
    onCmdUp() {
      this.$store.commit(mutations.setModelResponse, { model: models.cmdPressed, data: false })
    },
    confirmDelete() {
      this.showDeleteConfirmation = true
    },
    closeSmartviewDeleteModal() {
      this.showDeleteConfirmation = false
    },
    handleDeleteSmartview() {
      if (this.isLoading) {
        return
      }
      this.isLoading = true
      this.$api.deleteSmartview(this.headers, { smartviewId: this.smartview.id }).then(() => {
        this.isLoading = false
        this.closeSmartviewDeleteModal()
        this.closeSmartviewEditModal()
        this.$store.commit(mutations.setModelResponse, { model: models.selectedSmartview, data: [] })
      })
    },
    resetClock() {
      if (this.$refs.logsBodyRef) {
        this.$refs.logsBodyRef.resetClock()
      }
    },
  },
}
</script>

<style scoped>
  .client-list {
    @apply shadow rounded flex flex-col w-60 bg-white;

    height: 60%;
  }
</style>
