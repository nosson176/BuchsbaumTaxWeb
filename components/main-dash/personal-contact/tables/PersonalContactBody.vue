<template>
  <div class="flex flex-col flex-grow overflow-hidden">
    <div class="flex bg-blue-200 p-0.5">
      <ViewArchivedHeader :view-active="showActive" @change="archiveToggle" />
      <SearchHeader v-model="searchInput" :active-tab="currentTab" />
    </div>
    <LoadingIndicator v-if="showLoadingSpinner" class="h-8 w-8 text-black mx-auto my-auto" />
    <KeepAlive v-else>
      <TaxPersonalsTable v-if="showTaxPersonals" :show-archived="!showActivePersonals" />
      <ContactTable v-else-if="showContacts" :show-archived="!showActiveContacts" />
    </KeepAlive>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { tabs, mutations, models, tableGroups } from '~/shared/constants'

const initialState = () => ({
  searchInputPersonals: '',
  searchInputContacts: '',
  showActivePersonals: true,
  showActiveContacts: true,
  clickOnClient: false,
})

export default {
  name: 'PersonalContactBody',
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
    showTaxPersonals() {
      return this.currentTab === tabs.tax_personals
    },
    showContacts() {
      return this.currentTab === tabs.contact
    },
    showActive() {
      if (this.showTaxPersonals) {
        return this.showActivePersonals
      } else if (this.showContacts) {
        return this.showActiveContacts
      } else {
        return true
      }
    },
    searchInput: {
      get() {
        if (this.showTaxPersonals) {
          return this.searchInputPersonals
        } else if (this.showContacts) {
          return this.searchInputContacts
        } else {
          return ''
        }
      },
      set(val) {
        if (this.showTaxPersonals) {
          this.searchInputPersonals = val
        } else if (this.showContacts) {
          this.searchInputContacts = val
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
    archiveToggle() {
      if (this.showTaxPersonals) {
        this.showActivePersonals = !this.showActivePersonals
      } else if (this.showContacts) {
        this.showActiveContacts = !this.showActiveContacts
      }
    },
    searchInputUpdate(searchInput) {
      this.$store.commit(mutations.setModelResponse, {
        model: models.search,
        data: { [tableGroups.personalContact]: searchInput },
      })
    },
  },
}
</script>

<style scoped></style>
