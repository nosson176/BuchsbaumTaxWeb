<template>
  <div class="flex-grow overflow-auto">
    <div class="bg-white sticky top-0 shadow">
      <AddRowButton @click="onAddRowClick" />
    </div>
    <FeesItem
      v-for="(fee, idx) in displayedFees"
      :key="idx"
      :idx="idx"
      :fee="fee"
      :is-new="newFeeId === fee.id"
      @input="handleUpdateFee"
    />
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
  data () {
    return {
      newFeeId: NaN
    }
  },
  computed: {
    ...mapState([models.selectedClient]),
    headers () {
      return this.$api.getHeaders()
    },
    displayedFees () {
      const fees = this.filteredFees
      const newFeeIdx = fees?.findIndex(fee => fee.id === this.newFeeId)
      if (newFeeIdx > -1) {
        const tempFee = fees[newFeeIdx]
        fees.splice(newFeeIdx, 1)
        fees.unshift(tempFee)
      }
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
      this.$api.updateFee(this.headers, { clientId: this.selectedClient.id, feeId: editedFee.id }, editedFee)
    },
    onAddRowClick () {
      if (!this.selectedClient) {
        return
      }
      const clientId = this.selectedClient.id
      const defaultValues = {
        clientId
      }
      const fee = Object.assign({}, defaultValues)
      this.$api.createFee(this.headers, { clientId, fee })
        .then(async (data) => {
          await this.$api.getClientData(this.headers, this.selectedClient.id)
          this.newFeeId = data.id
        })
    }
  }
}
</script>

<style scoped>
.even {
  @apply bg-gray-50;
}
</style>
