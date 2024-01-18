<template>
  <div class="flex flex-col">
    <FeesChecklistsTabs :active-tab="activeTab" @click="emitTabClick" />
  </div>
</template>

<script>
import { events, models, mutations, tabs, tableGroups } from '~/shared/constants'
export default {
  name: 'FeesChecklistsHeader',
  data() {
    return {
      searchInput: '',
      activeTab: tabs.fees,
    }
  },
  watch: {
    searchInput(searchInput) {
      this.searchInputUpdate(searchInput)
    },
  },
  methods: {
    emitTabClick(tab) {
      this.searchInput = ''
      this.activeTab = tab
      this.$emit(events.click, tab)
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
