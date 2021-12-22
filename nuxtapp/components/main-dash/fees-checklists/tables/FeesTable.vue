<template>
  <div class="flex-grow overflow-auto">
    <FeesItem v-for="(fee, idx) in displayedFees" :key="idx" :idx="idx" :fee="fee" @input="handleUpdateFee" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { models, tableGroups } from '~/shared/constants'
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
    headers () {
      return this.$api.getHeaders()
    },
    displayedFees () {
      const fees = this.filteredFees
      return searchArrOfObjs(fees, this.searchInput)
    },
    filteredFees () {
      if (this.fees) {
        return this.fees
          .filter(fee => this.showArchived === fee.archived)
          .sort((a, b) => b.years - a.years)
      } else {
        return null
      }
    },
    fees () {
      if (this.selectedClient?.fees) {
        return JSON.parse(JSON.stringify(this.selectedClient.fees))
      } else {
        return null
      }
    },
    searchInput () {
      return this.search?.[tableGroups.feesChecklists]
    }
  },
  methods: {
    handleUpdateFee (editedFee) {
      this.$api.updateFee(this.headers, { feeId: editedFee.id }, editedFee)
        .then(() => this.$api.getClientData(this.headers, this.selectedClient.id))
    }
  }
}
</script>

<style scoped>
.even {
  @apply bg-gray-50;
}
</style>
