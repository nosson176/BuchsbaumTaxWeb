<template>
  <div class="flex space-x-2">
    <Tab :active="isFeesActive" @click="setTabFees">
      Fees
    </Tab>
    <Tab :active="isChecklistsActive" @click="setTabChecklists">
      Checklists
    </Tab>
  </div>
</template>

<script>
import { events, tabs } from '~/shared/constants'
export default {
  name: 'FeesChecklistsTabs',
  props: {
    activeTab: {
      type: String,
      default: tabs.fees
    }
  },
  computed: {
    isFeesActive () {
      return this.activeTab === tabs.fees
    },
    isChecklistsActive () {
      return this.activeTab === tabs.checklists
    }
  },
  methods: {
    setTabFees () {
      this.$emit(events.click, tabs.fees)
    },
    setTabChecklists () {
      this.$emit(events.click, tabs.checklists)
    }
  }
}
</script>

<style scoped>

</style>
