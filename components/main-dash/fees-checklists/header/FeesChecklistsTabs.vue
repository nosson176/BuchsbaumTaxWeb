<template>
  <div class="flex space-x-2 justify-center">
    <Tab :active="isFeesActive" :count="feesCount" @click="setTabFees">
      Fees
    </Tab>
    <Tab :active="isChecklistsActive" :count="checklistsCount" @click="setTabChecklists">
      Checklists
    </Tab>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { events, models, tabs } from '~/shared/constants'
export default {
  name: 'FeesChecklistsTabs',
  props: {
    activeTab: {
      type: String,
      default: tabs.fees
    }
  },
  computed: {
    ...mapState([models.selectedClient]),
    isFeesActive () {
      return this.activeTab === tabs.fees
    },
    isChecklistsActive () {
      return this.activeTab === tabs.checklists
    },
    feesCount () {
      return this.selectedClient?.fees?.filter(fee => !fee.archived).length
    },
    checklistsCount () {
      return this.selectedClient?.checklists?.filter(checklist => !checklist.archived).length
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
