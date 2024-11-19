<template>
  <div class="flex-grow overflow-auto">
    <ClientTaxYearsListItem v-for="(taxYear, idx) in displayedTaxYearData" :key="taxYear.id" :idx="idx"
      :tax-year="taxYear" @delete="onDeleteClick($event, taxYear)" @change="toggleItemShown($event, taxYear)" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { filingTypes, models, mutations, tabs } from '~/shared/constants'

export default {
  name: 'ClientTaxYearsList',
  props: {
    showArchived: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState([models.selectedClient, models.loading, models.selectedTaxYearId]),
    displayedTaxYearData() {
      if (this.isClientSelected) {
        const displayedTaxYearData = Object.assign(
          Object.values(this.selectedClient.taxYears).filter((taxYear) => this.showArchived === taxYear.archived)
        )
        return displayedTaxYearData
      } else {
        return null
      }
    },
    isClientSelected() {
      return this.selectedClient.length || Object.entries(this.selectedClient).length
    },
    federalFilingInfo() {
      return this.filings.filter((filing) => filing.filingType === filingTypes.federal)[0]
    },
    headers() {
      return this.$api.getHeaders()
    },
  },
  methods: {
    toggleItemShown(setValue, taxYear) {
      console.log("toggleItemShown")
      const updatedTaxYear = Object.assign({}, taxYear, { show: !taxYear.show })
      this.$store.commit('updateTaxYearState', { taxYearId: updatedTaxYear.id, updatedData: updatedTaxYear });
      this.$api
        .updateTaxYear(this.headers, { clientId: this.selectedClient.id, taxYearId: updatedTaxYear.id }, updatedTaxYear)
    },
    onDeleteClick(taxYearId, taxYear) {
      if (this.showArchived) {
        console.log("showArchived");
        const taxYearToUpdate = this.displayedTaxYearData.find((taxYear) => taxYear.id === taxYearId);
        if (taxYearToUpdate) {
          // Prepare the updated data
          const updatedData = { archived: false, show: true };
          this.$store.commit('updateTaxYearState', { taxYearId, updatedData });
        }
        this.$api
          .updateTaxYear(this.headers, { clientId: this.selectedClient.id, taxYearId }, taxYear)
      } else {
        console.log("UNNNshowArchived");
        this.$store.commit(mutations.setModelResponse, {
          model: models.modals,
          data: { delete: { showing: true, data: { id: taxYearId, type: tabs.tax_years, label: taxYear.year } } },
        });
      }
    },

    isSelected({ id }) {
      return this.selectedTaxYearId === id
    },
  },
}
</script>

<style scoped></style>
