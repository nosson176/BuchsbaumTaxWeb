<template>
  <div class="flex space-x-2 justify-center">
    <Tab :active="isLogsActive" :count="logsCount" @click="setTabLogs"> Logs </Tab>
    <Tab :active="isIncomeActive" :count="incomeCount" @click="setTabIncome"> Income </Tab>
    <Tab :active="isFbarActive" :count="fbarCount" @click="setTabFbar"> Fbar </Tab>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { events, models, tabs } from '~/shared/constants'
export default {
  name: 'LogsIncomeFbarTabs',
  props: {
    activeTab: {
      type: String,
      default: tabs.logs,
    },
  },
  computed: {
    ...mapState([models.selectedClient]),
    isLogsActive() {
      return this.activeTab === tabs.logs
    },
    isIncomeActive() {
      return this.activeTab === tabs.income
    },
    isFbarActive() {
      return this.activeTab === tabs.fbar
    },
    logsCount() {
      return this.selectedClient?.logs?.length
    },
    incomeCount() {
      return this.selectedClient?.incomeBreakdowns?.length
    },
    fbarCount() {
      return this.selectedClient?.fbarBreakdowns?.length
    },
  },
  methods: {
    setTabLogs() {
      this.$emit(events.click, tabs.logs)
    },
    setTabIncome() {
      this.$emit(events.click, tabs.income)
    },
    setTabFbar() {
      this.$emit(events.click, tabs.fbar)
    },
  },
}
</script>

<style scoped></style>
