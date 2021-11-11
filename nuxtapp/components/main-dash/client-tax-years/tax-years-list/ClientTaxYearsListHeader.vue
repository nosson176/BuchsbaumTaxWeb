<template>
  <div class="header">
    <input id="archived-tax-years" type="checkbox" class="mr-1 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" @change="emitChange">
    <label for="archived-tax-years" class="text-sm">View Archived</label>
  </div>
</template>

<script>
import { events } from '~/shared/constants'

export default {
  name: 'ClientTaxYearsListHeader',
  methods: {
    emitChange () {
      this.$emit(events.change)
    }
  }
}
</script>

<style scoped>
.header {
  @apply flex w-full bg-blue-200 px-3 items-center;

  min-height: 2rem;
}
</style>
