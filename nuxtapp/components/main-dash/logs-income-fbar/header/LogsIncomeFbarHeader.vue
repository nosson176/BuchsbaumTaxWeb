<template>
  <div class="flex flex-col">
    <LogsIncomeFbarTabs @click="emitTabClick" />
    <div class="flex bg-blue-200 p-0.5">
      <ViewArchivedHeader @change="emitChange" />
      <SearchHeader v-model="searchInput" />
    </div>
  </div>
</template>

<script>
import { events, models, mutations } from '~/shared/constants'
export default {
  name: 'LogsIncomeFbarHeader',
  data () {
    return {
      searchInput: ''
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
      this.$emit(events.click, tab)
    },
    searchInputUpdate (searchInput) {
      this.$store.commit(
        mutations.setModelResponse,
        { model: models.search, data: { logsIncomeFbar: searchInput } }
      )
    }
  }
}
</script>

<style scoped>

</style>
