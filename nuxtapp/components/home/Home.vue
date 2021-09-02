<template>
  <div class="grid min-h-screen grid-cols-12 grid-rows-9 gap-4">
    <div class="col-span-2 row-span-6 border border-red-500 bg-red-100">
      client list
    </div>
    <div class="col-span-8 row-span-4 border border-blue-500 bg-blue-100">
      client/tax years
    </div>
    <div class="col-span-2 row-span-4 border border-green-500 bg-green-100">
      logs/income/fbar
    </div>
    <div class="col-span-2 row-span-3 row-start-7 border border-yellow-500 bg-yellow-100">
      smartviews
    </div>
    <div class="col-span-5 row-span-5 row-start-5 border border-gray-500 bg-gray-100">
      fees/checklists
    </div>
    <div class="col-span-5 row-span-5 row-start-5 border border-purple-500 bg-purple-100">
      personal/contact
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
</style>
