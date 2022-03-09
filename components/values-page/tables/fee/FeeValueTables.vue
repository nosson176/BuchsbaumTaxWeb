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
      if (this.selectedStatus?.id === status.id) {
        this.selectedStatus = null;
      } else {
        this.selectedStatus = status;
      }
    },
  },
};
</script>

<style scoped>
</style>
