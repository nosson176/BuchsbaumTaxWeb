<template>
  <ValuesTableGrid>
    <FeeTypesTable />
    <FeeStatusTable @click="setSelectedStatus" />
    <FeeStatusDetailsTable :status="selectedStatus" />
  </ValuesTableGrid>
</template>

<script>
export default {
  name: 'FeeValueTables',
  data () {
    return {
      selectedStatus: null,
    }
  },
  methods: {
    setSelectedStatus (status) {
      this.selectedStatus = status;
    },
  },
};
</script>

<style scoped>
</style>
