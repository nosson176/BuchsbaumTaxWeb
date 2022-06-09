<template>
  <div class="flex-grow overflow-auto">
    <div class="bg-white sticky top-0 shadow">
      <AddRowButton @click="onAddRowClick" />
    </div>
    <div
      v-for="(client, idx) in displayedClients"
      :ref="client.id"
      :key="idx"
      class="flex text-gray-500 bg-gray-50 pl-0.5 pr-px py-1 text-xs client cursor-pointer group hover:bg-gray-400 hover:text-white"
      :class="client.id === selectedClientId ? 'selected' : ''"
      @click="selectClient(client)"
    >
      <div class="w-full">
        <span class="font-medium text-gray-900 group-hover:text-white">{{ client.lastName }}</span>
        {{ client.displayName }}
      </div>
      <div class="w-5" @click.stop>
        <DeleteButton @click="archiveClient(client)" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { models, mutations, tabs } from '~/shared/constants'

export default {
  name: 'ClientList',
  props: {
    showArchived: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return { selectedClientId: NaN }
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
  methods: {
    selectClient({ id }) {
      if (this.selectedClientId !== id) {
        this.selectedClientId = id
        const headers = this.headers
        this.$api.getClientData(headers, id)
      }
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
          data: { delete: { showing: true, data: { id: client.id, type: tabs.clients } } },
        })
      }
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
