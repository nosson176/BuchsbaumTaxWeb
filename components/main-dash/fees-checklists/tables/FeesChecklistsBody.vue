<template>
  <div class="flex flex-col flex-grow overflow-hidden">
    <div class="flex flex-col bg-blue-200 p-0.5" :class="showFees ? '' : 'shadow'">
      <ViewArchivedHeader :view-active="showActive" @change="archiveToggle" />
      <SearchHeader v-model="searchInput" :active-tab="currentTab" />
    </div>
    <div v-if="!isSelectedClientLoading">
      <FeesTable v-if="showFees" :show-archived="!showFeesActive" />
      <ChecklistsTable v-else-if="showChecklists" :show-archived="!showChecklistsActive" />
    </div>
    <LoadingIndicator v-else class="h-8 w-8 text-black mx-auto my-auto" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { tabs, mutations, models, tableGroups } from '~/shared/constants'

const initialState = () => ({
  searchInputFees: '',
  searchInputChecklists: '',
  showFeesActive: true,
  showChecklistsActive: true,
})

export default {
  name: 'FeesChecklistsBody',
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
    ...mapState([models.loading]),
    showFees() {
      return this.currentTab === tabs.fees
    },
    showChecklists() {
      return this.currentTab === tabs.checklists
    },
    showActive() {
      if (this.showFees) {
        return this.showFeesActive
      } else if (this.showChecklists) {
        return this.showChecklistsActive
      } else {
        return true
      }
    },
    searchInput: {
      get() {
        if (this.showFees) {
          return this.searchInputFees
        } else if (this.showChecklists) {
          return this.searchInputChecklists
        } else {
          return ''
        }
      },
      set(val) {
        if (this.showFees) {
          this.searchInputFees = val
        } else if (this.showChecklists) {
          this.searchInputChecklists = val
        }
      },
    },
    isSelectedClientLoading() {
      return this.loading.selectedClient
    },
  },
  watch: {
    searchInput(searchInput) {
      this.searchInputUpdate(searchInput)
    },
  },
  methods: {
    archiveToggle() {
      if (this.showFees) {
        this.showFeesActive = !this.showFeesActive
      } else if (this.showChecklists) {
        this.showChecklistsActive = !this.showChecklistsActive
      }
    },
    searchInputUpdate(searchInput) {
      this.$store.commit(mutations.setModelResponse, {
        model: models.search,
        data: { [tableGroups.feesChecklists]: searchInput },
      })
    },
  },
}
</script>

<style scoped></style>
