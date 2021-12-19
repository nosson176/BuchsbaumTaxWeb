<template>
  <div class="flex flex-col bg-blue-200 p-0.5 z-10 shadow">
    <ViewArchivedHeader @change="emitChange" />
    <SearchHeader v-model="searchInput" active-tab="Clients" @input="debounceSearch" />
  </div>
</template>

<script>
import { debounce } from 'lodash'
import { events } from '~/shared/constants'

export default {
  name: 'ClientListHeader',
  data () {
    return {
      searchInput: ''
    }
  },
  computed: {
    debounceSearch () {
      return debounce(this.searchClients, 1000)
    }
  },
  methods: {
    emitChange () {
      this.$emit(events.change)
    },
    searchClients () {
      const headers = this.$api.getHeaders()
      this.$api.getClientList(headers, this.searchInput)
    }
  }
}
</script>

<style scoped>

</style>
