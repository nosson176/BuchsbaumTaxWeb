<template>
  <ValuesTableGrid>
    <div class="flex-col">
      <span class="font-bold text-xl text-gray-500">Category</span>
      <SharedCategoriesTable />
    </div>
    <div class="flex-col">
      <span class="font-bold text-xl text-gray-500">Year Name</span>
      <SharedYearNamesTable />
    </div>
    <div class="flex-col">
      <span class="font-bold text-xl text-gray-500">State</span>
      <SharedStatesTable />
    </div>
  </ValuesTableGrid>
</template>

<script>
export default {
  name: 'SharedValueTables',
}
</script>

<style scoped></style>
