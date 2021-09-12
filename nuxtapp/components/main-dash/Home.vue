<template>
  <div class="flex flex-col min-h-screen">
    <div class="bg-black text-white w-full">
      HEADER
    </div>
    <div class="flex flex-col flex-grow">
      <div class="flex h-full">
        <div class="border border-red-500 bg-red-100 small-column">
          client list
        </div>
        <div class="border border-blue-500 bg-blue-100 flex-grow">
          client/tax years
        </div>
        <div class="border border-green-500 bg-green-100 small-column">
          fees/checklists
        </div>
      </div>
      <div class="flex">
        <div class="border border-yellow-500 bg-yellow-100 small-column">
          smartviews
        </div>
        <div class="border border-gray-500 bg-gray-100 flex-grow">
          logs/income/fbar
        </div>
        <div class="border border-purple-500 bg-purple-100 small-column">
          personal/contact
        </div>
      </div>
    </div>
    <div class="bg-black text-white">
      FOOTER
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  created () {
    this.$api.getClientList().then(data => console.log(data))
  }
}
</script>

<style scoped>
.small-column {
  @apply w-112 md:w-80;
}
</style>
