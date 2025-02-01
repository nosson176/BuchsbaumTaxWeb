<template>
  <div>
    <div class="bg-gray-800 text-white w-full flex justify-center items-center h-10 z-10 shadow px-4">
      <button @click="openLogoutModal" class="m-0">
        <LogoutIcon class="w-4 cursor-pointer transform hover:text-indigo-400 hover:scale-150" />
      </button>
      <div class="p-3 flex items-center gap-1">
        <span class="font-bold">{{ username }}</span>
        <!-- <span class="ml-1 mr-2 status-dot" :class="statusCheck ? 'on' : 'off'" @click="toggleStatus"> </span> -->
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

      <div class="flex justify-between items-center  h-7 cursor-pointer">
        <span class="cursor-pointer">{{ formatTime }}</span>
        <PauseIcon v-if="workTimePlay" class="w-4 ml-1.5" @click.native="toggleTimer" />
        <PlayIcon v-else class="text-green-500 w-7" @click.native="toggleTimer" />
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
        <!-- <button @click="openLogoutModal">
          <LogoutIcon class="w-4 cursor-pointer transform hover:text-indigo-400 hover:scale-150" />
        </button> -->
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
    const now = new Date()
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
      displayTime: '00:00',
      startRange: new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime(),
      endRange: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime(),

    }
  },
  computed: {
    ...mapState([models.clientsHistory, models.inbox, models.currentUser, models.globalPlayTime, models.dotStatus, models.workTimeActive, models.spinner]),
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
      const totalMinutes = Math.floor(this.displayTime / 60000); // להמיר למספר הדקות הכולל
      const hours = Math.floor(totalMinutes / 60); // להמיר שעות
      const minutes = totalMinutes % 60; // לחשב את הדקות הנותרות

      // להחזיר בפורמט HH:mm
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

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
    // this.playTimer()
    this.$watch(
      () => this.currentUser,
      (newVal) => {
        if (newVal && Object.keys(newVal).length > 0) {
          this.getSumHourWorkTime();
        }
      },
      { immediate: true } // Ensures it checks the current value immediately
    )
  },
  watch: {
    workTimePlay(newVal) {
      if (newVal === true) {
        this.getSumHourWorkTime();
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.intervalId)
  },
  methods: {
    getSumHourWorkTime() {
      // Exit early if the 'timer' exists in localStorage
      if (!this.workTimePlay) {
        if (localStorage.getItem('timer')) this.displayTime = Number(localStorage.getItem('timer'))
        return
      }
      if (typeof localStorage !== 'undefined' && localStorage.getItem('timer')) {
        this.displayTime = Number(localStorage.getItem('timer'))
        this.playTimer()
        return;
      }

      // Check if currentUser is available and has data
      if (this.currentUser && Object.keys(this.currentUser).length > 0) {
        this.$api.getSumHourWorkTime(this.headers, {
          startDate: this.startRange,
          endDate: this.endRange,
          userId: this.currentUser.id,
        })
          .then(res => {

            // Check if response is an array and calculate total hours
            if (Array.isArray(res)) {
              const totalHours = res.reduce((acc, el) => acc + (el.sumHoursWork || 0), 0);
              this.displayTime = totalHours
              this.playTimer()
            } else {
              console.error("Unexpected API response format. Expected an array:", res);
            }
          })
          .catch(err => {
            console.error("Error fetching sum of work hours:", err);
          });
      } else {
        console.warn("Current user is not set or invalid.");
      }
    }
    ,
    toggleStatus() {
      this.$store.commit('changeDotStatus')
      this.$store.commit("showSpinner", true)
      this.$api.getClientList(this.headers)
        .finally(() => {
          this.$store.commit("showSpinner", false)
        })
    },
    async toggleTimer() {
      if (this.timerRun) {
        this.timerRun = false
        await this.clockOutWorkTime()
        this.stopTimer()

      } else {
        this.timerRun = true
        await this.createWorkTime()
        this.getSumHourWorkTime()
      }
    },
    playTimer() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
      if (!this.timerRun) this.timerRun = true
      if (this.displayTime === '00:00') this.displayTime = 0
      this.intervalId = setInterval(() => {
        this.displayTime += 60000
        localStorage.setItem('timer', this.displayTime)
      }, 60000)
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
    async closeLogoutConfirmationModel() {
      this.ShowLogoutConfirmationModel = false
      await this.$api.signout()
      this.$store.commit('resetState');
      localStorage.clear();
      sessionStorage.clear();
      localStorage.removeItem('timer')
    },
    async loadInbox() {
      await this.$api.getInbox(this.headers)
    },
    createWorkTime() {
      if (this.workTimePlay) return
      const now = new Date()
      const startDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
      const headers = this.$api.getHeaders()
      this.$api.createWorkTime(headers, this.currentUser.id, this.currentUser.username, startDay).then((res) => {
        if (res === 'success' && !this.workTimePlay) this.$store.commit('toggleWorkTime', true)
      })
    },
    clockOutWorkTime() {
      if (!this.workTimePlay) return
      const headers = this.$api.getHeaders()
      const now = new Date()
      const startDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
      this.$api.clockOutWorkTime(headers, this.currentUser.id, startDay).then((res) => {
        if (res === 'success' && this.workTimePlay) this.$store.commit('toggleWorkTime', false)
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