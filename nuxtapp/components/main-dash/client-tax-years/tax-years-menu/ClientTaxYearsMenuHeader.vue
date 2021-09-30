<template>
  <div class="header">
    <input id="archived-tax-years" type="checkbox" class="mr-1" @change="emitChange">
    <label for="archived-tax-years" class="text-sm">View Archived</label>
  </div>
</template>

<script>
import { events } from '~/shared/constants'

export default {
  name: 'ClientTaxYearsMenuHeader',
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
