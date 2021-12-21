<template>
  <div class="w-full">
    <ChecklistItem v-for="(checklist,idx) in displayedChecklists" :key="idx" :odd="idx%2" :checklist="checklist" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { models, tableGroups } from '~/shared/constants'
import { searchArrOfObjs } from '~/shared/utility'

export default {
  name: 'ChecklistsTable',
  props: {
    showArchived: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState([models.valueTypes, models.selectedClient]),
    displayedChecklists () {
      const checklists = this.filteredChecklists
      return searchArrOfObjs(checklists, this.searchInput)
    },
    checklists () {
      if (this.selectedClient?.checklists) {
        return JSON.parse(JSON.stringify(this.selectedClient.checklists))
      } else {
        return null
      }
    },
    filteredChecklists () {
      if (this.checklists) {
        return this.checklists
          .filter(fee => this.showArchived === fee.archived)
      } else {
        return null
      }
    },
    searchInput () {
      return this.search?.[tableGroups.feesChecklists]
    }
  }
}
</script>

<style scoped>

</style>
