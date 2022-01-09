<template>
  <div class="flex flex-col bg-blue-200 p-0.5">
    <ViewArchivedHeader @change="emitChange" />
    <SearchHeader v-model="searchInput" active-tab="Clients" @input="debounceSearch" @click="clearSearch" />
    <SelectOption v-model="searchOptionValue" :shown-value="seachOptionName" :options="searchOptions" @input="debounceSearch" />
  </div>
</template>

<script>
import { debounce } from 'lodash'
import { events, searchOptions } from '~/shared/constants'

export default {
  name: 'ClientListHeader',
  data () {
    return {
      searchInput: '',
      searchOptionValue: ''
    }
  },
  computed: {
    debounceSearch () {
      return debounce(this.searchClients, 1000)
    },
    searchOptions () {
      return searchOptions
    },
    seachOptionName () {
      return this.searchOptions.find(option => option.value === this.searchOptionValue)?.name
    }
  },
  methods: {
    emitChange () {
      this.$emit(events.change)
    },
    searchClients () {
      const headers = this.$api.getHeaders()
      this.$api.getClientList(headers, this.searchInput, this.searchOptionValue)
    },
    clearSearch () {
      this.searchInput = ''
      this.searchClients()
    }
  }
}
</script>

<style scoped>

</style>
