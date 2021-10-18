<template>
  <Table>
    <template #header>
      <TableHeader>
        <div class="table-header xs" />
        <div class="table-header xs">
          Year
        </div>
        <div class="table-header xl">
          Note
        </div>
        <div class="table-header sm">
          Date
        </div>
        <div class="table-header xs">
          Alarm
        </div>
        <div class="table-header xs" />
        <div class="table-header xs" />
        <div class="table-header xs">
          Time
        </div>
        <div class="table-header xs">
          Employee
        </div>
        <div class="table-header xs" />
        <div class="table-header xs" />
      </TableHeader>
    </template>
    <template #body>
      <TableRow
        v-for="(log, idx) in displayedLogs"
        :key="log.id"
        :idx="idx"
      >
        <div class="table-col xs" />
        <div class="table-col xs" />
        <div class="table-col xl">
          {{ log.note }}
        </div>
        <div class="table-col sm">
          {{ log.logDate }}
        </div>
        <div class="table-col xs">
          {{ log.alarm }}
        </div>
        <div class="table-col xs">
          {{ log.alarmCompleted }}
        </div>
        <div class="table-col xs">
          {{ log.alarmTime }}
        </div>
        <div class="table-col xs" />
        <div class="table-col xs" />
        <div class="table-col xs" />
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
    ...mapState([models.selectedClient]),
    displayedLogs () {
      if (!this.showArchived) {
        return this.notArchived
      } else {
        return this.archived
      }
    },
    notArchived () {
      if (this.selectedClient.logs) {
        return this.selectedClient.logs
          .filter(log => !log.archived)
      } else {
        return null
      }
    },
    archived () {
      if (this.selectedClient.logs) {
        return this.selectedClient.logs
          .filter(log => log.archived)
      } else {
        return null
      }
    }
  }
}
</script>

<style scoped>

</style>
