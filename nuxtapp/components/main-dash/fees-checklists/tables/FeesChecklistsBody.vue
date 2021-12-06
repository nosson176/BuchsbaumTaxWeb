<template>
  <div class="flex flex-grow overflow-hidden">
    <FeesTable v-if="showFees" :show-archived="showArchived" />
  </div>
</template>

<script>
import { tabs } from '~/shared/constants'
export default {
  name: 'FeesChecklistsBody',
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
    showFees () {
      return this.currentTab === tabs.fees
    },
    showChecklists () {
      return this.currentTab === tabs.checklists
    }
  }
}
</script>

<style scoped>

</style>
