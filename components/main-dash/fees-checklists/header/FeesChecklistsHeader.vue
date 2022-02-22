<template>
  <div class="flex flex-col">
    <FeesChecklistsTabs :active-tab="activeTab" @click="emitTabClick" />
    <div class="flex flex-col bg-blue-200 p-0.5" :class="isFeesTabActive ? '' : 'shadow'">
      <ViewArchivedHeader @change="emitChange" />
      <SearchHeader v-model="searchInput" :active-tab="activeTab" />
    </div>
  </div>
</template>

<script>
import { events, models, mutations, tabs, tableGroups } from '~/shared/constants'
export default {
  name: 'FeesChecklistsHeader',
  data () {
    return {
      searchInput: '',
      activeTab: tabs.fees

    }
  },
  computed: {
    isFeesTabActive () {
      return this.activeTab === tabs.fees
    }
  },
  watch: {
    searchInput (searchInput) {
      this.searchInputUpdate(searchInput)
    }
  },
  methods: {
    emitChange () {
      this.$emit(events.change)
    },
    emitTabClick (tab) {
      this.searchInput = ''
      this.activeTab = tab
      this.$emit(events.click, tab)
    },
    searchInputUpdate (searchInput) {
      this.$store.commit(
        mutations.setModelResponse,
        { model: models.search, data: { [tableGroups.feesChecklists]: searchInput } }
      )
    }
  }
}
</script>

<style scoped>

</style>
