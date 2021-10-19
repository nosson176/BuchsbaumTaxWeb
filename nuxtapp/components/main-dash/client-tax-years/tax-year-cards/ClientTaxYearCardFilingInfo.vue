<template>
  <div class="p-0">
    <dl class="divide-y divide-gray-200">
      <div class="py-5 grid grid-cols-3 px-1">
        <dt class="text-sm font-medium text-gray-500">
          Type
        </dt>
        <dd class="text-sm text-gray-900 mt-0 col-span-2">
          Stuff
        </dd>
      </div>
    </dl>
    {{ filing }}
  </div>
</template>

<script>
export default {
  name: 'ClientTaxYearCardFilingInfo',
  props: {
    filing: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>

</style>
