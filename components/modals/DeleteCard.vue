<template>
  <div>
    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
      <div class="sm:flex sm:items-start">
        <div
          class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
        >
          <AlertIcon class="text-red-600" />
        </div>
        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <h3 id="modal-title" class="text-lg leading-6 font-medium text-gray-900">
            <span class="capitalize">{{ updateToValue }}</span> Item
          </h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500">
              Are you sure you want to
              <span class="capitalize">{{ updateToValue }}</span> {{ contentLabel }}?
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
      <button
        type="button"
        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
        @click="handleDelete"
      >
        <LoadingIndicator v-if="isLoading" class="px-4 cursor-not-allowed h-5 w-5 text-white" />
        <span v-else class="capitalize">{{ updateToValue }}</span>
      </button>
      <button
        type="button"
        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        @click="emitHide"
      >
        Cancel
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { events, models, mutations, tabs } from '~/shared/constants'

export default {
  name: 'DeleteCard',
  data() {
    return {
      isLoading: false,
      contentLabel: 'item'
    }
  },
  computed: {
    ...mapState([models.selectedClient, models.modals, models.clients, models.smartviews]),
    clientId() {
      return this.selectedClient.id
    },
    modalData() {
      return this.modals.delete.data
    },
    id() {
      return this.modalData.id
    },
    type() {
      return this.modalData.type
    },
    label(){
      return this.modalData.label || 'item'
    },
    headers() {
      return this.$api.getHeaders()
    },
    updateToValue() {
      return this.updatedItem.archived ? 'archive' : 'unarchive'
    },
    isTypeLog() {
      return this.type === tabs.logs
    },
    isTypeIncome() {
      return this.type === tabs.income
    },
    isTypeFbar() {
      return this.type === tabs.fbar
    },
    isTypeContact() {
      return this.type === tabs.contact
    },
    isTypeTaxPersonals() {
      return this.type === tabs.tax_personals
    },
    isTypeTaxYear() {
      return this.type === tabs.tax_years
    },
    isTypeFee() {
      return this.type === tabs.fees
    },
    isTypeClient() {
      return this.type === tabs.clients
    },
    isTypeSmartview() {
      return this.type === tabs.smartviews
    },
    logs() {
      return JSON.parse(JSON.stringify(this.selectedClient.logs))
    },
    incomes() {
      return JSON.parse(JSON.stringify(this.selectedClient.incomeBreakdowns))
    },
    fbars() {
      return JSON.parse(JSON.stringify(this.selectedClient.fbarBreakdowns))
    },
    contacts() {
      return JSON.parse(JSON.stringify(this.selectedClient.contacts))
    },
    taxPersonals() {
      return JSON.parse(JSON.stringify(this.selectedClient.taxPersonals))
    },
    taxYears() {
      return JSON.parse(JSON.stringify(this.selectedClient.taxYearData))
    },
    fees() {
      return JSON.parse(JSON.stringify(this.selectedClient.fees))
    },
    clientsCopy() {
      return JSON.parse(JSON.stringify(this.clients))
    },
    smartviewCopy() {
      return JSON.parse(JSON.stringify(this.smartviews))
    },
    updatedLog() {
      const log = this.logs.find((log) => log.id === this.id)
      log.archived = !log.archived
      return log
    },
    updatedIncome() {
      const income = this.incomes.find((income) => income.id === this.id)
      income.archived = !income.archived
      return income
    },
    updatedFbar() {
      const fbar = this.fbars.find((fbar) => fbar.id === this.id)
      fbar.archived = !fbar.archived
      return fbar
    },
    updatedContact() {
      const contact = this.contacts.find((contact) => contact.id === this.id)
      contact.archived = !contact.archived
      return contact
    },
    updatedTaxPersonal() {
      const taxPersonal = this.taxPersonals.find((taxPersonal) => taxPersonal.id === this.id)
      taxPersonal.archived = !taxPersonal.archived
      return taxPersonal
    },
    updatedTaxYear() {
      const taxYear = this.taxYears.find((taxYear) => taxYear.id === this.id)
      taxYear.archived = !taxYear.archived
      return taxYear
    },
    updatedFee() {
      const fee = this.fees.find((fee) => fee.id === this.id)
      fee.archived = !fee.archived
      return fee
    },
    updatedClient() {
      const client = Object.values(this.clientsCopy).find((client) => client.id === this.id)
      client.archived = !client.archived
      return client
    },
    updatedSmartview() {
      const smartview = Object.values(this.smartviewCopy).find((smartview) => smartview.id === this.id)
      smartview.archived = !smartview.archived
      return smartview
    },
    updatedItem() {
      let item = null
      if (this.isTypeLog) {
        item = this.updatedLog
      } else if (this.isTypeIncome) {
        item = this.updatedIncome
      } else if (this.isTypeFbar) {
        item = this.updatedFbar
      } else if (this.isTypeContact) {
        item = this.updatedContact
      } else if (this.isTypeTaxPersonals) {
        item = this.updatedTaxPersonal
      } else if (this.isTypeTaxYear) {
        item = this.updatedTaxYear
      } else if (this.isTypeFee) {
        item = this.updatedFee
      } else if (this.isTypeClient) {
        item = this.updatedClient
      } else if (this.isTypeSmartview) {
        item = this.updatedSmartview
      }
      return item
    },
  },
  created(){
    this.contentLabel = this.label || 'item'
  },
  methods: {
    handleDelete() {
      this.isLoading = true
      if (this.isTypeLog) {
        this.updateLog()
      } else if (this.isTypeIncome) {
        this.updateIncome()
      } else if (this.isTypeFbar) {
        this.updateFbar()
      } else if (this.isTypeContact) {
        this.updateContact()
      } else if (this.isTypeTaxPersonals) {
        this.updateTaxPersonal()
      } else if (this.isTypeTaxYear) {
        this.updateTaxYear()
      } else if (this.isTypeFee) {
        this.updateFee()
      } else if (this.isTypeClient) {
        this.updateClient()
      } else if (this.isTypeSmartview) {
        this.updateSmartview()
      }
    },
    emitHide() {
      this.$emit(events.hide)
    },
    updateLog() {
      this.$api
        .updateLog(this.headers, { clientId: this.clientId, logId: this.id }, this.updatedItem)
        .finally(() => this.updateClientSideData())
    },
    updateIncome() {
      this.$api
        .updateIncome(this.headers, { clientId: this.clientId, incomeId: this.id }, this.updatedItem)
        .finally(() => this.updateClientSideData())
    },
    updateFbar() {
      this.$api
        .updateFbar(this.headers, { clientId: this.clientId, fbarId: this.id }, this.updatedItem)
        .finally(() => this.updateClientSideData())
    },
    updateContact() {
      this.$api
        .updateContact(this.headers, { clientId: this.clientId, contactId: this.id }, this.updatedItem)
        .finally(() => this.updateClientSideData())
    },
    updateTaxPersonal() {
      this.$api
        .updateTaxPersonal(this.headers, { clientId: this.clientId, personalId: this.id }, this.updatedItem)
        .finally(() => this.updateClientSideData())
    },
    updateTaxYear() {
      this.$api
        .updateTaxYear(this.headers, { clientId: this.clientId, taxYearId: this.id }, this.updatedItem)
        .finally(() => this.updateClientSideData())
    },
    updateFee() {
      this.$api
        .updateFee(this.headers, { clientId: this.clientId, feeId: this.id }, this.updatedItem)
        .then(() => this.updateClientSideData())
    },
    updateClient() {
      this.$api
        .updateClient(this.headers, { clientId: this.updatedItem.id, client: this.updatedItem })
        .then(() => this.$api.getClientList(this.headers))
        .then(() => this.updateClientSideData())
    },
    updateSmartview() {
      this.$api
        .updateSmartview(this.headers, { smartviewId: this.updatedItem.id }, this.updatedItem)
        .then(() => {
          this.$api.getSmartviews(this.headers)
          this.$store.commit(mutations.setModelResponse, { model: models.selectedSmartview, data: [] })
        })
        .then(() => this.updateClientSideData())
    },
    updateClientSideData() {
      this.isLoading = false
      this.emitHide()
    }
  },
}
</script>

<style scoped></style>
