<template>
  <div class="flex flex-col">
    <LogsIncomeFbarTabs @click="emitTabClick" />
    <ViewArchivedHeader @change="emitChange" />
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
