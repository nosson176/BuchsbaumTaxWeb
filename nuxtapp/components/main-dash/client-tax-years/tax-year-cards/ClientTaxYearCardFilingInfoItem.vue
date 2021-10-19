<template>
  <div class="py-1 grid grid-cols-3 px-1">
    <dt class="text-sm font-medium text-gray-500 flex">
      <slot name="label" />
    </dt>
    <dd class="text-sm text-gray-900 mt-0 col-span-2 flex justify-end">
      <slot name="value" />
    </dd>
  </div>
</template>

<script>
export default {
  name: 'ClientTaxYearCardFilingInfoItem'
}
</script>

<style scoped>

</style>
