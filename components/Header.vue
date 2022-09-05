<template>
  <div>
    <div class="bg-gray-800 text-white w-full flex justify-center items-center h-10 z-10 shadow px-4">
      <button
        type="button"
        class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-2 py-1 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
        aria-expanded="true"
        @click="openSmsModal"
      >
        Send SMS
      </button>
      <div class="ml-auto">
        <Dropdown shown-value="History" :options="mappedClientHistory" @input="getSelectedClient" />
      </div>
      <div class="ml-auto flex space-x-4 items-center">
        <div class="relative flex cursor-pointer" @click="openInboxModal">
          <InboxIcon class="w-4 cursor-pointer" />
          <div v-if="hasUnreadMessages" class="absolute top-2 right-2 rounded-full bg-red-500">
            <BellIcon class="h-3 w-3" />
          </div>
        </div>
        <nuxt-link :to="mapsRoute">
          <MapIcon class="w-4 cursor-pointer transform hover:text-indigo-400 hover:scale-150" />
        </nuxt-link>
        <nuxt-link :to="usersRoute">
          <UsersIcon class="w-4 cursor-pointer transform hover:text-indigo-400 hover:scale-150" />
        </nuxt-link>
        <nuxt-link :to="valuesRoute">
          <ValuesIcon class="w-4 cursor-pointer transform hover:text-indigo-400 hover:scale-150" />
        </nuxt-link>
        <nuxt-link :to="homeRoute">
          <HomeIcon class="w-4 cursor-pointer transform hover:text-indigo-400 hover:scale-150" />
        </nuxt-link>
        <button @click="logout">
          <LogoutIcon class="w-4 cursor-pointer transform hover:text-indigo-400 hover:scale-150" />
        </button>
      </div>
    </div>
    <Modal :showing="showSmsModal" @hide="closeSmsModal">
      <SendSms @hide="closeSmsModal" />
    </Modal>
    <Modal full-width :showing="showInboxModal" @hide="closeInboxModal">
      <Inbox @hide="closeInboxModal" @newMessage="createNewMessage" />
    </Modal>
    <Modal :showing="showMessageModal" @hide="closeMessageModal">
      <SendMessage :response-id="responseId" @hide="closeMessageModal" />
    </Modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { models, routes } from '~/shared/constants'

export default {
  name: 'Header',
  data() {
    return {
      showSmsModal: false,
      showInboxModal: false,
      showMessageModal: false,
      responseId: null,
    }
  },
  computed: {
    ...mapState([models.clientsHistory, models.inbox]),
    mappedClientHistory() {
      if (this.clientsHistoryLoaded) {
        return Object.values(this.clientsHistory).map((item) => {
          return {
            value: item.lastName,
            selected: false,
            ...item,
          }
        })
      } else {
        return []
      }
    },
    clientsHistoryLoaded() {
      return !Array.isArray(this.clientsHistory.length) || !this.clientsHistory.length.length
    },
    homeRoute() {
      return {
        name: routes.root,
      }
    },
    valuesRoute() {
      return {
        name: routes.values,
      }
    },
    usersRoute() {
      return {
        name: routes.users,
      }
    },
    mapsRoute() {
      return { name: routes.maps }
    },
    headers() {
      return this.$api.getHeaders()
    },
    inboxMessages() {
      return this.inbox
    },
    hasUnreadMessages() {
      let unread = false
      for (const key in this.inboxMessages) {
        if (this.inboxMessages[key].status === 'unread') {
          unread = true
          break
        }
      }
      return unread
    },
  },
  created() {
    this.loadInbox()
  },
  methods: {
    getSelectedClient(selectedClientName) {
      const selectedClient = Object.values(this.clientsHistory).find((client) => client.lastName === selectedClientName)
      const headers = this.$api.getHeaders()
      const id = selectedClient.id
      this.$api.getClientData(headers, id)
    },
    openSmsModal() {
      this.showSmsModal = true
    },
    closeSmsModal() {
      this.showSmsModal = false
    },
    openInboxModal() {
      this.showInboxModal = true
    },
    closeInboxModal() {
      this.showInboxModal = false
    },
    openMessageModal() {
      this.showMessageModal = true
    },
    closeMessageModal() {
      this.showMessageModal = false
    },
    async loadInbox() {
      await this.$api.getInbox(this.headers)
    },
    logout() {
      this.$api.signout()
    },
    createNewMessage(responseId) {
      this.responseId = responseId
      this.openMessageModal()
    },
  },
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
