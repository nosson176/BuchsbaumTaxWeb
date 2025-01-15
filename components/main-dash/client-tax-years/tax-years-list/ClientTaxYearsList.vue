<template>
  <div class="flex-grow overflow-auto">
    <ClientTaxYearsListItem v-for="(taxYear, idx) in displayedTaxYearData" :key="taxYear.id" :idx="idx"
      :tax-year="taxYear" @delete="startDelete($event, taxYear)" @change="toggleItemShown($event, taxYear)" />
    <div>
      <Modal :showing="showDeleteModal" @hide="closeDeleteModal">
        <DeleteType :label="deleteTypeLabel" @hide="closeDeleteModal" @delete="onDeleteClick" />
      </Modal>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { filingTypes, models } from '~/shared/constants'

export default {
  name: 'ClientTaxYearsList',
  props: {
    showArchived: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showDeleteModal: false,
      deleteTypeLabel: '',
      taxId: null
    }
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
      const updatedTaxYear = Object.assign({}, taxYear, { show: !taxYear.show })
      this.$store.commit('updateTaxYearState', { taxYearId: updatedTaxYear.id, updatedData: updatedTaxYear });
      this.$api
        .updateTaxYear(this.headers, { clientId: this.selectedClient.id, taxYearId: updatedTaxYear.id }, updatedTaxYear)
    },

    startDelete(e) {
      this.taxId = e
      this.showDeleteModal = true
      this.deleteTypeLabel = 'tax Year'

    },
    onDeleteClick() {
      this.$api
        .deleteTaxYear(this.headers, { taxYearId: this.taxId }).then(res => {
          if (res.success === "Success") {
            this.$store.commit("deleteTaxYear", { taxId: this.taxId })
            this.closeDeleteModal()
          }
        })


      // if (this.showArchived) {
      //   const taxYearToUpdate = this.displayedTaxYearData.find((taxYear) => taxYear.id === taxYearId);
      //   if (taxYearToUpdate) {
      //     // Prepare the updated data
      //     const updatedData = { archived: false, show: true };
      //     this.$store.commit('updateTaxYearState', { taxYearId, updatedData });
      //   }
      //   this.$api
      //     .updateTaxYear(this.headers, { clientId: this.selectedClient.id, taxYearId }, taxYear)
      // } else {
      //   this.$store.commit(mutations.setModelResponse, {
      //     model: models.modals,
      //     data: { delete: { showing: true, data: { id: taxYearId, type: tabs.tax_years } } },
      //   });
      // }
    },

    closeDeleteModal() {
      this.showDeleteModal = false
      this.taxId = ''
    },

    isSelected({ id }) {
      return this.selectedTaxYearId === id
    },
  },
}
</script>

<style scoped></style>
