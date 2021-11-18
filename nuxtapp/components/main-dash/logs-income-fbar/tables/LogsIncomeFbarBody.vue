<template>
  <div class="flex flex-grow overflow-hidden">
    <LogsTable v-if="showLogs" :show-archived="showArchived" />
    <IncomeTable v-else-if="showIncome" :show-archived="showArchived" />
    <FbarTable v-else-if="showFbar" :show-archived="showArchived" />
  </div>
</template>

<script>
import { tabs } from '~/shared/constants'
export default {
  name: 'LogsIncomeFbarBody',
  props: {
    showArchived: {
      type: Boolean,
      default: false
    },
    currentTab: {
      type: String,
      default: ''
    }
  },
  computed: {
    showLogs () {
      return this.currentTab === tabs.logs
    },
    showIncome () {
      return this.currentTab === tabs.income
    },
    showFbar () {
      return this.currentTab === tabs.fbar
    }
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
