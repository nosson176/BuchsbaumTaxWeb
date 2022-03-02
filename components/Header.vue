<template>
  <div>
    <div
      class="bg-gray-800 text-white w-full flex justify-center items-center h-10 z-10 shadow px-4"
    >
      <div class="ml-auto">
        <Dropdown shown-value="History" :options="mappedClientHistory" @input="getSelectedClient" />
      </div>
      <div class="ml-auto flex space-x-4 items-center">
        <a href="#">
          <UsersIcon class="w-4 cursor-pointer transform hover:text-indigo-400 hover:scale-150" />
        </a>
        <nuxt-link :to="valuesRoute">
          <ValuesIcon class="w-4 cursor-pointer transform hover:text-indigo-400 hover:scale-150" />
        </nuxt-link>
        <nuxt-link :to="homeRoute">
          <HomeIcon class="w-4 cursor-pointer transform hover:text-indigo-400 hover:scale-150" />
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { models, routes } from '~/shared/constants'

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
    },
    homeRoute () {
      return {
        name: routes.root
      }
    },
    valuesRoute () {
      return {
        name: routes.values
      }
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
a.nuxt-link-exact-active svg {
  @apply text-indigo-500 w-8;
}

a.nuxt-link-exact-active svg:hover {
  @apply text-indigo-500 scale-100;
}
</style>
