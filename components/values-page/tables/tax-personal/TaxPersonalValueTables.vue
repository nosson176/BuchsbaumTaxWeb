<template>
  <ValuesTableGrid>
    <div class="flex-col">
      <span class="font-bold text-xl text-gray-500">Relation</span>
      <TaxPersonalRelationsTable />
    </div>
    <div class="flex-col">
      <span class="font-bold text-xl text-gray-500">Language</span>
      <TaxPersonalLanguagesTable />
    </div>
  </ValuesTableGrid>
</template>

<script>
export default {
  name: 'TaxPersonalValueTables',
}
</script>

<style scoped></style>
