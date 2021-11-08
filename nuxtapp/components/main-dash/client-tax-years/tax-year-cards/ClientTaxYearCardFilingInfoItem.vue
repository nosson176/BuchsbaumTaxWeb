<template>
  <div class="sm:col-span-1">
    <dt class="text-sm font-medium text-gray-500 flex">
      <slot name="label" />
    </dt>
    <dd class="mt-1 text-sm text-gray-900">
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
