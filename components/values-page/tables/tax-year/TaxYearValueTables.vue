<template>
  <ValuesTableGrid>
    <TaxYearStatusTable @click="setSelectedTaxYearStatus" />
    <TaxYearStatusDetailsTable :status="selectedTaxYearStatus" />
    <TaxYearTaxFormsTable />
    <TaxYearFileTypesTable />
    <TaxYearFbarStatusTable @click="setSelectedTaxYearFbarStatus" />
    <TaxYearFbarStatusDetailsTable :status="selectedTaxYearFbarStatus" />
    <TaxYearFbarFilingsTable />
  </ValuesTableGrid>
</template>

<script>
export default {
  name: 'TaxYearValueTables',
  data () {
    return {
      selectedTaxYearStatus: null,
      selectedTaxYearFbarStatus: null,
    }
  },
  methods: {
    setSelectedTaxYearStatus (status) {
      this.selectedTaxYearStatus = status;
    },
    setSelectedTaxYearFbarStatus (status) {
      this.selectedTaxYearFbarStatus = status;
    },
  },
};
</script>

<style scoped>
</style>
