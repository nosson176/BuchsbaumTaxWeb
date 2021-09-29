<template>
  <div class="flex bg-blue-200 p-1">
    <input id="archived" type="checkbox" class="mr-1" @change="emitChange">
    <label for="archived" class="text-sm">View Archived</label>
  </div>
</template>

<script>
import { events } from '~/shared/constants'
export default {
  name: 'ClientListHeader',
  methods: {
    emitChange () {
      this.$emit(events.change, this.showArchived)
    }
  }
}
</script>

<style scoped>

</style>
