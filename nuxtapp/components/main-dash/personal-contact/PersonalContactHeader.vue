<template>
  <div class="flex flex-col">
    <PersonalContactTabs @click="emitTabClick" />
    <ViewArchivedHeader @change="emitChange" />
  </div>
</template>

<script>
import { events } from '~/shared/constants'
export default {
  name: 'PersonalContactHeader',
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
