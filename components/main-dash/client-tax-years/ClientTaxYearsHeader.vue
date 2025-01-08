<template>
  <div class="header">
    <div v-if="isClientSelected" class="w-full flex items-center">
      <div>
        <FlagIcon class="h-6 w-6 cursor-pointer" :color="flagColorGlobal" @click="toggleShowGlobalFlagDropdown" />
        <FlagDropdown v-if="showGlobalFlagDropdown" @input="this.updateGlobalFlag"
          @blur="toggleShowGlobalFlagDropdown" />
      </div>
      <div class="font-bold text-2xl cursor-pointer ml-4" @click="openEditNameDialogue">
        {{ selectedClient.lastName }}
      </div>
      <div>
        <FlagIcon class="h-5 w-5 cursor-pointer" :color="flagColor" @click="toggleShowFlagDropdown" />
        <FlagDropdown v-if="showFlagDropdown" @input="handleFlag" @blur="toggleShowFlagDropdown" />
      </div>
      <div class="ml-12">
        <ClientTaxYearsHeaderPersonal :personal="primaryPersonal" />
        <ClientTaxYearsHeaderPersonal :personal="secondaryPersonal" />
      </div>
      <div class="font-bold text-white flex justify-center text-2xl ml-20" @click="setEditable('status')">
        <EditableSelectCell :value="selectedClient.status" :options="statusOptions" :is-editable="isEditable('status')"
          @input="updateStatusDate" @blur="onBlur('status')" />
      </div>
      <div class="text-gray-100 flex text-sm justify-center ml-20" @click="setEditable('periodical')">
        <EditableSelectCell :value="selectedClient.periodical" :options="periodicalOptions"
          :is-editable="isEditable('periodical')" @input="updatePeriodical" @blur="onBlur" />
      </div>
      <div class="text-sm ml-24">{{ formattedCreatedDate }}</div>
      <div v-if="isArchived" class="place-self-end">
        <button type="button"
          class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
          @click="confirmDelete">
          <LoadingIndicator v-if="isLoading" class="px-4 cursor-not-allowed h-5 w-5 text-white" />
          <span v-else class="capitalize">Delete</span>
        </button>
      </div>
      <div class="ml-24 font-bold text-lg" :class="dollarsClassObj">{{ summationDollars }}</div>
      <div class="ml-6 font-bold text-lg" :class="shekelsClassObj">{{ summationShekels }}</div>
    </div>
    <Modal :showing="showEditNameDialogue">
      <SubmitCard :loading="isLastNameUpdateLoading" @hide="closeEditNameDialogue" @submit="handleUpdate('lastName')">
        <FormInput ref="lastNameInput" v-model="editedLastName" label="Lastname" />
      </SubmitCard>
    </Modal>
    <Modal :showing="showDelete" @hide="closeDeleteModal">
      <DeleteType @hide="closeDeleteModal" @delete="handleDelete" />
    </Modal>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { categories, models, mutations } from '~/shared/constants'
// import { formatDateForClient } from '~/shared/domain-utilities'
import { formatAsILCurrency, formatAsUSCurrency, formatUnixTimestamp } from '~/shared/utility'

export default {
  name: 'ClientTaxYearsHeader',
  data() {
    return {
      editingId: '',
      showEditNameDialogue: false,
      isLastNameUpdateLoading: false,
      isLoading: false,
      showDelete: false,
      showFlagDropdown: false,
      showGlobalFlagDropdown: false,
      editedLastName: '',
      globalFlag: null,
    }
  },
  computed: {
    ...mapState([models.selectedClient, models.valueTypes, models.clients, models.currentUser, models.clientClicked]),
    isClientSelected() {
      return this.selectedClient && Object.keys(this.selectedClient).length > 0
    },
    flagColor() {
      return this.selectedClient?.flag || 4
    },

    flagColorGlobal() {
      return this.selectedClient?.gflag || 4
    },
    primaryPersonal() {
      return this.selectedClient?.taxPersonals?.filter((personal) => personal.category === categories.primary)[0]
    },
    secondaryPersonal() {
      return this.selectedClient?.taxPersonals?.filter((personal) => personal.category === categories.secondary)[0]
    },
    formattedCreatedDate() {
      if (this.selectedClient?.logs?.length) {
        const firstLog = this.selectedClient.logs[this.selectedClient.logs.length - 1]
        return formatUnixTimestamp(firstLog.logDate)
      }
      if (this.selectedClient.created) {
        return formatUnixTimestamp(this.selectedClient.created)
        // return formatDateForClient(this.selectedClient.created)
      }
      return ''
    },
    statusOptions() {
      return this.valueTypes.status || []
    },
    periodicalOptions() {
      return this.valueTypes.periodical || []
    },
    isArchived() {
      return this.selectedClient.archived
    },
    headers() {
      return this.$api.getHeaders()
    },
    // totalOwedDollars() {
    //   const owes = this.selectedClient.owesDollars + this.selectedClient.feesOwesDollars
    //   const paid = this.selectedClient.paidDollars + this.selectedClient.feesPaidDollars
    //   return owes - paid
    // },
    // totalOwedShekels() {
    //   const owes = this.selectedClient.owesShekels + this.selectedClient.feesOwesShekels
    //   const paid = this.selectedClient.paidShekels + this.selectedClient.feesPaidShekels
    //   return owes - paid
    // },
    totalOwedDollars() {
      let total = 0;
      if (this.selectedClient && this.selectedClient.taxYears) {
        this.selectedClient.taxYears.forEach(taxYear => {
          if (taxYear.filings) {
            taxYear.filings.forEach(filing => {
              if (filing.currency === 'USD' || !filing.currency) { // Default to USD if no currency
                if (filing.includeInRefund) {
                  total += (filing.owes || 0);
                  total -= (filing.paid || 0);
                }
                if (filing.includeFee) {
                  total += (filing.owesFee || 0);
                  total -= (filing.paidFee || 0);
                }
              }
            });
          }
        });
      }
      return total;
    },

    totalOwedShekels() {
      let total = 0;
      if (this.selectedClient && this.selectedClient.taxYears) {
        this.selectedClient.taxYears.forEach(taxYear => {
          if (taxYear.filings) {
            taxYear.filings.forEach(filing => {
              if (filing.currency === 'NIS') {
                if (filing.includeInRefund) {
                  total += (filing.owes || 0);
                  total -= (filing.paid || 0);
                }
                if (filing.includeFee) {
                  total += (filing.owesFee || 0);
                  total -= (filing.paidFee || 0);
                }
              }
            });
          }
        });
      }
      return total;
    },

    dollarsClassObj() {
      return {
        'text-green-400': this.totalOwedDollars <= 0,
        'text-red-400': this.totalOwedDollars > 0,
      }
    },
    shekelsClassObj() {
      return {
        'text-green-400': this.totalOwedShekels <= 0,
        'text-red-400': this.totalOwedShekels > 0,
      }
    },
    summationDollars() {
      return !isNaN(this.totalOwedDollars) ? formatAsUSCurrency(this.totalOwedDollars) : ''
    },
    summationShekels() {
      return !isNaN(this.totalOwedShekels) ? formatAsILCurrency(this.totalOwedShekels) : ''
    },
  },
  watch: {
    showEditNameDialogue: {
      handler(newVal) {
        if (newVal) {
          this.editedLastName = this.selectedClient.lastName
          this.$nextTick(() => {
            this.$refs.lastNameInput.$refs.input.focus()
          })
        }
      },
    },
    selectedClient: {
      handler(newClient, oldClient) {
        if (newClient.id !== oldClient.id && oldClient.id !== undefined) {
          this.updateClient1(oldClient)
        }
      },
      deep: true,  // Watch for nested object changes as well
    },
    watchFilingChanges: {
      handler(newFiling) {
        if (!newFiling) return;

        // Calculate new totals and update store
        this.$store.commit('updateTotals', {
          dollars: this.totalOwedDollars,
          shekels: this.totalOwedShekels
        });
      },
      deep: true
    }
  },


  methods: {
    ...mapMutations({
      updateSelectedClient: mutations.setModelResponse
    }),
    updateClient1(oldClient) {
      if (oldClient.needUpdate === true) {
        const updatedClient = {
          id: oldClient.id,
          status: oldClient.status,
          owesStatus: oldClient.owesStatus,
          periodical: oldClient.periodical,
          lastName: oldClient.lastName,
          archived: oldClient.archived,
          displayName: oldClient.displayName,
          displayPhone: oldClient.displayPhone,
          statusChangeDate: oldClient.statusChangeDate,
          gFlag: oldClient.gflag,
          active: oldClient.active
        };
        this.$api.updateClient(this.headers, { clientId: updatedClient.id, client: updatedClient })
      }
    },
    setEditable(editingId) {
      this.editingId = editingId
    },
    isEditable(editingId) {
      return this.editingId === editingId
    },
    checkActiveStatus(val) {
      const values = ['INTERNAL', 'ITIN PENDING', 'MISSING', 'W/ SHUMA', 'WAITING', 'READY', 'FBAR'];
      return values.some(status => val.startsWith(status));
    },
    async updateStatusDate(newVal) {
      const active = await this.checkActiveStatus(newVal)
      this.updateSelectedClient({
        model: models.selectedClient,
        data: { ...this.selectedClient, status: newVal, statusChangeDate: Date.now(), active }
      })
    },
    updatePeriodical(newPeriodical) {
      this.updateSelectedClient({
        model: models.selectedClient,
        data: { ...this.selectedClient, periodical: newPeriodical }
      })
    },

    updateLastName(newLastName) {
      this.updateSelectedClient({
        model: models.selectedClient,
        data: { ...this.selectedClient, lastName: newLastName }
      })
      this.$store.commit('updateLastNameClient', { selectedClient: this.selectedClient, lastName: newLastName })
    },

    updateGlobalFlag(globalFlag) {
      this.updateSelectedClient({
        model: models.selectedClient,
        data: { ...this.selectedClient, gflag: globalFlag, needUpdate: true }
      })
      this.showGlobalFlagDropdown = false
      const clientFlag = {
        clientId: this.selectedClient.id,
        userId: this.currentUser.id,
        flag: globalFlag
      }
      this.$store.dispatch('updateGlobalFlagAction', { gFlag: clientFlag });
    },

    needUpdate() {
      this.updateSelectedClient({
        model: models.selectedClient,
        data: { ...this.selectedClient, needUpdate: true }
      })
    },
    onBlur(str) {
      this.handleUpdate(str)
      this.editingId = ''
    },
    handleUpdate(str) {
      if (this.selectedClient.needUpdate !== true) this.needUpdate()
      if (str === "lastName") this.updateLastName(this.editedLastName)
      this.closeEditNameDialogue()
    },
    openEditNameDialogue() {
      this.showEditNameDialogue = true
    },
    closeEditNameDialogue() {
      this.showEditNameDialogue = false
    },
    toggleShowFlagDropdown() {
      this.showFlagDropdown = !this.showFlagDropdown
    },

    toggleShowGlobalFlagDropdown() {
      this.showGlobalFlagDropdown = !this.showGlobalFlagDropdown
    },
    confirmDelete() {
      if (this.isLoading) {
        return
      }
      this.showDelete = true
    },
    closeDeleteModal() {
      this.showDelete = false
    },
    handleFlag(flag) {
      const clientFlag = {
        clientId: this.selectedClient.id,
        userId: this.currentUser.id,
        flag,
      }
      this.updateSelectedClient({
        model: models.selectedClient,
        data: { ...this.selectedClient, flag }
      })
      this.$api.updateClientFlag(this.headers, { clientId: this.selectedClient.id, clientFlag })
      this.$store.commit('updateUserFlagClient', clientFlag);
      this.showFlagDropdown = false
    },

    async handleDelete() {
      if (this.isLoading) {
        return
      }
      this.isLoading = true
      await this.$api.deleteClient(this.headers, { clientId: this.selectedClient.id }).then(res => {
        if (res.success === "Success") this.$store.commit('deleteClient', this.selectedClient.id);
      })
      this.showDelete = false
      this.isLoading = false
      this.updateSelectedClient({
        model: models.selectedClient,
        data: {}
      })
    },
  },
}
</script>

<style scoped>
.header {

  @apply flex bg-gray-700 text-white rounded-t-sm px-3 items-center z-10 shadow;

  min-height: 4rem;

}
</style>