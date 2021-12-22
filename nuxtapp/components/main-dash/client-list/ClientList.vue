<template>
  <div class="flex-grow overflow-auto">
    <div
      v-for="client in displayedClients"
      :ref="client.id"
      :key="client.id"
      class="text-gray-500 bg-gray-50 pl-0.5 pr-px py-1 text-xs client cursor-pointer hover:bg-gray-400 hover:text-white"
      :class="client.id === selectedClientId ? 'selected' : ''"
      @click="selectClient(client)"
    >
      <span class="font-medium text-gray-900 ">{{ client.lastName }}</span> {{ client.displayName }}
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { models } from '~/shared/constants'

export default {
  name: 'ClientList',
  props: {
    showArchived: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return { selectedClientId: NaN }
  },
  computed: {
    ...mapState([models.clients, models.selectedClient, models.selectedSmartview]),
    displayedClients () {
      return this.filteredClients
    },
    filteredClients () {
      return Object.fromEntries(Object.entries(this.clients)
        .filter(([key, client]) => this.showArchived === client.archived)
        .filter(([key, client]) => this.hasSelectedSmartview ? this.selectedSmartview.clientIds.includes(client.id) : true)
      )
    },
    hasSelectedSmartview () {
      return !Array.isArray(this.selectedSmartview) || this.selectedSmartview.length
    }
  },
  watch: {
    selectedClient () {
      this.selectedClientId = this.selectedClient.id
      this.$refs[this.selectedClient.id][0].scrollIntoView({
        behavior: 'smooth'
      })
    }
  },
  methods: {
    selectClient ({ id }) {
      this.selectedClientId = id
      const headers = this.$api.getHeaders()
      this.$api.getClientData(headers, id)
    }
  }
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
