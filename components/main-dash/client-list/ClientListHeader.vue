<template>
  <div class="flex flex-col bg-blue-200 px-0.5 py-1">
    <ViewArchivedHeader :view-active="showActive" @change="emitChange" />
    <div class="flex items-center justify-between space-x-1">
      <SearchHeader v-model="searchInput" active-tab="Clients" @input="debounceSearch" @click="clearSearch" />
      <span v-if="clientCount" class="text-xs mt-1 p-1 font-semibold text-indigo-600 bg-blue-100 rounded">{{
        clientCount
      }}</span>
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
    ...mapState([models.clientSearchValue, models.clientSearchOption, models.clients, models.selectedSmartview]),
    debounceSearch() {
      return debounce(this.searchClients, 1000)
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
  },
  mounted() {
    if (this.searchInput) {
      this.searchClients()
    }
  },
  methods: {
    emitChange(value) {
      this.showActive = value
      this.$emit(events.change)
    },
    searchClients() {
      const headers = this.$api.getHeaders()
      this.$api.getClientList(headers, this.searchInput, this.searchOptionValue)
    },
    clearSearch() {
      this.searchInput = ''
      this.searchClients()
    },
  },
}
</script>

<style scoped></style>
