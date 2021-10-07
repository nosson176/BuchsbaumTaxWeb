<template>
  <div class="flex-grow overflow-auto">
    <div
      v-for="client in displayedClients"
      :key="client.id"
      class="text-gray-900 text-sm p-1 client cursor-pointer"
      :class="client.id === selectedClientId ? 'selected' : ''"
      @click="selectClient(client)"
    >
      <span class="font-bold">{{ client.lastName }}</span> {{ client.displayName }}
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
    ...mapState([models.clients]),
    displayedClients () {
      if (!this.showArchived) {
        return this.notArchived
      } else {
        return this.archived
      }
    },
    notArchived () {
      return Object.fromEntries(Object.entries(this.clients)
        .filter(([key, client]) => client.archived === false))
    },
    archived () {
      return this.clients
    }
  },
  methods: {
    selectClient ({ id }) {
      this.selectedClientId = id
      const headers = this.$api.getHttpConfig()
      this.$api.getClientData(id, headers)
    }
  }
}
</script>

<style scoped>
.client:nth-child(even) {
  @apply bg-gray-300;
}

.client.selected {
  @apply bg-gray-700 text-white;
}
</style>
