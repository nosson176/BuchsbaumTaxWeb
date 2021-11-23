<template>
  <div class="flex flex-col">
    <LogsIncomeFbarTabs @click="emitTabClick" />
    <div class="flex bg-blue-200 p-0.5">
      <ViewArchivedHeader @change="emitChange" />
      <SearchHeader v-model="searchInput" @input="onSearchInput" />
    </div>
  </div>
</template>

<script>
import { events } from '~/shared/constants'
export default {
  name: 'LogsIncomeFbarHeader',
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
    onSearchInput () {
      this.$emit(events.input, this.searchInput)
    }
  }
}
</script>

<style scoped>

</style>
