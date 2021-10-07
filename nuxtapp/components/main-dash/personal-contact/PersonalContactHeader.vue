<template>
  <ViewArchivedHeader @change="emitChange" />
</template>

<script>
import { events } from '~/shared/constants'
export default {
  name: 'PersonalContactHeader',
  methods: {
    emitChange () {
      this.$emit(events.change)
    }
  }
}
</script>

<style scoped>

</style>
