<template>
  <ValuesTableGrid>
    <div class="flex-col">
      <span class="font-bold text-xl text-gray-500">Job</span>
      <IncFbarJobsTable />
    </div>
    <div class="flex-col">
      <span class="font-bold text-xl text-gray-500">Part</span>
      <IncFbarPartsTable />
    </div>
    <div class="flex-col">
      <span class="font-bold text-xl text-gray-500">Currency</span>
      <IncFbarCurrenciesTable />
    </div>
  </ValuesTableGrid>
</template>

<script>
export default {
  name: "IncFbarValueTables",
};
</script>

<style scoped>
</style>
