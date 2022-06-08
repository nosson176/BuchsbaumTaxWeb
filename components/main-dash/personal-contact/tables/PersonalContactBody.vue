<template>
  <div class="flex flex-col flex-grow overflow-hidden">
    <div class="flex bg-blue-200 p-0.5">
      <ViewArchivedHeader :view-active="showActive" @change="archiveToggle" />
      <SearchHeader v-model="searchInput" :active-tab="currentTab" />
    </div>
    <TaxPersonalsTable v-if="showTaxPersonals" :show-archived="!showActivePersonals" />
    <ContactTable v-else-if="showContacts" :show-archived="!showActiveContacts" />
  </div>
</template>

<script>
import { tabs } from '~/shared/constants'
export default {
  name: 'PersonalContactBody',
  props: {
    currentTab: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      searchInput: '',
      showActivePersonals: true,
      showActiveContacts: true,
    }
  },
  computed: {
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
  },
  methods: {
    archiveToggle() {
      if (this.showTaxPersonals) {
        this.showActivePersonals = !this.showActivePersonals
      } else if (this.showContacts) {
        this.showActiveContacts = !this.showActiveContacts
      }
    },
  },
}
</script>

<style scoped></style>
