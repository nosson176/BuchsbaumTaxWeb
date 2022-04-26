<template>
  <ValuesTableGrid>
    <div class="flex-col">
      <span class="font-bold text-xl text-gray-500">Tax Year Status</span>
      <TaxYearStatusTable @click="setSelectedTaxYearStatus" />
    </div>
    <div class="flex-col">
      <span class="font-bold text-xl text-gray-500">Tax Year Status Detail</span>
      <TaxYearStatusDetailsTable :status="selectedTaxYearStatus" />
    </div>
    <div class="flex-col">
      <span class="font-bold text-xl text-gray-500">Tax Form</span>
      <TaxYearTaxFormsTable />
    </div>
    <div class="flex-col">
      <span class="font-bold text-xl text-gray-500">File Type</span>
      <TaxYearFileTypesTable />
    </div>
    <div class="flex-col">
      <span class="font-bold text-xl text-gray-500">Fbar Status</span>
      <TaxYearFbarStatusTable @click="setSelectedTaxYearFbarStatus" />
    </div>
    <div class="flex-col">
      <span class="font-bold text-xl text-gray-500">Fbar Status Detail</span>
      <TaxYearFbarStatusDetailsTable :status="selectedTaxYearFbarStatus" />
    </div>
    <div class="flex-col">
      <span class="font-bold text-xl text-gray-500">Fbar Filing</span>
      <TaxYearFbarFilingsTable />
    </div>
    <div class="flex-col">
      <span class="font-bold text-xl text-gray-500">State Status</span>
      <TaxYearStateStatusTable @click="setSelectedTaxYearStateStatus" />
    </div>
    <div class="flex-col">
      <span class="font-bold text-xl text-gray-500">State Status Detail</span>
      <TaxYearStateStatusDetailsTable :status="selectedTaxYearStateStatus" />
    </div>
  </ValuesTableGrid>
</template>

<script>
export default {
  name: 'TaxYearValueTables',
  data() {
    return {
      selectedTaxYearStatus: null,
      selectedTaxYearFbarStatus: null,
      selectedTaxYearStateStatus: null,
    }
  },
  methods: {
    setSelectedTaxYearStatus(status) {
      if (this.selectedTaxYearStatus?.id === status.id) {
        this.selectedTaxYearStatus = null
      } else {
        this.selectedTaxYearStatus = status
      }
    },
    setSelectedTaxYearFbarStatus(status) {
      if (this.selectedTaxYearFbarStatus?.id === status.id) {
        this.selectedTaxYearFbarStatus = null
      } else {
        this.selectedTaxYearFbarStatus = status
      }
    },
    setSelectedTaxYearStateStatus(status) {
      if (this.selectedTaxYearStateStatus?.id === status.id) {
        this.selectedTaxYearStateStatus = null
      } else {
        this.selectedTaxYearStateStatus = status
      }
    },
  },
}
</script>

<style scoped></style>
