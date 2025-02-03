<template>
  <div class="flex-grow flex overflow-hidden">
    <LoadingIndicator v-show="showLoadingSpinner" class="h-8 w-8 text-black mx-auto my-auto" />
    <div v-show="!showLoadingSpinner" class="tax-year-grid">
      <div class="flex flex-col col-start-1 border-r border-gray-300 overflow-hidden">
        <ClientTaxYearsListHeader :show-archived="showArchived" @change="toggleArchivedYears" />
        <ClientTaxYearsList :show-archived="showArchived" />
      </div>
      <div class="flex col-start-2 col-span-8 overflow-hidden">
        <ClientTaxYearCardMenu :show-archived="showArchived" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { models } from '~/shared/constants'

export default {
  name: 'ClientTaxYears',
  data() {
    return {
      showArchived: false,
      clickOnClient: false,
    }
  },
  computed: {
    ...mapState([models.loading, models.clientClicked]),
    isSelectedClientLoading() {
      return this.loading.selectedClient
    },
    showLoadingSpinner() {
      return this.isSelectedClientLoading && this.clickOnClient
    },
  },
  watch: {
    clientClicked() {
      this.clickOnClient = true
    },
    isSelectedClientLoading() {
      if (!this.isSelectedClientLoading) {
        this.clickOnClient = false
      }
    },
  },
  methods: {
    toggleArchivedYears() {
      this.showArchived = !this.showArchived
    },
  },
}
</script>

<style scoped>
.tax-year-grid {
  @apply grid grid-rows-1 w-full;

  grid-template-columns: 200px repeat(6, minmax(0, 1fr));
}
</style>
