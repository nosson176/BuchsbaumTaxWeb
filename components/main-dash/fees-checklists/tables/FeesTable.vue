<template>
  <div class="flex-grow overflow-auto">
    <div class="bg-white sticky top-0 shadow">
      <AddRowButton @click="onAddRowClick" />
    </div>
    <FeesItem v-for="(fee, idx) in displayedFees" :key="idx" :idx="idx" :fee="fee" :is-new="newFeeId === fee.id"
      @input="handleUpdateFee" @delete="onDeleteClick" :headers="headers" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment-timezone';
import { models, mutations, tableGroups, tabs } from '~/shared/constants'
import { generateRandomId, searchArrOfObjs } from '~/shared/utility'
export default {
  name: 'FeesTable',
  props: {
    showArchived: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      newFeeId: NaN,
      updateFees: [],
      oldValue: ''
    }
  },
  computed: {
    ...mapState([models.selectedClient]),
    headers() {
      return this.$api.getHeaders()
    },
    displayedFees() {
      const fees = this.filteredFees
      const newFeeIdx = fees?.findIndex((fee) => fee.id === this.newFeeId)
      if (newFeeIdx > -1) {
        const tempFee = fees[newFeeIdx]
        fees.splice(newFeeIdx, 1)
        fees.unshift(tempFee)
      }
      return searchArrOfObjs(fees, this.searchInput)
    },
    filteredFees() {
      if (this.fees) {
        return this.fees.filter((fee) => this.showArchived === fee.archived).sort((a, b) => b.years - a.years)
      } else {
        return null
      }
    },
    fees() {
      if (this.selectedClient?.fees) {
        // return JSON.parse(JSON.stringify(this.selectedClient.fees))
        return this.selectedClient?.fees || null;
      } else {
        return null
      }
    },
    searchInput() {
      return this.search?.[tableGroups.feesChecklists]
    },
  },
  mounted() {

    window.addEventListener('beforeunload', this.handleBeforeUnload);
  },
  beforeDestroy() {
    if (this.updateFees.length > 0) this.sendFeesToServer()
  },
  methods: {
    handleBeforeUnload(event) {
      if (this.updateFees.length > 0) {
        this.sendFeesToServer();
        // Optionally, to show a confirmation dialog
        event.preventDefault();
        event.returnValue = '';
      }
    },
    handleUpdateFee(editedFee) {
      console.log(editedFee)
      const feeCopy = JSON.parse(JSON.stringify(editedFee));
      const index = this.updateFees.findIndex(fee => fee.id === editedFee.id)
      if (index !== -1) {
        console.log(feeCopy)
        this.updateFees[index] = feeCopy
      } else {
        this.updateFees.push(feeCopy)
      }
      this.$store.dispatch('updateFeeAction', { fee: editedFee });
    },
    sendFeesToServer() {
      this.updateFees.forEach(async fee => {
        fee.dateFee = await this.formatUnixTimestamp(fee.dateFee)
      })
      this.$api.updateFees(this.headers, this.updateFees)
    },
    formatUnixTimestamp(unixTimeMillis) {
      return moment(unixTimeMillis)
        .tz('Asia/Jerusalem')
        .format('YYYY-MM-DD'); // No timezone offset
    },
    onAddRowClick() {
      if (!this.selectedClient) {
        return
      }
      const clientId = this.selectedClient.id
      const defaultValues = {
        clientId,
        archived: false,
        id: generateRandomId(),
      }
      const fee = Object.assign({}, defaultValues)
      this.updateFees.push(fee)
      this.$store.commit('pushNewFee', {
        state: this.selectedClient,
        fee
      });
    },
    onModalClose(confirmed) {
      if (confirmed && this.delete.onConfirm) {
        this.delete.onConfirm();
      }
      this.delete.showing = false;
    },
    async onDeleteClick(feeId) {
      const fee = this.displayedFees.find((fee) => fee.id === feeId);
      // Create a new object with updated properties
      const updatedFee = {
        ...fee,
        archived: !fee.archived,
        dateFee: await this.formatUnixTimestamp(fee.dateFee)
      };
      if (this.showArchived) {

        // Commit mutation with the new fee object
        this.$store.commit('updateFee', { fee: updatedFee });
        this.handleUpdateFee(updatedFee)

        // Call API update with the modified fee
        this.$api.updateFee(this.headers, {
          clientId: this.selectedClient.id,
          feeId
        }, updatedFee);
      } else {
        this.$store.commit(mutations.setModelResponse, {
          model: models.modals,
          data: {
            delete: {
              showing: true,
              data: {
                id: feeId,
                type: tabs.fees,
                label: 'misc/fee item',
                // Add a callback to be triggered on confirmation
                onConfirm: () => {
                  this.handleUpdateFee(updatedFee);
                }
              }
            }
          },
        });
      }
    }
  },
}
</script>

<style scoped>
.even {
  @apply bg-gray-50;
}
</style>
