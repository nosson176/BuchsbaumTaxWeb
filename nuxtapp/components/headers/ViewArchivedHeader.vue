<template>
  <div class="flex bg-blue-200 items-center p-1 rounded-t-sm">
    <input id="archived-clients" type="checkbox" class="mr-1 cursor-pointer focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" @change="emitChange">
    <label for="archived-clients" class="text-sm">View Archived</label>
  </div>
</template>

<script>
import { events } from '~/shared/constants'
export default {
  name: 'ViewArchivedHeader',
  methods: {
    emitChange () {
      this.$emit(events.change)
    }
  }
}
</script>

<style scoped>

</style>
