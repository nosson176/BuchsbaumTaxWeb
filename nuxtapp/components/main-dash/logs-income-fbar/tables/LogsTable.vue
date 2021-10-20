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
        <div class="table-header sm">
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
        <div :id="`${idx}-priority`" class="table-col inline-flex justify-center items-center xs">
          <div class="h-3 w-3 rounded-full" :class="priorityColor(log.priority)" />
        </div>
        <div :id="`${idx}-years`" class="table-col xs">
          {{ splitMulti(log.years) }}
        </div>
        <div :id="`${idx}-note`" class="table-col xxl" @click="toggleEditable(`${idx}-note`, log.id)">
          <textarea v-if="isEditable(`${idx}-note`)" :value="log.note" class="w-full" @input="debounceUpdate" />
          <span v-else>{{ log.note }}</span>
        </div>
        <div :id="`${idx}-logDate`" class="table-col xs">
          {{ formatDate(log.logDate) }}
        </div>
        <div :id="`${idx}-alarmDate`" class="table-col xs">
          {{ formatDate(log.alarmDate) }}
        </div>
        <div :id="`${idx}-alarmComplete`" class="table-col xs">
          <CheckIcon v-if="log.alarmComplete" class=" text-green-500" />
        </div>
        <div :id="`${idx}-alarmTime`" class="table-col xs">
          {{ log.alarmTime }}
        </div>
        <div :id="`${idx}-alarmUserName`" class="table-col sm">
          {{ log.alarmUserName }}
        </div>
        <div class="table-col xs" />
        <div :id="`${idx}-delete`" class="table-col xs">
          <DeleteButton />
        </div>
      </TableRow>
    </template>
  </Table>
</template>

<script>
import { mapState } from 'vuex'
import { debounce } from 'lodash'
import { models, priority } from '~/shared/constants'
import { formatDateForTable } from '~/shared/domain-utilities'

export default {
  name: 'LogsTable',
  props: {
    showArchived: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      editableId: '',
      editableLogId: ''
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
    },
    debounceUpdate () {
      return debounce(this.handleSubmit, 500)
    }
  },
  methods: {
    formatDate (date) {
      return date ? formatDateForTable(date) : ''
    },
    priorityColor (p) {
      return p ? priority[p] : ''
    },
    splitMulti (years) {
      return years ? years.split('\u000B')[0] : ''
    },
    toggleEditable (id, logId) {
      this.editableLogId = logId
      if (!(this.editableId === id)) {
        this.editableId = id
      }
    },
    isEditable (id) {
      return this.editableId === id
    },
    handleSubmit () {
      console.log(this.editableId, this.editableLogId)
    }
  }
}
</script>

<style scoped>

</style>
