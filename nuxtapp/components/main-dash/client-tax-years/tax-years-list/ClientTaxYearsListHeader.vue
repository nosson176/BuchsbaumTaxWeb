<template>
  <div class="flex bg-blue-200 px-1 justify-between items-center z-10 shadow">
    <AddRowButton @click="onAddRowClick" />
    <ViewArchivedHeader @change="emitChange" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { events, models, mutations } from '~/shared/constants'

export default {
  name: 'ClientTaxYearsListHeader',
  computed: {
    ...mapState([models.selectedClient, models.valueTypes, models.shownTaxYears])
  },
  methods: {
    emitChange () {
      this.$emit(events.change)
    },
    onAddRowClick () {
      if (this.selectedClient) {
        const headers = this.$api.getHeaders()
        const clientId = this.selectedClient.id
        const taxYear = {
          clientId,
          year: this.valueTypes.year_name.filter(year => year.show)[0].value,
          archived: false,
          irsHistory: false
        }
        this.$api.createTaxYear(headers, { clientId, taxYear })
          .then((data) => {
            this.$api.getClientData(headers, clientId)
              .then(() => {
                this.$store.commit(mutations.setModelResponse, {
                  model: models.shownTaxYears,
                  data: [...this.shownTaxYears, data.id]
                })
              })
          })
      }
    }
  }
}
</script>

<style scoped>
</style>
