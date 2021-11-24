<template>
  <div class="flex flex-col">
    <PersonalContactTabs @click="emitTabClick" />
    <div class="flex bg-blue-200 p-0.5">
      <ViewArchivedHeader @change="emitChange" />
      <SearchHeader v-model="searchInput" @input="onSearchInput" />
    </div>
  </div>
</template>

<script>
import { events, models, mutations } from '~/shared/constants'
export default {
  name: 'PersonalContactHeader',
  data () {
    return {
      searchInput: ''
    }
  },
  methods: {
    emitChange () {
      this.$emit(events.change)
    },
    emitTabClick (tab) {
      this.$emit(events.click, tab)
    },
    onSearchInput (searchInput) {
      this.searchInputUpdate(searchInput)
    },
    searchInputUpdate (searchInput) {
      this.$store.commit(
        mutations.setModelResponse,
        { model: models.search, data: { personalContact: searchInput } }
      )
    }
  }
}
</script>

<style scoped>

</style>
