<template>
  <div class="flex-grow overflow-auto">
    <ClientTaxYearsListItem
      v-for="(taxYear, idx) in displayedTaxYearData"
      :key="taxYear.id"
      :idx="idx"
      :tax-year="taxYear"
      @delete="onDeleteClick"
      @change="toggleItemShown($event, taxYear)"
    />
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
    ...mapState([models.selectedClient, models.shownTaxYears, models.shownTaxYears, models.loading]),
    displayedTaxYearData() {
      if (this.isClientSelected) {
        const displayedTaxYearData = Object.assign(
          Object.values(this.selectedClient.taxYearData)
            .filter((taxYear) => this.showArchived === taxYear.archived)
            .sort((a, b) => {
              return a.year < b.year ? 1 : -1
            })
            .map((taxYear) => {
              const shown = this.shownTaxYears.includes(taxYear.id)
              return { shown, ...taxYear }
            })
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
    isClientLoading() {
      return this.loading.selectedClient
    },
  },
  watch: {
    isClientLoading(isLoading) {
      if (!isLoading) {
        this.$store.commit(mutations.setModelResponse, {
          model: models.shownTaxYears,
          data: this.displayedTaxYearData?.slice(0, 4).map((taxYear) => taxYear.id),
        })
      }
    },
    showArchived() {
      this.$store.commit(mutations.setModelResponse, {
        model: models.shownTaxYears,
        data: this.displayedTaxYearData.slice(0, 4).map((taxYear) => taxYear.id),
      })
    },
  },
  methods: {
    toggleItemShown(setValue, taxYear) {
      if (setValue) {
        this.$store.commit(mutations.setModelResponse, {
          model: models.shownTaxYears,
          data: [...this.shownTaxYears, taxYear.id],
        })
      } else {
        this.$store.commit(mutations.setModelResponse, {
          model: models.shownTaxYears,
          data: this.shownTaxYears.filter((id) => id !== taxYear.id),
        })
      }
    },
    onDeleteClick(taxYearId) {
      if (this.showArchived) {
        const taxYear = this.displayedTaxYearData.find((taxYear) => taxYear.id === taxYearId)
        taxYear.archived = false
        this.$api
          .updateTaxYear(this.headers, { clientId: this.selectedClient.id, taxYearId }, taxYear)
          .then(() => this.$api.getClientData(this.headers, this.selectedClient.id))
      } else {
        this.$store.commit(mutations.setModelResponse, {
          model: models.modals,
          data: { delete: { showing: true, data: { id: taxYearId, type: tabs.tax_years } } },
        })
      }
    },
  },
}
</script>

<style scoped></style>
