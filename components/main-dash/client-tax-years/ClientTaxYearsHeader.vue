<template>
  <div class="header">
    <div v-if="selectedClientCopy" class="w-full grid grid-cols-8 gap-x-4 grid-rows-1 items-center">
      <div>
        <FlagIcon class="h-6 w-6 cursor-pointer" :color="flagColor" @click="toggleShowFlagDropdown" />
        <FlagDropdown v-if="showFlagDropdown" @input="handleFlag" />
      </div>
      <div class="font-bold text-2xl cursor-pointer" @click="openEditNameDialogue">
        {{ lastName }}
      </div>
      <div>
        <ClientTaxYearsHeaderPersonal :personal="primaryPersonal" />
        <ClientTaxYearsHeaderPersonal :personal="secondaryPersonal" />
      </div>
      <div class="font-bold text-white flex justify-center text-2xl" @click="setEditable('status')">
        <EditableSelectCell
          v-model="statusValue"
          :options="statusOptions"
          :is-editable="isEditable('status')"
          @blur="onBlur"
        />
      </div>
      <div class="text-gray-100 flex text-sm justify-center" @click="setEditable('periodical')">
        <EditableSelectCell
          v-model="periodical"
          :options="periodicalOptions"
          :is-editable="isEditable('periodical')"
          @blur="onBlur"
        />
      </div>
      <div class="text-sm">{{ formattedCreatedDate }}</div>
      <div v-if="isArchived" class="place-self-end">
        <button
          type="button"
          class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
          @click="confirmDelete"
        >
          <LoadingIndicator v-if="isLoading" class="px-4 cursor-not-allowed h-5 w-5 text-white" />
          <span v-else class="capitalize">Delete</span>
        </button>
      </div>
      <div>{{ summationDollars }}</div>
      <div>{{ summationShekels }}</div>
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
import { formatAsILCurrency, formatAsUSCurrency } from '~/shared/utility'

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
      return JSON.parse(JSON.stringify(this.selectedClient))
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
        return formatDateForClient(firstLog.logDate)
      }
      if (this.selectedClientCopy.created) {
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
    summationDollars() {
      const owes = this.selectedClient.owesDollars + this.selectedClient.feesOwesDollars
      const paid = this.selectedClient.paidDollars + this.selectedClient.feesPaidDollars
      const totalOwed = owes - paid
      return !isNaN(totalOwed) ? formatAsUSCurrency(totalOwed) : ''
    },
    summationShekels() {
      const owes = this.selectedClient.owesShekels + this.selectedClient.feesOwesShekels
      const paid = this.selectedClient.paidShekels + this.selectedClient.feesPaidShekels
      const totalOwed = owes - paid
      return !isNaN(totalOwed) ? formatAsILCurrency(owes - paid) : ''
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
    async handleUpdate() {
      const client = this.selectedClientCopy
      await this.$api.updateClient(this.headers, { clientId: client.id, client })
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
</style>
