<template>
  <div class="flex w-full bg-blue-200 px-3 items-center">
    <input id="archived" type="checkbox" class="mr-1" @change="emitChange">
    <label for="archived" class="text-sm">View Archived</label>
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

</style>
