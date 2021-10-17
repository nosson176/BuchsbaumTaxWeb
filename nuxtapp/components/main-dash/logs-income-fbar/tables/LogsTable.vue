<template>
  <Table>
    <template #header>
      <TableHeader>
        <div class="table-header" />
        <div class="table-header">
          Year
        </div>
        <div class="table-header">
          Note
        </div>
        <div class="table-header">
          Date
        </div>
        <div class="table-header">
          Alarm
        </div>
        <div class="table-header" />
        <div class="table-header">
          Time
        </div>
        <div class="table-header">
          Employee
        </div>
        <div class="table-header" />
        <div class="table-header" />
      </TableHeader>
    </template>
    <template #body>
      <TableRow
        v-for="(log, idx) in selectedClient.logs"
        :key="log.id"
        :idx="idx"
      >
        <div class="table-col" />
        <div class="table-col" />
        <div class="table-col">
          {{ log.note }}
        </div>
        <div class="table-col">
          {{ log.logDate }}
        </div>
        <div class="table-col">
          {{ log.alarm }}
        </div>
        <div class="table-col">
          {{ log.timeSpent }}
        </div>
      </TableRow>
    </template>
  </Table>
</template>

<script>
import { mapState } from 'vuex'
import { models } from '~/shared/constants'

export default {
  name: 'LogsTable',
  props: {
    showArchived: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState([models.selectedClient])
  }
}
</script>

<style scoped>

</style>
