<template>
  <div>
    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
      <div class="sm:flex sm:items-start">
        <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <AlertIcon class="text-red-600" />
        </div>
        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <h3 id="modal-title" class="text-lg leading-6 font-medium text-gray-900">
            Delete Item
          </h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500">
              Are you sure you want to delete this item?
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
      <button type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm" @click="handleDelete">
        Delete
      </button>
      <button type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" @click="emitHide">
        Cancel
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { events, models, tabs } from '~/shared/constants'

export default {
  name: 'DeleteCard',
  props: {
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState([models.selectedClient]),
    clientId () {
      return this.selectedClient.id
    },
    isTypeLog () {
      return this.type === tabs.logs
    },
    isTypeIncome () {
      return this.type === tabs.income
    },
    isTypeFbar () {
      return this.type === tabs.fbar
    },
    logs () {
      return JSON.parse(JSON.stringify(this.selectedClient.logs))
    },
    incomes () {
      return JSON.parse(JSON.stringify(this.selectedClient.incomeBreakdowns))
    },
    fbars () {
      return JSON.parse(JSON.stringify(this.selectedClient.fbarBreakdowns))
    },
    updatedLog () {
      const log = this.logs.find(log => log.id === this.id)
      log.archived = true
      return log
    },
    updatedIncome () {
      const income = this.incomes.find(income => income.id === this.id)
      income.archived = true
      return income
    },
    updatedFbar () {
      const fbar = this.fbars.find(fbar => fbar.id === this.id)
      fbar.archived = true
      return fbar
    }
  },
  methods: {
    handleDelete () {
      const headers = this.$api.getHttpConfig()
      if (this.isTypeLog) {
        this.updateLog(headers)
      } else if (this.isTypeIncome) {
        this.updateIncome(headers)
      } else if (this.isTypeFbar) {
        this.updateFbar(headers)
      }
    },
    emitHide () {
      this.$emit(events.hide)
    },
    updateLog (headers) {
      const log = this.updatedLog
      const clientId = this.clientId
      const logId = this.id
      this.$api.updateLog(headers, { clientId, logId }, log)
      this.reloadClient(headers, this.clientId)
    },
    updateIncome (headers) {
      const income = this.updatedIncome
      const clientId = this.clientId
      const incomeId = this.id
      this.$api.updateIncome(headers, { clientId, incomeId }, income)
      this.reloadClient(headers, this.clientId)
    },
    updateFbar (headers) {
      const fbar = this.updatedFbar
      const clientId = this.clientId
      const fbarId = this.id
      this.$api.updateFbar(headers, { clientId, fbarId }, fbar)
      this.reloadClient(headers, this.clientId)
    },
    reloadClient (headers, clientId) {
      this.$api.getClientData(headers, clientId)
      this.emitHide()
    }
  }
}
</script>

<style scoped>

</style>
