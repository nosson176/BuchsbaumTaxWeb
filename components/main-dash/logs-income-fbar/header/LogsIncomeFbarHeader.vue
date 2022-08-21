<template>
  <div class="flex flex-col">
    <LogsIncomeFbarTabs :active-tab="activeTab" @click="emitTabClick" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { events, models, tabs } from '~/shared/constants'
export default {
  name: 'LogsIncomeFbarHeader',
  data() {
    return {
      activeTab: tabs.logs,
    }
  },
  computed: {
    ...mapState([models.clientClicked]),
  },
  watch: {
    clientClicked() {
      this.emitTabClick(tabs.logs)
    },
  },
  methods: {
    emitTabClick(tab) {
      this.searchInput = ''
      this.activeTab = tab
      this.$emit(events.click, tab)
    },
  },
}
</script>

<style scoped></style>
