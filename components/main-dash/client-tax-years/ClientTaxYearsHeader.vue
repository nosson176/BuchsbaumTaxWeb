<!-- <template>
  <div class="header">
    <div v-if="isClientSelected" class="w-full flex">
      <div>
        <FlagIcon class="h-6 w-6 cursor-pointer" :color="flagColor" @click="toggleShowFlagDropdown" />
        <FlagDropdown v-if="showFlagDropdown" @input="handleFlag" @blur="toggleShowFlagDropdown" />
      </div>
      <div class="font-bold text-2xl cursor-pointer ml-4" @click="openEditNameDialogue">
        {{ lastName }}
      </div>
      <div class="ml-12">
        <ClientTaxYearsHeaderPersonal :personal="primaryPersonal" />
        <ClientTaxYearsHeaderPersonal :personal="secondaryPersonal" />
      </div>
      <div class="font-bold text-white flex justify-center text-2xl ml-20" @click="setEditable('status')">
        <EditableSelectCell v-model="statusValue" :options="statusOptions" :is-editable="isEditable('status')"
          @blur="onBlur" />
      </div>
      <div class="text-gray-100 flex text-sm justify-center ml-20" @click="setEditable('periodical')">
        <EditableSelectCell v-model="periodical" :options="periodicalOptions" :is-editable="isEditable('periodical')"
          @blur="onBlur" />
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
      <SubmitCard :loading="isLastNameUpdateLoading" @hide="closeEditNameDialogue" @submit="handleUpdate">
        <FormInput ref="lastNameInput" v-model="lastName" label="Lastname" />
      </SubmitCard>
    </Modal>
    <Modal :showing="showDelete" @hide="closeDeleteModal">
      <DeleteType @hide="closeDeleteModal" @delete="handleDelete" />
    </Modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { categories, models, mutations } from '~/shared/constants'
import { formatDateForClient } from '~/shared/domain-utilities'
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
    }
  },
  computed: {
    ...mapState([models.selectedClient, models.valueTypes, models.clients, models.currentUser]),
    selectedClientCopy() {
      console.log("selectedClientCopy=> ", JSON.parse(JSON.stringify(this.selectedClient)))
      return JSON.parse(JSON.stringify(this.selectedClient))
    },
    isClientSelected() {
      return this.selectedClient.length || Object.entries(this.selectedClient).length
    },
    flagColor() {
      return this.selectedClientCopy?.flag || 4
    },
    primaryPersonal() {
      return this.selectedClientCopy?.taxPersonals?.filter((personal) => personal.category === categories.primary)[0]
    },
    secondaryPersonal() {
      return this.selectedClientCopy?.taxPersonals?.filter((personal) => personal.category === categories.secondary)[0]
    },
    formattedCreatedDate() {
      if (this.logs?.length) {
        const firstLog = this.logs[this.logs.length - 1]
        console.log(firstLog.logDate)
        return formatUnixTimestamp(firstLog.logDate)
        // return formatDateForClient(firstLog.logDate)
      }
      if (this.selectedClientCopy.created) {
        console.log(this.selectedClientCopy.created)
        return formatDateForClient(this.selectedClientCopy.created)
      } else {
        return ''
      }
    },
    logs() {
      return this.selectedClientCopy?.logs
    },
    lastName: {
      get() {
        return this.selectedClientCopy.lastName
      },
      set(newVal) {
        this.selectedClientCopy.lastName = newVal
      },
    },
    statusValue: {
      get() {
        return this.selectedClientCopy.status
      },
      set(newVal) {
        this.selectedClientCopy.status = newVal
      },
    },
    periodical: {
      get() {
        return this.selectedClientCopy.periodical
      },
      set(newVal) {
        this.selectedClientCopy.periodical = newVal
      },
    },
    statusOptions() {
      return this.valueTypes.status || []
    },
    periodicalOptions() {
      return this.valueTypes.periodical || []
    },
    clientsCopy() {
      return JSON.parse(
        JSON.stringify(
          Object.assign(
            Object.values(this.clients).map((client) =>
              client.id === this.selectedClientCopy.id ? this.selectedClientCopy : client
            )
          )
        )
      )
    },
    isArchived() {
      return this.selectedClientCopy.archived
    },
    headers() {
      return this.$api.getHeaders()
    },
    totalOwedDollars() {
      const owes = this.selectedClient.owesDollars + this.selectedClient.feesOwesDollars
      const paid = this.selectedClient.paidDollars + this.selectedClient.feesPaidDollars
      return owes - paid
    },
    totalOwedShekels() {
      const owes = this.selectedClient.owesShekels + this.selectedClient.feesOwesShekels
      const paid = this.selectedClient.paidShekels + this.selectedClient.feesPaidShekels
      return owes - paid
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
          this.$nextTick(() => {
            this.$refs.lastNameInput.$refs.input.focus()
          })
        }
      },
    },
  },
  methods: {
    setEditable(editingId) {
      this.editingId = editingId
    },
    isEditable(editingId) {
      return this.editingId === editingId
    },
    onBlur() {
      this.handleUpdate()
      this.editingId = ''
    },
    handleUpdate() {
      // async handleUpdate() {
      const client = this.selectedClientCopy
      client.created = new Date(client.created)
      this.selectedClientCopy.status = "dddd"
      console.log(this.selectedClientCopy)
      // await this.$api.updateClient(this.headers, { clientId: client.id, client })
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
    confirmDelete() {
      if (this.isLoading) {
        return
      }
      this.showDelete = true
    },
    closeDeleteModal() {
      this.showDelete = false
    },
    async handleFlag(flag) {
      const client = this.selectedClientCopy
      const clientFlag = {
        clientId: client.id,
        userId: this.currentUser.id,
        flag,
      }
      await this.$api.updateClientFlag(this.headers, { clientId: client.id, clientFlag })
      this.showFlagDropdown = false
      this.$api.getClientList(this.headers)
    },
    async handleDelete() {
      if (this.isLoading) {
        return
      }
      this.isLoading = true
      await this.$api.deleteClient(this.headers, { clientId: this.selectedClientCopy.id })
      this.showDelete = false
      this.isLoading = false
      this.$store.commit(mutations.setModelResponse, {
        model: models.selectedClient,
        data: [],
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
</style> -->

<template>
  <div class="header">
    <div v-if="isClientSelected" class="w-full flex">
      <div>
        <FlagIcon class="h-6 w-6 cursor-pointer" :color="flagColor" @click="toggleShowFlagDropdown" />
        <FlagDropdown v-if="showFlagDropdown" @input="handleFlag" @blur="toggleShowFlagDropdown" />
      </div>
      <div class="font-bold text-2xl cursor-pointer ml-4" @click="openEditNameDialogue">
        {{ selectedClient.lastName }}
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
import { formatDateForClient } from '~/shared/domain-utilities'
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
      editedLastName: '',
      clientUpdate: {}
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
        return formatDateForClient(this.selectedClient.created)
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
    totalOwedDollars() {
      const owes = this.selectedClient.owesDollars + this.selectedClient.feesOwesDollars
      const paid = this.selectedClient.paidDollars + this.selectedClient.feesPaidDollars
      return owes - paid
    },
    totalOwedShekels() {
      const owes = this.selectedClient.owesShekels + this.selectedClient.feesOwesShekels
      const paid = this.selectedClient.paidShekels + this.selectedClient.feesPaidShekels
      return owes - paid
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
          console.log("showEditNameDialogue=> ", newVal,)
          this.editedLastName = this.selectedClient.lastName
          this.$nextTick(() => {
            this.$refs.lastNameInput.$refs.input.focus()
          })
        }
      },
    },
    selectedClient: {
      handler(newClient, oldClient) {
        console.log(newClient.id, oldClient.id)
        if (newClient.id !== oldClient.id && oldClient.id !== undefined) {
          this.updateClient1(oldClient)
        }
      },
      deep: true,  // Watch for nested object changes as well
    },
  },


  methods: {
    ...mapMutations({
      updateSelectedClient: mutations.setModelResponse
    }),
    updateClient1(oldClient) {
      console.log("beforeDestroy => ", this.selectedClient)
      console.log("beforeDestroy oldClient => ", oldClient)
      if (oldClient.needUpdate === true) {
        console.log("beforeDestroyinside!!! ")
        const updatedClient = {
          id: oldClient.id,
          status: oldClient.status,
          owesStatus: oldClient.owesStatus,
          periodical: oldClient.periodical,
          lastName: oldClient.lastName,
          archived: oldClient.archived,
          displayName: oldClient.displayName,
          displayPhone: oldClient.displayPhone,
          statusChangeDate: oldClient.statusChangeDate
        };
        console.log("updatedClient=> ", updatedClient)
        this.$api.updateClient(this.headers, { clientId: updatedClient.id, client: updatedClient })
      }
    },
    setEditable(editingId) {
      this.editingId = editingId
    },
    isEditable(editingId) {
      return this.editingId === editingId
    },
    updateStatusDate(newVal) {
      this.updateSelectedClient({
        model: models.selectedClient,
        data: { ...this.selectedClient, status: newVal, statusChangeDate: Date.now() }
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
    },

    needUpdate() {
      console.log("needUpdate")
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
      // await this.$api.updateClient(this.headers, { clientId: client.id, client })
      // await this.$api.getClientList(this.headers)
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
    confirmDelete() {
      if (this.isLoading) {
        return
      }
      this.showDelete = true
    },
    closeDeleteModal() {
      this.showDelete = false
    },
    async handleFlag(flag) {
      const clientFlag = {
        clientId: this.selectedClient.id,
        userId: this.currentUser.id,
        flag,
      }
      await this.$api.updateClientFlag(this.headers, { clientId: this.selectedClient.id, clientFlag })
      this.showFlagDropdown = false
      await this.$api.getClientList(this.headers)
    },
    async handleDelete() {
      if (this.isLoading) {
        return
      }
      this.isLoading = true
      await this.$api.deleteClient(this.headers, { clientId: this.selectedClient.id })
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