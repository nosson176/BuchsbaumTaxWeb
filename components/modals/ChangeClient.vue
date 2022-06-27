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
          <h3 id="modal-title" class="text-lg leading-6 font-medium text-gray-900">Log Check</h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500">You have spent {{ formattedTimeSpent }} on {{ currentClient.lastName }}.
              Would you like to ignore this time and move on to
              {{ switchToClientName }} or pause and enter a new log?</p>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
      <button
        type="button"
        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 sm:ml-3 sm:w-auto sm:text-sm"
        @click="handleIgnore"
      >
        Ignore
      </button>
      <button
        type="button"
        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        @click="handleAddLog"
      >
        Add Log
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
import { events, models } from '~/shared/constants'
export default {
  name: 'ChangeClient',
  props:{
    switchToClientName: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState([models.selectedClient, models.secondsSpentOnClient]),
    currentClient() {
      return this.selectedClient
    },
    formattedTimeSpent(){
      const seconds = this.secondsSpentOnClient
      const hours = seconds >= 3600 ? Math.floor(seconds / 3600) : 0
      let minutes = 0
      if(hours > 0){
          minutes = Math.round((seconds % 3600) / 60)
      }
      else {
        minutes = Math.round(seconds / 60)
      }
      const mm = (minutes < 10 ? '0' + minutes : minutes) + 'm'
      return hours + 'h:' + mm
    },
  },
  methods: {
    handleIgnore() {
      this.$emit(events.switchClients)
      this.emitHide()
    },
    emitHide() {
      this.$emit(events.hide)
    },
    handleAddLog(){
      this.$emit(events.addLog)
      this.emitHide()
    }
  },
}
</script>
<style scoped></style>
