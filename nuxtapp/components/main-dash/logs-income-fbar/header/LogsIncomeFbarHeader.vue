<template>
  <div class="flex flex-col">
    <LogsIncomeFbarTabs @click="emitTabClick" />
    <div class="flex bg-blue-200 p-0.5">
      <ViewArchivedHeader @change="emitChange" />
      <SearchHeader />
    </div>
  </div>
</template>

<script>
import { events } from '~/shared/constants'
export default {
  name: 'LogsIncomeFbarHeader',
  methods: {
    emitChange () {
      this.$emit(events.change)
    },
    emitTabClick (tab) {
      this.$emit(events.click, tab)
    }
  }
}
</script>

<style scoped>

</style>
