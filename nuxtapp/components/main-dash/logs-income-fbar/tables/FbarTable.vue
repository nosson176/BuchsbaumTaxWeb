<template>
  <Table>
    <template #header>
      <TableHeader>
        header
      </TableHeader>
    </template>
    <template #body>
      <TableRow
        v-for="(fbar, idx) in selectedClient.fbarBreakdowns"
        :key="fbar.id"
        :idx="idx"
      >
        {{ fbar }}
      </TableRow>
    </template>
  </Table>
</template>

<script>
import { mapState } from 'vuex'
import { models } from '~/shared/constants'

export default {
  name: 'FbarTable',
  computed: {
    ...mapState([models.selectedClient])
  }
}
</script>

<style scoped>

</style>
