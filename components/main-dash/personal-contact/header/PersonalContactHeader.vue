<template>
  <div class="flex flex-col">
    <PersonalContactTabs :active-tab="activeTab" @click="emitTabClick" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { events, models, mutations, tableGroups, tabs } from '~/shared/constants'
export default {
  name: 'PersonalContactHeader',
  data() {
    return {
      searchInput: '',
      activeTab: tabs.tax_personals,
    }
  },
  computed: {
    ...mapState([models.selectedClient]),
  },
  watch: {
    searchInput(searchInput) {
      this.searchInputUpdate(searchInput)
    },
    selectedClient(newVal, oldVal) {
      if (newVal.id !== oldVal.id) {
        this.emitTabClick(tabs.contact)
      }
    },
  },
  methods: {
    emitChange() {
      this.$emit(events.change)
    },
    emitTabClick(tab) {
      this.searchInput = ''
      this.activeTab = tab
      this.$emit(events.click, tab)
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
