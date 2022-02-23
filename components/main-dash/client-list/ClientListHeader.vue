<template>
  <div class="flex flex-col bg-blue-200 px-0.5 py-1">
    <ViewArchivedHeader @change="emitChange" />
    <SearchHeader v-model="searchInput" active-tab="Clients" @input="debounceSearch" @click="clearSearch" />
    <HeaderSelectOption v-model="searchOptionValue" :shown-value="seachOptionName" :options="searchOptions" @input="debounceSearch" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { debounce } from 'lodash'
import { events, models, mutations, searchOptions } from '~/shared/constants'

export default {
  name: 'ClientListHeader',
  data () {
    return {
      searchOptionValue: ''
    }
  },
  computed: {
    ...mapState([models.clientSearchValue]),
    debounceSearch () {
      return debounce(this.searchClients, 1000)
    },
    searchOptions () {
      return searchOptions
    },
    seachOptionName () {
      return this.searchOptions.find(option => option.value === this.searchOptionValue)?.name
    },
    searchInput: {
      get () {
        return this.clientSearchValue.length > 0 ? this.clientSearchValue : ''
      },
      set (value) {
        this.$store.commit(mutations.setModelResponse, { model: models.selectedSmartview, data: [] })
        this.$store.commit(mutations.setModelResponse, { model: models.clientSearchValue, data: value })
      }
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
