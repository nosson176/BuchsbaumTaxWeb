<template>
  <div class="flex-grow overflow-auto">
    <div class="bg-white sticky top-0 shadow flex items-center p-2 overflow-y-auto">
      <div class="flex items-center">
        <AddRowButton @click="onAddRowClick" />
        <ExportIcon class="ml-1" @export-click="exportToExcel" />
      </div>

      <div class="flex items-center space-x-2">
        <select name="sortBy" v-model="sortBy" class="form-select px-2 py-0 rounded">
          <option value="A-Z">A-Z</option>
          <option value="federal status">Federal Status</option>
          <option value="federal status detail">Federal Status Detail</option>
          <option value="fbar status detail">Fbar Status Detail</option>
          <option value="status overall">Status Overall</option>
          <option value="alarm">Alarm</option>
        </select>
        <select v-if="sortBy !== 'A-Z'" name="upDown" v-model="upDown" class="form-select px-2 py-0 rounded">
          <option value="new">New</option>
          <option value="old">Old</option>
        </select>
      </div>
    </div>

    <template v-if="spinner">
      <div class="spinner-overlay">
        <div class="spinner"></div>
      </div>
    </template>



    <!-- Client list when loading is false -->
    <template v-else>
      <div v-for="client in displayedClients" :ref="client.id" :key="`${client.id} ${isSelected(client)}`"
        class="flex text-gray-500 bg-gray-50 pl-0.5 pr-px py-1 text-xs client cursor-pointer group hover:bg-gray-400 hover:text-white"
        :class="{ selected: isSelected(client) }" @click="openChangeClientModal(client)">
        <div class="w-5">
          <FlagIcon class="w-4 h-4" :color="client.gFlag" />
        </div>
        <div class="w-full">
          <span class="font-medium text-gray-900 group-hover:text-white">{{ client.lastName }}</span>
          {{ client.displayName }}
        </div>
        <div class="w-5">
          <FlagIcon class="w-3 h-3" :color="client.flag || flagColor(client)" />
        </div>
        <div class="w-5" @click.stop>
          <DeleteButton v-if="!hideDeleteButton" @click="archiveClient(client)" />
        </div>
      </div>
    </template>
    <Modal :showing="showChangeClientModal" @hide="closeChangeClientModal">
      <ChangeClient :switch-to-client-name="switchToClient.lastName" @switchClients="selectClient(switchToClient)"
        @addLog="addLog" @hide="closeChangeClientModal" />
    </Modal>
    <Modal :showing="createClientModel" @hide="closeCreateClientModal">
      <CreateNewClientModel @hide="closeCreateClientModal" />
    </Modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import * as XLSX from "xlsx";
import { events, models, mutations, routes, tabs } from '~/shared/constants'
import { generateRandomId } from '~/shared/utility';

export default {
  name: 'ClientList',
  props: {
    showArchived: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      sortBy: 'A-Z',
      upDown: 'new',
      selectedClientId: NaN,
      showChangeClientModal: false,
      switchToClient: '',
      createClientModel: false
    }
  },
  computed: {
    ...mapState([models.clients, models.loading, models.selectedClient, models.selectedSmartview, models.currentUser, models.secondsNeededToDisplayModal1, models.spinner]),
    displayedClients() {
      // Explicitly use loading in the computed property to create a dependency
      if (this.spinner) {
        return [];
      }
      return this.sortedClients;
    },
    sortedClients() {
      const clients = Object.values(this.filteredClients)

      // console.log(this.sortBy, clients)
      switch (this.sortBy) {
        case 'A-Z':
          return this.sortByLastName(clients)
        case 'federal status':
          return this.sortByLatestDate(clients, 'filings', 'status', 'federal')
        case 'federal status detail':
          return this.sortByLatestDate(clients, 'filings', 'statusDetail', 'federal')
        case 'fbar status detail':
          return this.sortByLatestDate(clients, 'filings', 'statusDetail', 'fbar')
        case 'status overall':
          return this.sortByStatusOverall(clients)
        case 'alarm':
          return this.sortByAlarm(clients)
        default:
          return clients
      }
    },
    showUpDown() {
      return this.sortBy !== 'A-Z'
    },
    filteredClients() {
      return Object.fromEntries(
        Object.entries(this.clients)
          .filter(([key, client]) => this.showArchived === client.archived)
          .filter(([key, client]) =>
            this.hasSelectedSmartview ? this.selectedSmartview.clientIds?.includes(client.id) : true
          )
      )
    },
    hasSelectedSmartview() {
      return !Array.isArray(this.selectedSmartview) || this.selectedSmartview.length
    },
    headers() {
      return this.$api.getHeaders()
    },
    hideDeleteButton() {
      return this.$route.name === routes.maps
    },
  },
  watch: {
    loading(newValue) {
      // This will help trigger updates when loading changes
      // You can add any additional logic here if needed
      console.log('Loading state changed:', newValue);
    },
    selectedClient() {
      this.scrollClientIntoView()
    },
  },
  mounted() {
    this.selectedClientId = this.selectedClient.id
  },
  methods: {
    sortByLastName(clients) {
      return clients.sort((a, b) => {
        const lastNameA = a.lastName || ''
        const lastNameB = b.lastName || ''
        return lastNameA.localeCompare(lastNameB)
      })
    },

    sortByLatestDate(clients, arrayField, dateField, filingType) {
      return clients.sort((a, b) => {
        const dateA = this.getLatestDate(a, arrayField, dateField, filingType)
        const dateB = this.getLatestDate(b, arrayField, dateField, filingType)

        // If a client has no filings of the selected type, place them at the end
        if (dateA === 0 && dateB === 0) {
          return 0;
        }
        if (dateA === 0) {
          return 1;
        }
        if (dateB === 0) {
          return -1;
        }

        if (this.upDown === 'new') {
          return dateB - dateA
        } else {
          return dateA - dateB
        }
      })
    },
    sortByStatusOverall(clients) {
      return clients.sort((a, b) => {
        const dateA = a.statusChangeDate || 0
        const dateB = b.statusChangeDate || 0

        if (this.upDown === 'new') {
          return dateB - dateA
        } else {
          return dateA - dateB
        }
      })
    },

    sortByAlarm(clients) {
      return clients.sort((a, b) => {
        const dateA = this.getLatestAlarmDate(a)
        const dateB = this.getLatestAlarmDate(b)

        if (dateA === null && dateB === null) return 0
        if (dateA === null) return this.upDown === 'new' ? 1 : -1
        if (dateB === null) return this.upDown === 'new' ? -1 : 1

        if (this.upDown === 'new') {
          return dateB - dateA
        } else {
          return dateA - dateB
        }
      })
    },

    getLatestDate(client, arrayField, dateField, filingType) {
      const dates = (client[arrayField] || [])
      dates.filter(item => item.type === filingType)
        .map(item => {
          if (dateField === 'status' || dateField === 'statusDetail') {
            return new Date(item[dateField]?.date || 0).getTime()
          }
          return new Date(item[dateField] || 0).getTime()
        });
      return dates.length ? Math.max(...dates) : 0;
    },
    getLatestAlarmDate(client) {
      const alarmDates = (client.logs || [])
        .map(log => {
          if (log.alarmCreateChange) {
            const date = new Date(log.alarmCreateChange)
            return isNaN(date.getTime()) ? null : date.getTime()
          }
          return null
        })
        .filter(date => date !== null)

      return alarmDates.length ? Math.max(...alarmDates) : null
    },

    async exportToExcel() {
      const clients = this.displayedClients
      const clientsArray = Array.isArray(clients) ? clients : Object.values(clients);
      const res = await this.$api.getClientsToExport(this.headers, clientsArray)
      const dataArray = Array.isArray(res) ? res : Object.values(res);
      const worksheet = XLSX.utils.json_to_sheet(dataArray);

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

      const data = new Blob([excelBuffer], { type: "application/octet-stream" });
      const url = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "customers.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    async selectClient(client) {
      console.log(client)
      this.$store.commit(mutations.setModelResponse, {
        model: models.clientClicked,
        data: Math.random(),
      })
      console.log("client")
      this.selectedClientId = client.id
      const headers = this.headers
      await this.$api.getClientData(headers, client)
    },
    onAddRowClick() {
      this.createClientModel = true
    },
    closeCreateClientModal() {
      this.createClientModel = false
    },
    scrollClientIntoView() {
      if (this.selectedClient) {
        this.selectedClientId = this.selectedClient.id
        const selectedClientRef = this.$refs[this.selectedClient.id]
        if (selectedClientRef) {
          selectedClientRef[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
      }
    },
    archiveClient(client) {
      if (this.showArchived) {
        console.log("archived")
        const clientCopy = Object.assign({}, client)
        clientCopy.archived = false
        this.$api
          .updateClient(this.headers, { clientId: client.id, client: clientCopy })
          .then(() => this.$api.getClientList(this.headers))
      } else {
        console.log("active")
        this.$store.commit(mutations.setModelResponse, {
          model: models.modals,
          data: { delete: { showing: true, data: { id: client.id, type: tabs.clients, label: client.lastName } } },
        })
      }
    },
    openChangeClientModal(client) {
      if (
        this.selectedClient?.id &&
        this.$store.getters[models.secondsSpentOnClient] > this.$store.state.secondsNeededToDisplayModal1 &&
        this.$store.getters[models.promptOnClientChange]
      ) {
        this.switchToClient = client
        this.showChangeClientModal = true
      } else {
        this.selectClient(client)
      }
    },
    flagColor(client) {
      for (const flag of client.flags) {
        if (flag.userId === this.currentUser.id) {
          return flag.flag
        }
      }
      return 4
    },

    closeChangeClientModal() {
      this.showChangeClientModal = false
    },
    addLog() {
      const defaultValues = {
        clientId: this.selectedClient.id,
        logDate: new Date(),
        id: generateRandomId(),
        archived: false,
        years: '',
        alarmComplete: false,
        alert: false,
        alerted: false,
        priority: 0,
        timeSpent: "",
        note: "",
        historyLogJson: [],
        new: true,
        createdBy: this.currentUser.username,
        alarmCreateChange: null,
        alarmUserId: null,
        alarmTime: null,
        alarmDate: null,
        secondsSpent: this.$store.getters[models.secondsSpentOnClient]
      }
      const log = Object.assign({}, defaultValues)
      this.$api.createLog(this.headers, { log }).then(() => {
        this.$store.commit('pushNewLog', {
          state: this.selectedClient,
          log
        });

      })
      this.$store.commit(mutations.setModelResponse, { model: models.promptOnClientChange, data: false })
      this.$emit(events.resetClock)
    },
    isSelected({ id }) {
      return id === this.selectedClientId
    },
  },
}
</script>

<style scoped>
.client:nth-child(even) {
  @apply bg-white;
}

.client:nth-child(even):hover {
  @apply bg-gray-400;
}

.client.selected {
  @apply bg-gray-700 text-gray-100;
}

.client.selected span {
  @apply text-white;
}

.bg-white.sticky.top-0 {
  z-index: 19;

  /* Ensure it stays above other elements but doesn't cover too much */
}

.flex.items-center.justify-between {
  padding: 8px;

  /* Add padding to avoid elements being too close */
}

.form-select {
  border: 1px solid #ccc;
  background-color: white;
  padding-right: 20px;
  border-radius: 4px;
  font-size: 12px;
  width: auto;
  min-width: 10px;
  appearance: none;
}

select {
  appearance: none;
  padding-right: 20px;
  background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 0H140V140H0z"/><path d="M35 50l35 35 35-35H35z" fill="currentColor"/></svg>') no-repeat right 10px center;
  background-size: 10px;
}

.flex.items-center.space-x-2 select {
  margin-left: 8px;

  /* Adds some space between the dropdowns */
}

.spinner-overlay {
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  /* background-color: rgba(0, 0, 0, 0.2); */
  z-index: 100;
  height: 100%;
}

/* Spinner design */
.spinner {
  border: 6px solid #f3f3f3;
  border-top: 6px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1.5s linear infinite;
}

/* Spinner rotation animation */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
