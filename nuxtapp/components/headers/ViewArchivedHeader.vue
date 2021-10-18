<template>
  <div class="flex bg-blue-200 items-center p-1 rounded-t-sm">
    <input id="archived-clients" type="checkbox" class="mr-1 cursor-pointer" @change="emitChange">
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
