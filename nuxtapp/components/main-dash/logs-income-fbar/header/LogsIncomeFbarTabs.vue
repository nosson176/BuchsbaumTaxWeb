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
  data () {
    return {
      activeTab: tabs.logs
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
      this.setActiveTab(tabs.logs)
    },
    setTabIncome () {
      this.$emit(events.click, tabs.income)
      this.setActiveTab(tabs.income)
    },
    setTabFbar () {
      this.$emit(events.click, tabs.fbar)
      this.setActiveTab(tabs.fbar)
    },
    setActiveTab (tab) {
      this.activeTab = tab
    }
  }
}
</script>

<style scoped>

</style>
