<template>
  <div>
    <div v-for="client in displayedClients" :key="client.id" class="text-gray-900 text-sm p-1 client cursor-pointer">
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
  computed: {
    ...mapState([models.clients]),
    displayedClients () {
      if (!this.showArchived) {
        return Object.fromEntries(Object.entries(this.clients)
          .filter(([key, client]) => client.archived === false))
      } else {
        return this.clients
      }
    }
  }
}
</script>

<style scoped>
.client:nth-child(even) {
  @apply bg-gray-300;
}
</style>
