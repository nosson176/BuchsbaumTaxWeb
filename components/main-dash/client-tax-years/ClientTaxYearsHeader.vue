<template>
  <div :class="$style.header" class="header bg-gray-700" :key="uniqueKey">
    <!-- Show LoadingIndicator while loading -->
    <LoadingIndicator v-if="showLoadingSpinner" class="h-8 w-8 text-white mx-auto my-auto" />

    <!-- Show the main header content when loading is complete -->
    <div v-else-if="isClientSelected" class="w-full flex items-center justify-between">
      <div class="flex items-center w-1/3">
        <div>
          <FlagIcon class="h-6 w-6 cursor-pointer" :color="flagColorGlobal" @click="toggleShowGlobalFlagDropdown" />
          <FlagDropdown v-if="showGlobalFlagDropdown" @input="updateGlobalFlag" @blur="toggleShowGlobalFlagDropdown" />
        </div>
        <div>
          <!-- <FlagIcon class="h-4 w-4 cursor-pointer" :color="flagColor" @click="toggleShowFlagDropdown" />
          <FlagDropdown v-if="showFlagDropdown" @input="handleFlag" @blur="toggleShowFlagDropdown" /> -->
          <StarIcon class="h-4 w-4 cursor-pointer" :color="flagColor" @click="toggleShowFlagDropdown" />
          <StarDropdown v-if="showFlagDropdown" @input="handleFlag" @blur="toggleShowFlagDropdown" />
        </div>
        <div class="flex font-bold text-2xl cursor-pointer px-1" @click.stop="openEditNameDialogue">
          {{ selectedClient.lastName }}
          <div class="ml-2 flex items-center" @click.stop="overwriteActiveMode"> <button
              class="rounded-full h-2 w-2 focus:outline-none"
              :class="{ 'bg-green-500 shadow-green-800/50 ': isClientActive, 'bg-red-500 shadow-red-500/50': !isClientActive }"></button>
          </div>
        </div>
        <div class="ml-12">
          <ClientTaxYearsHeaderPersonal :personal="primaryPersonal" />
          <ClientTaxYearsHeaderPersonal :personal="secondaryPersonal" />
        </div>
      </div>
      <div class="font-bold text-white flex justify-center text-2xl mr-10" @click="setEditable('status')">
        <EditableSelectCell :value="selectedClient.status" :options="statusOptions" :is-editable="isEditable('status')"
          @input="updateStatusDate" @blur="onBlur('status')" />
      </div>
      <div class="flex justify-end items-center w-1/3">
        <div class="flex gap-x-10 items-center">
          <div class="text-gray-100 flex text-sm justify-center" @click="setEditable('periodical')">
            <EditableSelectCell :value="selectedClient.periodical" :options="periodicalOptions"
              :is-editable="isEditable('periodical')" @input="updatePeriodical" @blur="onBlur" />
          </div>
          <div class="text-sm">{{ formattedCreatedDate }}</div>
          <div v-if="isArchived" class="place-self-end">
            <button type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              @click="confirmDelete">
              <LoadingIndicator v-if="isLoading" class="px-4 cursor-not-allowed h-5 w-5 text-white" />
              <span v-else class="capitalize">Delete</span>
            </button>
          </div>
          <div class="gap-x-3 ml-12 " style="display: flex; flex-grow: 1;">
            <div class="font-bold text-2xl" :class="dollarsClassObj">{{ summationDollars }}</div>
            <div class="font-bold text-2xl" :class="shekelsClassObj">{{ summationShekels }}</div>
          </div>
        </div>
        <div class="ml-2 mt-auto">
          <!-- <EditableSelectCell
            class="text-xl bg-gray-700 border-none font-bold p-0 outline-none focus:ring-0 appearance-none text-right cursor-pointer"
            :class="checkClass" :value="selectedClient.pmtStatus" @input="updatePmtStatus" :options="owesStatusOptions"
            :is-editable="isEditable('pmt')" @blur="hideSelectOptions" /> -->
          <select
            class="text-xl bg-gray-700 border-none font-bold p-0 outline-none focus:ring-0 appearance-none text-right cursor-pointer"
            :class="checkClass" :value="selectedClient.pmtStatus" @change="updatePmtStatus">
            <!-- Generate options dynamically -->
            <option v-for="(option, index) in owesStatusOptions" class="text-white" :key="index" :value="option.value">
              {{ option.value }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <!-- Modals -->
    <Modal :showing="showEditNameDialogue">
      <SubmitCard :loading="isLastNameUpdateLoading" @hide="closeEditNameDialogue" @submit="handleUpdate('lastName')">
        <FormInput ref="lastNameInput" v-model="editedLastName" label="Lastname" />
      </SubmitCard>
    </Modal>
    <Modal :showing="showDelete" @hide="closeDeleteModal">
      <DeleteType @hide="closeDeleteModal" @delete="handleDelete" />
    </Modal>
    <Modal :showing="showOverrideConfirmModal" @hide="closeOverrideConfirmModal">
      <div class="bg-white p-6  shadow-xl text-black " style="border-radius: 5rem;">
        <h2 class="text-xl font-bold mb-4">Confirm Override</h2>
        <p class="mb-6">Are you sure you want to override the client active status?</p>
        <div class="flex justify-end space-x-4">
          <button @click="closeOverrideConfirmModal"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
            Cancel
          </button>
          <button @click="confirmOverrideActiveMode" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Confirm
          </button>
        </div>
      </div>
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
      editable: '',
      showEditNameDialogue: false,
      isLastNameUpdateLoading: false,
      isLoading: false,
      showDelete: false,
      showFlagDropdown: false,
      showGlobalFlagDropdown: false,
      editedLastName: '',
      globalFlag: null,
      uniqueKey: 0,
      selectMode: null,
      isOverWriteActive: this.isInOverrideState,
      showOverrideConfirmModal: false,
    }
  },
  computed: {
    ...mapState([models.selectedClient, models.valueTypes, models.clients, models.currentUser, models.clientClicked, models.loading]),
    isClientSelected() {
      return this.selectedClient && Object.keys(this.selectedClient).length > 0
    },
    isSelectedClientLoading() {
      return this.loading.selectedClient
    },
    isClientActive() {
      return this.selectedClient?.active;
    },
    showLoadingSpinner() {
      return this.isSelectedClientLoading && this.clientClicked > 0
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
    owesStatusOptions() {
      return this.valueTypes.owes_status || []
    },
    periodicalOptions() {
      return this.valueTypes.periodical || []
    },
    isArchived() {
      return this.selectedClient.archived
    },
    pmtStatusClient() {
      return this.selectedClient.pmtStatus
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
              if (filing.currency === 'USD') { // Default to USD if no currency
                if (filing.includeInRefund) {
                  total += (filing.owes || 0);
                  total -= (filing.paid || 0);
                }
              }
            });
          }
        });
      }
      if (this.selectedClient && this.selectedClient.fees) {
        this.selectedClient.fees.forEach(fee => {
          if (fee.currency === 'USD') {
            if (fee.sum) {
              total += (fee.manualAmount || 0)
              total -= (fee.paidAmount || 0)
            }
          }
        })
      }
      return total;
    },

    totalOwedShekels() {
      let total = 0;
      if (this.selectedClient && this.selectedClient.taxYears) {
        this.selectedClient.taxYears.forEach(taxYear => {
          if (taxYear.filings) {
            taxYear.filings.forEach(filing => {
              if (filing.currency === 'NIS' || !filing.currency) {
                if (filing.includeInRefund) {
                  total += (filing.owes || 0);
                  total -= (filing.paid || 0);
                }
              }
            });
          }
        });
        if (this.selectedClient && this.selectedClient.fees) {
          this.selectedClient.fees.forEach(fee => {
            if (fee.currency === 'NIS' || !fee.currency) {
              if (fee.sum) {
                total += (fee.manualAmount || 0)
                total -= (fee.paidAmount || 0)
              }
            }
          })
        }
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
    checkClass() {
      const status = this.selectedClient?.pmtStatus;
      if (status === 'OWES1' || status === 'OWES2') return 'text-red-400 bg-none';
      if (status === 'PAID') return 'text-gray-400 bg-none';
      if (status === 'PMT') return 'text-green-400 bg-none';

      // Default return value
      return '';
    },
    isInOverrideState() {
      const values = this.valueTypes.active_status || []
      const standardActiveStatuses = values.map(status => status.value)

      return this.isClientActive !==
        !standardActiveStatuses.some(status =>
          this.selectedClient.status.startsWith(status)
        )
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
    },
    watch: {
      isClientActive(newVal) {
        this.overwriteMode = newVal;
      }
    }
  },


  methods: {
    overwriteActiveMode() {
      // Show confirmation modal instead of directly changing the status
      this.showOverrideConfirmModal = true
    },

    closeOverrideConfirmModal() {
      this.showOverrideConfirmModal = false
    },

    async confirmOverrideActiveMode() {
      // Close the modal
      this.showOverrideConfirmModal = false

      // Toggle the override active state
      this.isOverWriteActive = !this.isOverWriteActive

      // Update the status date
      await this.updateStatusDate(this.selectedClient.status, 'overwrite')

      // Trigger onBlur method
      this.onBlur()
    },
    hideSelectOptions() {
      this.editingId = ''
    },
    updatePmtStatus(newPmtStatus) {
      const d = newPmtStatus.target.value
      this.$api.updatePmtStatus(this.headers, {
        clientId: this.selectedClient.id,
        pmtStatus: newPmtStatus.target.value
      }).then(() => {
        this.$store.commit('updateClientPmtStatus', { clientId: this.selectedClient.id, pmtStatus: d })
      })
      this.editingId = ''
    },
    forceRerender() {
      this.uniqueKey += 1
    },
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
    checkActiveStatus(val, overwirite) {
      if (this.isOverWriteActive) {
        if (overwirite === 'overwrite') {
          return !this.isClientActive
        } else {
          return this.isClientActive
        }
      }
      const values = this.valueTypes.active_status
      // const values = ['INTERNAL', 'ITIN PENDING', 'MISSING', 'W/ SHUMA', 'WAITING', 'READY', 'FBAR', '-'];
      return values.some(status => val.startsWith(status.value));
    },
    async updateStatusDate(newVal, overwirite) {
      const active = await this.checkActiveStatus(newVal, overwirite)
      this.updateSelectedClient({
        model: models.selectedClient,
        data: { ...this.selectedClient, status: newVal, statusChangeDate: Date.now(), active }
      })
      this.$store.commit('updateClientStatusDate', this.selectedClient.id)
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

<style module>
.header {
  @apply flex bg-gray-700 text-white rounded-t-sm px-3 items-center z-10 shadow;

  min-height: 4rem;

}
</style>