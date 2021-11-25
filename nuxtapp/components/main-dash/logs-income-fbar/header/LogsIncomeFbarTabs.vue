<template>
  <div class="flex space-x-2">
    <Tab :active="isLogsActive" @click="setTabLogs">
      Logs
    </Tab>
    <Tab :active="isIncomeActive" @click="setTabIncome">
      Income
    </Tab>
    <Tab :active="isFbarActive" @click="setTabFbar">
      Fbar
    </Tab>
  </div>
</template>

<script>
import { events, tabs } from '~/shared/constants'
export default {
  name: 'LogsIncomeFbarTabs',
  props: {
    activeTab: {
      type: String,
      default: tabs.logs
    }
  },
  computed: {
    isLogsActive () {
      return this.activeTab === tabs.logs
    },
    isIncomeActive () {
      return this.activeTab === tabs.income
    },
    isFbarActive () {
      return this.activeTab === tabs.fbar
    }
  },
  methods: {
    setTabLogs () {
      this.$emit(events.click, tabs.logs)
    },
    setTabIncome () {
      this.$emit(events.click, tabs.income)
    },
    setTabFbar () {
      this.$emit(events.click, tabs.fbar)
    }
  }
}
</script>

<style scoped>

</style>
