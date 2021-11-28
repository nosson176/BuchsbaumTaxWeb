<template>
  <ViewArchivedHeader class="z-10 shadow" @change="emitChange" />
</template>

<script>
import { events } from '~/shared/constants'
export default {
  name: 'ClientListHeader',
  methods: {
    emitChange () {
      this.$emit(events.change)
    }
  }
}
</script>

<style scoped>

</style>
