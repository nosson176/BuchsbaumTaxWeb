<template>
  <div>
    <div class="bg-gray-800 text-white w-full flex justify-center items-center h-10 z-10 shadow px-4">
      <div class="p-3 ">
        <span class="font-bold">{{ username }}</span>
        <span class="m-2 cursor-pointer" @click="toggleTimer" @dblclick="resetTimer">{{ formatTime }}</span>
      </div>
      <div class="mr-2 status-dot" :class="statusCheck ? 'on' : 'off'" @click="toggleStatus">
      </div>
      <!-- <button type="button"
        class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-2 py-1 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
        aria-expanded="true" @click="openSmsModal">
        Send SMS
      </button> -->
      <!-- <div
        class="inline-flex justify-center shadow-sm px-2 py-1 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
        <Dropdown shown-value="Time" :value="selectedTime" :options="[2, 5, 10, 15, 20]"
          @input="chooseSecondsNeededToDisplayModal1" />
      </div> -->
      <div class="flex h-7 w-7 ml-5 cursor-pointer">
        <PauseIcon v-if="workTimePlay" @click.native="clockOutWorkTime" />
        <PlayIcon v-else class="text-green-500" @click.native="createWorkTime" />
      </div>
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
        <a href="#" @click="irsPopup">
          <GlobeIcon class="w-4 cursor-pointer transform hover:text-indigo-400 hover:scale-150" />
        </a>
        <a href="#" @click="shekelatorPopup">
          <DollarIcon class="w-4 cursor-pointer transform hover:text-indigo-400 hover:scale-150" />
        </a>
        <nuxt-link :to="workTimeRoute">
          <ClockIcon class="w-4 cursor-pointer transform hover:text-indigo-400 hover:scale-150" />
        </nuxt-link>
        <nuxt-link :to="mapsRoute">
          <MapIcon class="w-4 cursor-pointer transform hover:text-indigo-400 hover:scale-150" />
        </nuxt-link>
        <nuxt-link v-if="isCurrentUserAdmin" :to="usersRoute">
          <UsersIcon class="w-4 cursor-pointer transform hover:text-indigo-400 hover:scale-150" />
        </nuxt-link>
        <nuxt-link v-if="isCurrentUserAdmin" :to="valuesRoute">
          <ValuesIcon class="w-4 cursor-pointer transform hover:text-indigo-400 hover:scale-150" />
        </nuxt-link>
        <nuxt-link :to="homeRoute">
          <HomeIcon class="w-4 cursor-pointer transform hover:text-indigo-400 hover:scale-150" />
        </nuxt-link>
        <button @click="openLogoutModal">
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
      <SendMessage :response-id="responseId" :thread-id="threadId" @hide="closeMessageModal" />
    </Modal>
    <Modal :showing="ShowLogoutConfirmationModel" @hide="closeLogoutConfirmationModel">
      <LogoutConfirmationModal @confirm-logout="clockOutWorkTime" @hide="closeLogoutConfirmationModel" />
    </Modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { models, mutations, routes, USER_TYPE_ADMIN } from '~/shared/constants'

export default {
  name: 'Header',
  data() {
    return {
      // status: true,
      showSmsModal: false,
      showInboxModal: false,
      showMessageModal: false,
      responseId: null,
      threadId: null,
      intervalId: null,
      ShowLogoutConfirmationModel: false,
      selectedTime: null,
      timerRun: false,
      displayTime: Number(localStorage.getItem('timer')) || '00:00'

    }
  },
  computed: {
    ...mapState([models.clientsHistory, models.inbox, models.currentUser, models.globalPlayTime, models.dotStatus, models.workTimeActive]),
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
    username() {
      return this.currentUser ? this.currentUser.username : ''
    },
    statusCheck() {
      return this.dotStatus
    },
    playTime() {
      return this.globalPlayTime
    },
    formatTime() {
      if (this.displayTime === '00:00') return '00:00'
      const date = new Date(0); // Create a Date object starting from Unix epoch (1970-01-01)
      date.setSeconds(this.displayTime); // Set the number of seconds

      const hours = String(date.getUTCHours()).padStart(2, '0'); // Get hours in 2 digits
      const minutes = String(date.getUTCMinutes()).padStart(2, '0'); // Get minutes in 2 digits

      return `${hours}:${minutes}`; // Return the formatted time

    },

    workTimePlay() {
      return this.workTimeActive;
    },
    clientsHistoryLoaded() {
      return !Array.isArray(this.clientsHistory.length) || !this.clientsHistory.length.length
    },
    homeRoute() {
      return { name: routes.root }
    },
    valuesRoute() {
      return { name: routes.values }
    },
    usersRoute() {
      return { name: routes.users }
    },
    workTimeRoute() {
      return { name: routes.clock }
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
    isCurrentUserAdmin() {
      return this.currentUser.userType === USER_TYPE_ADMIN
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
    this.playTimer()
  },
  beforeDestroy() {
    clearInterval(this.intervalId)
  },
  methods: {
    toggleStatus() {
      this.$store.commit('changeDotStatus')
      this.$api.getClientList(this.headers)
    },
    toggleTimer() {
      if (this.timerRun) {
        this.timerRun = false
        this.stopTimer()
      } else {
        // this.timerRun = true
        this.playTimer()
      }
    },
    playTimer() {
      if (!this.timerRun) this.timerRun = true
      if (this.displayTime === '00:00') this.displayTime = 0
      this.intervalId = setInterval(() => {
        this.displayTime += 10
        localStorage.setItem('timer', this.displayTime)
      }, 10000)
    },

    stopTimer() {
      clearInterval(this.intervalId)
    },
    resetTimer() {
      localStorage.removeItem('timer')
      clearInterval(this.intervalId)
      this.displayTime = '00:00'
    },

    // togglePlayTime() {
    //   const newStatus = !this.globalPlayTime
    //   this.$store.commit('setModelResponse', { model: 'globalPlayTime', data: newStatus })
    // },
    getSelectedClient(selectedClientName) {
      const selectedClient = Object.values(this.clientsHistory).find((client) => client.lastName === selectedClientName)
      const headers = this.headers
      // const id = selectedClient.id
      this.$store.commit(mutations.setModelResponse, {
        model: models.clientClicked,
        data: Math.random(),
      })
      this.$api.getClientData(headers, selectedClient)
    },
    chooseSecondsNeededToDisplayModal1(selectTime) {
      this.selectedTime = selectTime
      this.setTimeToSecond(selectTime)
    },
    setTimeToSecond(time) {
      const t = time * 60
      this.$store.commit('setModelResponse', { model: 'secondsNeededToDisplayModal1', data: t })
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
    openLogoutModal() {
      this.ShowLogoutConfirmationModel = true
    },
    closeLogoutConfirmationModel() {
      this.ShowLogoutConfirmationModel = false
      this.$api.signout()
      localStorage.removeItem('timer')
    },
    async loadInbox() {
      await this.$api.getInbox(this.headers)
    },
    createWorkTime() {
      const now = new Date()
      const startDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
      const headers = this.$api.getHeaders()
      this.$api.createWorkTime(headers, this.currentUser.id, this.currentUser.username, startDay).then((res) => {
        if (res === 'success') this.$store.commit('toggleWorkTime', true)
      })
    },
    clockOutWorkTime() {
      const headers = this.$api.getHeaders()
      const now = new Date()
      const startDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
      this.$api.clockOutWorkTime(headers, this.currentUser.id, startDay).then((res) => {
        if (res === 'success') this.$store.commit('toggleWorkTime', false)
      })
        .catch((error) => {
          console.error('Error logging out:', error)
        })
    },
    irsPopup() {
      window.open('https://sa.www4.irs.gov/irfof/lang/en/irfofgetstatus.jsp', 'popup', 'width=770,height=770')
    },
    shekelatorPopup() {
      window.open('https://docs.google.com/spreadsheets/d/1YZcySBg-aRoG7xlUcZ3kU-9avK8PLMH-HLz352irqts/edit?gid=0#gid=0', 'popup', 'width=770,height=770')
    },
    createNewMessage(responseId, threadId) {
      this.responseId = responseId
      this.threadId = threadId
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

.status-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: inline-block;
  transition: background-color 0.3s ease;
  cursor: pointer;
}

.status-dot.on {
  background-color: #2ecc71;
  box-shadow: 0 0 10px #2ecc71;
}

.status-dot.off {
  background-color: #e74c3c;
  box-shadow: 0 0 10px #e74c3c;
}
</style>