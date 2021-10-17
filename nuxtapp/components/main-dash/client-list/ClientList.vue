<template>
  <div class="flex-grow overflow-auto">
    <div
      v-for="client in displayedClients"
      :key="client.id"
      class="text-gray-500 bg-gray-50 p-2 text-sm client cursor-pointer"
      :class="client.id === selectedClientId ? 'selected' : ''"
      @click="selectClient(client)"
    >
      <span class="font-medium text-gray-900">{{ client.lastName }}</span> {{ client.displayName }}
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
        .filter(([key, client]) => !client.archived))
    },
    archived () {
      return Object.fromEntries(Object.entries(this.clients)
        .filter(([key, client]) => client.archived))
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
  @apply bg-white;
}

.client.selected {
  @apply bg-gray-700 text-gray-100;
}

.client.selected span {
  @apply text-white;
}
</style>
