<template>
  <div class="flex flex-col bg-gray-700 px-0.5 py-1">
    <div></div>
    <!-- <ViewArchivedHeader :view-active="showActive" @change="emitChange" /> -->
    <!-- <div class="mr-2 status-dot" :class="statusCheck ? 'on' : 'off'" @click="toggleStatus"></div> -->
    <div class="flex items-center justify-between ">
      <SearchHeader class="w-8/12" v-model="searchInput" active-tab="Clients" @input="debounceSearch"
        @click="clearSearch" />
      <span v-if="clientCount" class="text-xs mt-1 mr-4 p-1 font-semibold text-indigo-600 bg-blue-100 rounded-full">{{
        clientCount
      }}</span>
      <span class="ml-1 mr-1 status-dot" :class="statusCheck ? 'on' : 'off'" @click="toggleStatus"> </span>

    </div>
    <HeaderSelectOption v-model="searchOptionValue" :options="searchOptions" @input="debounceSearch" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { debounce } from 'lodash'
import { events, models, mutations, searchOptions } from '~/shared/constants'

export default {
  name: 'ClientListHeader',
  data() {
    return {
      showActive: true,
    }
  },
  computed: {
    ...mapState([models.clientSearchValue, models.clientSearchOption, models.clients, models.selectedSmartview, models.dotStatus, models.spinner]),
    debounceSearch() {
      return debounce(this.searchClients, 500)
    },
    searchOptions() {
      return searchOptions
    },
    searchInput: {
      get() {
        return this.clientSearchValue.length > 0 ? this.clientSearchValue : ''
      },
      set(value) {
        this.$store.commit(mutations.setModelResponse, { model: models.selectedSmartview, data: [] })
        this.$store.commit(mutations.setModelResponse, { model: models.clientSearchValue, data: value })
      },
    },
    searchOptionValue: {
      get() {
        return this.clientSearchOption.length > 0 ? this.clientSearchOption : ''
      },
      set(value) {
        this.$store.commit(mutations.setModelResponse, { model: models.clientSearchOption, data: value })
      },
    },
    clientCount() {
      if (this.searchInput) {
        return Object.entries(this.clients).filter(([key, client]) => !this.showActive === client.archived).length
      } else {
        return 0
      }
    },
    hasSelectedSmartview() {
      return !Array.isArray(this.selectedSmartview) || this.selectedSmartview.length
    },
    headers() {
      return this.$api.getHeaders()
    },
    statusCheck() {
      return this.dotStatus
    },
  },
  methods: {
    emitChange(value) {
      this.showActive = value
      this.$emit(events.change)
    },
    searchClients() {
      this.$store.commit("showSpinner", true)
      const headers = this.$api.getHeaders()
      this.$api.getClientList(headers).finally(() => this.$store.commit("showSpinner", false))
    },
    clearSearch() {
      this.searchInput = ''
      this.searchClients()
    },
    toggleStatus() {
      this.$store.commit('changeDotStatus')
      this.$store.commit("showSpinner", true)
      this.$api.getClientList(this.headers)
        .finally(() => {
          this.$store.commit("showSpinner", false)
        })
    },
  },
}
</script>

<style scoped>
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
