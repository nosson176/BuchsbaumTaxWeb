<template>
  <ValuesTableGrid>
    <TaxYearStatusTable @click="setSelectedTaxYearStatus" />
    <TaxYearStatusDetailsTable :status="selectedTaxYearStatus" />
    <TaxYearTaxFormsTable />
    <TaxYearFileTypesTable />
    <TaxYearFbarStatusTable @click="setSelectedTaxYearFbarStatus" />
    <TaxYearFbarStatusDetailsTable :status="selectedTaxYearFbarStatus" />
    <TaxYearFbarFilingsTable />
    <TaxYearStateStatusTable @click="setSelectedTaxYearStateStatus" />
    <TaxYearStateStatusDetailsTable :status="selectedTaxYearStateStatus" />
  </ValuesTableGrid>
</template>

<script>
export default {
  name: 'TaxYearValueTables',
  data () {
    return {
      selectedTaxYearStatus: null,
      selectedTaxYearFbarStatus: null,
      selectedTaxYearStateStatus: null,
    }
  },
  methods: {
    setSelectedTaxYearStatus (status) {
      if (this.selectedTaxYearStatus?.id === status.id) {
        this.selectedTaxYearStatus = null;
      } else {
        this.selectedTaxYearStatus = status;
      }
    },
    setSelectedTaxYearFbarStatus (status) {
      if (this.selectedTaxYearFbarStatus?.id === status.id) {
        this.selectedTaxYearFbarStatus = null;
      } else {
        this.selectedTaxYearFbarStatus = status;
      }
    },
    setSelectedTaxYearStateStatus (status) {
      if (this.selectedTaxYearStateStatus?.id === status.id) {
        this.selectedTaxYearStateStatus = null;
      } else {
        this.selectedTaxYearStateStatus = status;
      }
    },
  },
};
</script>

<style scoped>
</style>
