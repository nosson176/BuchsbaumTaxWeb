<template>
  <div class="flex flex-col flex-grow overflow-hidden">
    <div class="flex bg-blue-200 p-0.5">
      <ViewArchivedHeader :view-active="showActive" @change="archiveToggle" />
      <SearchHeader v-model="searchInput" :active-tab="currentTab" />
    </div>
    <LoadingIndicator v-if="showLoadingSpinner" class="h-8 w-8 text-black mx-auto my-auto" />
    <KeepAlive v-else>
      <LogsTable v-if="showLogs" :show-archived="!showActiveLogs" />
      <IncomeTable v-else-if="showIncome" :show-archived="!showActiveIncome" />
      <FbarTable v-else-if="showFbar" :show-archived="!showActiveFbar" />
    </KeepAlive>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { tabs, mutations, models, tableGroups } from '~/shared/constants'

const initialState = () => ({
  searchInputLogs: '',
  searchInputIncome: '',
  searchInputFbar: '',
  showActiveLogs: true,
  showActiveIncome: true,
  showActiveFbar: true,
  clickOnClient: false,
})

export default {
  name: 'LogsIncomeFbarBody',
  props: {
    currentTab: {
      type: String,
      default: '',
    },
  },
  data() {
    return initialState()
  },
  computed: {
    ...mapState([models.loading, models.clientClicked]),
    showLogs() {
      return this.currentTab === tabs.logs
    },
    showIncome() {
      return this.currentTab === tabs.income
    },
    showFbar() {
      return this.currentTab === tabs.fbar
    },
    showActive() {
      if (this.showLogs) {
        return this.showActiveLogs
      } else if (this.showIncome) {
        return this.showActiveIncome
      } else if (this.showFbar) {
        return this.showActiveFbar
      } else {
        return true
      }
    },
    searchInput: {
      get() {
        if (this.showLogs) {
          return this.searchInputLogs
        } else if (this.showIncome) {
          return this.searchInputIncome
        } else if (this.showFbar) {
          return this.searchInputFbar
        } else {
          return ''
        }
      },
      set(val) {
        if (this.showLogs) {
          this.searchInputLogs = val
        } else if (this.showIncome) {
          this.searchInputIncome = val
        } else if (this.showFbar) {
          this.searchInputFbar = val
        }
      },
    },
    isSelectedClientLoading() {
      return this.loading.selectedClient
    },
    showLoadingSpinner() {
      return this.isSelectedClientLoading && this.clickOnClient
    },
  },
  watch: {
    searchInput(searchInput) {
      this.searchInputUpdate(searchInput)
    },
    clientClicked() {
      this.clickOnClient = true
    },
    isSelectedClientLoading() {
      if (!this.isSelectedClientLoading) {
        this.clickOnClient = false
      }
    },
  },
  methods: {
    searchInputUpdate(searchInput) {
      this.$store.commit(mutations.setModelResponse, {
        model: models.search,
        data: { [tableGroups.logsIncomeFbar]: searchInput },
      })
    },
    archiveToggle(value) {
      if (this.showLogs) {
        this.showActiveLogs = value
      } else if (this.showIncome) {
        this.showActiveIncome = value
      } else if (this.showFbar) {
        this.showActiveFbar = value
      }
    },
  },
}
</script>

<style scoped></style>
