<template>
  <ValuesTableGrid>
    <div class="flex-col">
      <span class="font-bold text-xl text-gray-500">Type</span>
      <FeeTypesTable />
    </div>
    <div class="flex-col">
      <span class="font-bold text-xl text-gray-500">Status</span>
      <FeeStatusTable @click="setSelectedStatus" />
    </div>
    <div class="flex-col">
      <span class="font-bold text-xl text-gray-500">Status Detail</span>
      <FeeStatusDetailsTable :status="selectedStatus" />
    </div>
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
