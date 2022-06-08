<template>
  <div class="flex-grow flex overflow-hidden">
    <div class="grid grid-cols-7 grid-rows-1 w-full">
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
    }
  },
  computed: {
    ...mapState([models.selectedClient]),
  },
  methods: {
    toggleArchivedYears() {
      this.showArchived = !this.showArchived
    },
  },
}
</script>

<style scoped></style>
