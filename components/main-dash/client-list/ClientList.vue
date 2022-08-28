<template>
  <div class="flex-grow overflow-auto">
    <div class="bg-white sticky top-0 shadow">
      <AddRowButton @click="onAddRowClick" />
    </div>
    <div
      v-for="client in displayedClients"
      :ref="client.id"
      :key="`${client.id}  ${isSelected(client)}`"
      class="flex text-gray-500 bg-gray-50 pl-0.5 pr-px py-1 text-xs client cursor-pointer group hover:bg-gray-400 hover:text-white"
      :class="{ selected: isSelected(client) }"
      @click="openChangeClientModal(client)"
    >
      <div class="w-full">
        <span class="font-medium text-gray-900 group-hover:text-white">{{ client.lastName }}</span>
        {{ client.displayName }}
      </div>
      <div class="w-5" @click.stop>
        <DeleteButton @click="archiveClient(client)" />
      </div>
    </div>
    <Modal :showing="showChangeClientModal" @hide="closeChangeClientModal">
      <ChangeClient
        :switch-to-client-name="switchToClient.lastName"
        @switchClients="selectClient(switchToClient)"
        @addLog="addLog"
        @hide="closeChangeClientModal"
      />
    </Modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { events, models, mutations, tabs } from '~/shared/constants'

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
      selectedClientId: NaN,
      showChangeClientModal: false,
      switchToClient: '',
    }
  },
  computed: {
    ...mapState([models.clients, models.selectedClient, models.selectedSmartview]),
    displayedClients() {
      return this.filteredClients
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
  },
  watch: {
    selectedClient() {
      this.scrollClientIntoView()
    },
  },
  mounted() {
    this.selectedClientId = this.selectedClient.id
  },
  methods: {
    selectClient({ id }) {
      this.selectedClientId = id
      const headers = this.headers
      this.$api.getClientData(headers, id)

      this.$store.commit(mutations.setModelResponse, {
        model: models.clientClicked,
        data: Math.random(),
      })
    },
    onAddRowClick() {
      const defaultValues = {
        lastName: 'New Client',
      }
      const client = Object.assign({}, defaultValues)
      this.$api.createClient(this.headers, { client }).then((data) => {
        this.$api.getClientData(this.headers, data.id).then(async () => {
          await this.$api.getClientList(this.headers)
          this.scrollClientIntoView()
        })
      })
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
        const clientCopy = Object.assign({}, client)
        clientCopy.archived = false
        this.$api
          .updateClient(this.headers, { clientId: client.id, client: clientCopy })
          .then(() => this.$api.getClientList(this.headers))
      } else {
        this.$store.commit(mutations.setModelResponse, {
          model: models.modals,
          data: { delete: { showing: true, data: { id: client.id, type: tabs.clients, label: client.lastName } } },
        })
      }
    },
    openChangeClientModal(client) {
      if (
        this.selectedClient?.id &&
        this.$store.getters[models.secondsSpentOnClient] > 0 &&
        this.$store.getters[models.promptOnClientChange]
      ) {
        this.switchToClient = client
        this.showChangeClientModal = true
      } else {
        this.selectClient(client)
      }
    },
    closeChangeClientModal() {
      this.showChangeClientModal = false
    },
    addLog() {
      const defaultValues = {
        clientId: this.selectedClient.id,
        logDate: new Date(),
        secondsSpent: this.$store.getters[models.secondsSpentOnClient],
      }
      const log = Object.assign({}, defaultValues)
      this.$api.createLog(this.headers, { log }).then(async (data) => {
        await this.$api.getClientData(this.headers, this.selectedClient.id)
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
</style>
