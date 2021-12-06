<template>
  <div class="flex flex-col">
    <LogsIncomeFbarTabs :active-tab="activeTab" @click="emitTabClick" />
    <div class="flex bg-blue-200 p-0.5">
      <ViewArchivedHeader @change="emitChange" />
      <SearchHeader v-model="searchInput" :active-tab="activeTab" />
    </div>
  </div>
</template>

<script>
import { events, models, mutations, tableGroups, tabs } from '~/shared/constants'
export default {
  name: 'LogsIncomeFbarHeader',
  data () {
    return {
      searchInput: '',
      activeTab: tabs.logs
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
        { model: models.search, data: { [tableGroups.logsIncomeFbar]: searchInput } }
      )
    }
  }
}
</script>

<style scoped>

</style>
