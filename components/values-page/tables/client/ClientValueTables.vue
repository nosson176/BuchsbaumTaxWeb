<template>
  <ValuesTableGrid>
    <div class="flex-col">
      <span class="font-bold text-xl text-gray-500">Status</span>
      <ClientStatusTable />
    </div>
    <div class="flex-col">
      <span class="font-bold text-xl text-gray-500">Owes Status</span>
      <ClientOwesStatusTable />
    </div>
    <div class="flex-col">
      <span class="font-bold text-xl text-gray-500">Periodical</span>
      <ClientPeriodicalTable />
    </div>
  </ValuesTableGrid>
</template>

<script>
export default {
  name: 'ClientValueTables',
}
</script>

<style scoped></style>
