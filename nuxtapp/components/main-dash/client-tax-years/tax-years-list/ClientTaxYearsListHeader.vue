<template>
  <div class="header">
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
