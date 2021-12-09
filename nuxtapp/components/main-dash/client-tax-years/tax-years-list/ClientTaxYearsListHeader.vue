<template>
  <div class="flex bg-blue-200 px-1 justify-between items-center z-10 shadow">
    <AddRowButton @click="onAddRowClick" />
    <ViewArchivedHeader @change="emitChange" />
  </div>
</template>

<script>
import { events } from '~/shared/constants'

export default {
  name: 'ClientTaxYearsListHeader',
  methods: {
    emitChange () {
      this.$emit(events.change)
    },
    onAddRowClick () {

    }
  }
}
</script>

<style scoped>
</style>
