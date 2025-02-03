<template>
  <div class="flex flex-col flex-grow overflow-hidden ">
    <div class=" grid justify-items-stretch grid-cols-3 bg-blue-200 p-0.5 ">
      <div class="flex">
        <ViewArchivedHeader :view-active="showActive" @change="archiveToggle" />
        <SearchHeader v-model="searchInput" :active-tab="currentTab" />
      </div>
      <div class="mb-auto mt-auto">
        <div v-if="isLoading" class="cursor-pointer italic font-bold text-center ">
          <div class="spinner-overlay">
            <div class="spinner"></div>
          </div>
        </div>
        <div v-else-if="showLogs" class="cursor-pointer italic font-bold text-center " @click="handleShowHide('logs')">
          {{ showOrHideLogs }}
        </div>
        <div v-else-if="showIncome" class="cursor-pointer italic font-bold text-center "
          @click="handleShowHide('incomes')">
          {{ showOrHideIncomes }}
        </div>
        <div v-else-if="showFbar" class="cursor-pointer italic font-bold text-center " @click="handleShowHide('fbars')">
          {{ showOrHideFbars }}
        </div>
      </div>
      <div class="inline-flex justify-end shadow-sm px-2 py-1 text-xs font-semibold text-gray-700 focus:outline-none
        focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 ">
        <Dropdown shown-value="10" :value="selectedTime" :options="[2, 5, 10, 15, 20, 'OFF']"
          @input="chooseSecondsNeededToDisplayModal1" />
      </div>
    </div>
    <LoadingIndicator v-if="showLoadingSpinner" class="h-8 w-8 text-black mx-auto my-auto" />
    <KeepAlive v-else>
      <LogsTable v-if="showLogs" ref="logsTableRef" :show-archived="!showActiveLogs" />
      <IncomeTable class="h-full" v-else-if="showIncome" :show-archived="!showActiveIncome" />
      <FbarTable v-else-if="showFbar" :show-archived="!showActiveFbar" />
    </KeepAlive>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { tabs, mutations, models, tableGroups } from '~/shared/constants'

const initialState = () => ({
  searchInputLogs: '',
  searchInputIncome: '',
  searchInputFbar: '',
  showActiveLogs: true,
  showActiveIncome: true,
  showActiveFbar: true,
  clickOnClient: false,
  selectedTime: null,
  isLoading: false,
  showOrHideLogs: 'Show',
  showOrHideIncomes: 'Show',
  showOrHideFbars: 'Show',
  fetchedLogs: [],
  fetchedIncome: [],
  fetchedFbar: [],
})

export default {
  name: 'LogsIncomeFbarBody',
  props: {
    currentTab: {
      type: String,
      default: '',
    },
  },
  data() {
    return initialState()
  },
  computed: {
    ...mapState([models.loading, models.clientClicked, models.globalPlayTime, models.selectedClient]),
    showLogs() {
      return this.currentTab === tabs.logs
    },
    showIncome() {
      return this.currentTab === tabs.income
    },
    showFbar() {
      return this.currentTab === tabs.fbar
    },
    showActive() {
      if (this.showLogs) {
        return this.showActiveLogs
      } else if (this.showIncome) {
        return this.showActiveIncome
      } else if (this.showFbar) {
        return this.showActiveFbar
      } else {
        return true
      }
    },
    headers() {
      return this.$api.getHeaders()
    },
    searchInput: {
      get() {
        if (this.showLogs) {
          return this.searchInputLogs
        } else if (this.showIncome) {
          return this.searchInputIncome
        } else if (this.showFbar) {
          return this.searchInputFbar
        } else {
          return ''
        }
      },
      set(val) {
        if (this.showLogs) {
          this.searchInputLogs = val
        } else if (this.showIncome) {
          this.searchInputIncome = val
        } else if (this.showFbar) {
          this.searchInputFbar = val
        }
      },
    },
    playTime() {
      return this.globalPlayTime
    },
    isSelectedClientLoading() {
      return this.loading.selectedClient
    },
    showLoadingSpinner() {
      return this.isSelectedClientLoading && this.clickOnClient
    },
  },
  watch: {
    searchInput(searchInput) {
      this.searchInputUpdate(searchInput)
    },
    clientClicked() {
      this.showOrHideLogs = 'Show'
      this.showOrHideIncomes = 'Show'
      this.showOrHideFbars = 'Show'
      this.fetchedLogs = []
      this.fetchedIncome = []
      this.fetchedFbar = []
      this.clickOnClient = true
    },
    isSelectedClientLoading() {
      if (!this.isSelectedClientLoading) {
        this.clickOnClient = false
      }
    },
  },
  methods: {
    async handleShowHide(tab) {
      if (tab === 'logs') {
        if (this.showOrHideLogs === 'Show') {
          this.showOrHideLogs = 'Hide'
          await this.getRestData()
        } else {
          this.showOrHideLogs = 'Show'
          this.hideRestData()
        }
        return
      }
      if (tab === 'incomes') {
        if (this.showOrHideIncomes === 'Show') {
          this.showOrHideIncomes = 'Hide'
          await this.getRestData()
        } else {
          this.showOrHideIncomes = 'Show'
          this.hideRestData()
        }
        return
      }
      if (tab === 'fbars') {
        if (this.showOrHideFbars === 'Show') {
          this.showOrHideFbars = 'Hide'
          await this.getRestData()
        } else {
          this.showOrHideFbars = 'Show'
          this.hideRestData()
        }
      }
    },
    // async handleShowHide() {
    //   if (!this.$refs.logsTableRef) return;

    //   if (this.showOrHide === 'Show') {
    //     this.showOrHide = 'Hide';
    //     await this.getRestLogs();
    //   } else {
    //     this.showOrHide = 'Show';
    //     this.hideRestLogs();
    //   }
    // },
    getRestData() {
      if (this.showLogs) this.getRestLogs()
      if (this.showIncome) this.getRestIncomes()
      if (this.showFbar) this.getRestFbars()

      this.isLoading = true;
    },

    async getRestLogs() {
      if (this.fetchedLogs.length > 0) {
        this.$store.commit('pushRestLogs', this.fetchedLogs);
        this.isLoading = false;
        return;
      }

      try {
        const res = await this.$api.getRestLogsByClient(this.headers, {
          clientId: this.$store.state.selectedClient.id
        });
        const data = Object.values(res);
        if (data.length > 0) {
          this.fetchedLogs = data;
          this.$store.commit('pushRestLogs', data);
        } else {
          this.$toast.info('There are no more items to load.')
        }
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async getRestIncomes() {
      if (this.fetchedIncome.length > 0) {
        this.$store.commit('pushRestIncomes', this.fetchedIncome);
        this.isLoading = false;
        return;
      }

      try {
        const res = await this.$api.getRestIncomesByClient(this.headers, {
          clientId: this.$store.state.selectedClient.id
        });
        const data = Object.values(res);
        if (data.length > 0) {
          this.fetchedIncome = data;
          this.$store.commit('pushRestIncomes', data);
        } else {
          this.$toast.info('There are no more items to load.')
        }
      } catch (error) {
        console.error('Error fetching Incomes:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async getRestFbars() {
      if (this.fetchedFbar.length > 0) {
        this.$store.commit('pushRestFbars', this.fetchedFbar);
        this.isLoading = false;
        return;
      }

      try {
        const res = await this.$api.getRestFbarByClient(this.headers, {
          clientId: this.$store.state.selectedClient.id
        });
        const data = Object.values(res);
        if (data.length > 0) {
          this.fetchedFbar = data;
          this.$store.commit('pushRestFbars', data);
        } else {
          this.$toast.info('There are no more items to load.')
        }
      } catch (error) {
        console.error('Error fetching fbar:', error);
      } finally {
        this.isLoading = false;
      }
    },

    hideRestData() {
      if (this.showLogs) {
        const count = this.fetchedLogs.length;
        if (count > 0) {
          this.$store.commit('hideRestLogs', count);
        }
      }
      if (this.showIncome) {
        const count = this.fetchedIncome.length;
        if (count > 0) {
          this.$store.commit('hideRestIncomes', count);
        }
      }
      if (this.showFbar) {
        const count = this.fetchedFbar.length;
        if (count > 0) {
          this.$store.commit('hideRestFbars', count);
        }
      }
    },
    searchInputUpdate(searchInput) {
      this.$store.commit(mutations.setModelResponse, {
        model: models.search,
        data: { [tableGroups.logsIncomeFbar]: searchInput },
      })
    },
    archiveToggle(value) {
      if (this.showLogs) {
        this.showActiveLogs = value
      } else if (this.showIncome) {
        this.showActiveIncome = value
      } else if (this.showFbar) {
        this.showActiveFbar = value
      }
    },
    resetClock() {
      if (this.$refs.logsTableRef) {
        this.$refs.logsTableRef.resetClock()
      }
    },
    chooseSecondsNeededToDisplayModal1(selectTime) {
      if (selectTime === 'OFF') return this.togglePlayTime(selectTime)
      this.selectedTime = selectTime
      this.setTimeToSecond(selectTime)

      if (!this.globalPlayTime && selectTime !== 'OFF') this.togglePlayTime(selectTime)
    },
    setTimeToSecond(time) {
      const t = time * 60
      this.$store.commit('setModelResponse', { model: 'secondsNeededToDisplayModal1', data: t })
    },
    togglePlayTime(selectTime) {
      let newStatus
      if (selectTime === 'OFF') newStatus = false
      else newStatus = true

      this.$store.commit('setModelResponse', { model: 'globalPlayTime', data: newStatus })
    },
  },
}
</script>

<style scoped>
.spinner-overlay {
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  /* background-color: rgba(0, 0, 0, 0.2); */
  z-index: 100;
  height: 100%;
}

/* Spinner design */
.spinner {
  border: 6px solid #f3f3f3;
  border-top: 6px solid #3498db;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1.5s linear infinite;
}

/* Spinner rotation animation */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
