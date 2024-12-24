<template>
  <div class="flex flex-row-reverse overflow-x-auto overflow-y-hidden space-x-4 pl-4 pr-128">
    <template v-for="(yearData, idx) in displayedTaxYearData">
      <div v-if="idx === 0" :key="yearData.id + 'd'" class="mr-52"></div>
      <ClientTaxYearCard :key="yearData.id" :year-data="yearData" />
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { models } from '~/shared/constants'

export default {
  name: 'ClientTaxYearCardMenu',
  props: {
    showArchived: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState([models.selectedClient, models.selectedTaxYearId, models.filingsUpdate]),
    displayedTaxYearData() {
      if (this.isClientSelected) {
        const items = Object.assign(
          Object.values(this.selectedClient.taxYears)
            .filter((taxYear) => taxYear.show && this.showArchived === taxYear.archived)
            .sort((a, b) => {
              return a.year - b.year
            })
        )
        console.log(JSON.parse(JSON.stringify(items)))
        return items.reverse()
      } else {
        return null
      }
    },
    isClientSelected() {
      return this.selectedClient.length || Object.entries(this.selectedClient).length
    },
  },
  watch: {
    selectedClient: {
      handler(newClient, oldClient) {
        console.log("im here!")
        if (newClient.id !== oldClient.id && oldClient.id !== undefined) {
          if (this.filingsUpdate.length > 0) {
            this.sendUpdatesToServer()
          }
        }
      },
      deep: true,  // Watch for nested object changes as well
    },
  },

  methods: {
    sendUpdatesToServer() {
      const headers = this.$api.getHeaders()
      this.$api.updateFilings(
        headers,
        this.filingsUpdate
      )
      this.$store.commit('clearFilingUpdate');
    },
  }
}


</script>

<style scoped></style>
