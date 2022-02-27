<template>
  <div>
    <div class="bg-gray-800 text-white w-full flex justify-evenly items-center h-10 z-10 shadow">
      <Dropdown shown-value="History" :options="mappedClientHistory" @input="getSelectedClient" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { models } from '~/shared/constants'

export default {
  name: 'Header',
  computed: {
    ...mapState([models.clientsHistory]),
    mappedClientHistory () {
      if (this.clientsHistoryLoaded) {
        return Object.values(this.clientsHistory).map((item) => {
          return {
            value: item.lastName,
            selected: false,
            ...item
          }
        })
      } else {
        return []
      }
    },
    clientsHistoryLoaded () {
      return !Array.isArray(this.clientsHistory.length) || !this.clientsHistory.length.length
    }
  },
  methods: {
    getSelectedClient (selectedClientName) {
      const selectedClient = Object.values(this.clientsHistory).find(client => client.lastName === selectedClientName)
      const headers = this.$api.getHeaders()
      const id = selectedClient.id
      this.$api.getClientData(headers, id)
    }
  }
}

</script>

<style scoped>

</style>
