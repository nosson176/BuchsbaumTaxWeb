<template>
  <div class="grid grid-cols-7 grid-rows-1">
    <div class="flex h-full flex-col col-start-1 border-r border-gray-300">
      <ClientTaxYearsMenuHeader @change="toggleArchivedYears" />
      <ClientTaxYearsMenu :show-archived="showArchived" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { models } from '~/shared/constants'

export default {
  name: 'ClientTaxYears',
  data () {
    return {
      showArchived: false
    }
  },
  computed: {
    ...mapState([models.selectedClient])
  },
  methods: {
    toggleArchivedYears () {
      this.showArchived = !this.showArchived
    }
  }
}
</script>

<style scoped>

</style>
