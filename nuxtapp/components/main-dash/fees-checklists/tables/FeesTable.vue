<template>
  <div class="flex-grow overflow-auto">
    <FeesItem v-for="(fee, idx) in displayedFees" :key="idx" :idx="idx" :fee="fee" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { models } from '~/shared/constants'
import { searchArrOfObjs } from '~/shared/utility'
export default {
  name: 'FeesTable',
  props: {
    showArchived: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState([models.selectedClient]),
    displayedFees () {
      let fees = []
      if (!this.showArchived) {
        fees = this.notArchived
      } else {
        fees = this.archived
      }
      return searchArrOfObjs(fees, this.searchInput)
    },
    notArchived () {
      if (this.fees) {
        return this.fees
          .filter(fee => !fee.archived)
          .sort((a, b) => b.years - a.years)
      } else {
        return null
      }
    },
    archived () {
      if (this.fees) {
        return this.fees
          .filter(fee => fee.archived)
          .sort((a, b) => b.years - a.years)
      } else {
        return null
      }
    },
    classObj () {
      const even = this.idx % 2 === 0
      return { even }
    },
    selectedClientId () {
      return this.selectedClient.id
    },
    fees () {
      if (this.selectedClient?.fees) {
        return JSON.parse(JSON.stringify(this.selectedClient.fees))
      } else {
        return null
      }
    }
  },
  methods: {

  }
}
</script>

<style scoped>
.even {
  @apply bg-gray-50;
}
</style>
