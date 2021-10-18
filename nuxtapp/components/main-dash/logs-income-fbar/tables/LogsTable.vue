<template>
  <Table>
    <template #header>
      <TableHeader>
        <div class="table-header xs" />
        <div class="table-header xs">
          Year
        </div>
        <div class="table-header xxl">
          Note
        </div>
        <div class="table-header xs">
          Date
        </div>
        <div class="table-header xs">
          Alarm
        </div>
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
        <div class="table-col xs">
          {{ log.priority }}
        </div>
        <div class="table-col xs">
          {{ log.years }}
        </div>
        <div class="table-col xxl">
          {{ log.note }}
        </div>
        <div class="table-col xs">
          {{ formatDate(log.logDate) }}
        </div>
        <div class="table-col xs">
          {{ formatDate(log.alarmDate) }}
        </div>
        <div class="table-col xs">
          <CheckIcon v-if="log.alarmComplete" class=" text-green-500" />
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
import { formatDateForTable } from '~/shared/domain-utilities'

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
          .reverse()
      } else {
        return null
      }
    },
    archived () {
      if (this.selectedClient.logs) {
        return this.selectedClient.logs
          .filter(log => log.archived)
          .reverse()
      } else {
        return null
      }
    }
  },
  methods: {
    formatDate (date) {
      return date ? formatDateForTable(date) : ''
    }
  }
}
</script>

<style scoped>

</style>
