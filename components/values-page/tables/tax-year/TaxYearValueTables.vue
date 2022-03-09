<template>
  <ValuesTableGrid>
    <TaxYearStatusTable @click="setSelectedTaxYearStatus" />
    <TaxYearStatusDetailsTable :status="selectedTaxYearStatus" />
  </ValuesTableGrid>
</template>

<script>
export default {
  name: 'TaxYearValueTables',
  data () {
    return {
      selectedTaxYearStatus: null,
    }
  },
  methods: {
    setSelectedTaxYearStatus (status) {
      this.selectedTaxYearStatus = status;
    },
  },
};
</script>

<style scoped>
</style>
