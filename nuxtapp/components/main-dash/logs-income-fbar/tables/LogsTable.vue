<template>
  <Table @keydown.tab.prevent="onKeyDown">
    <template #header>
      <TableHeader>
        <div class="xs table-header">
          <AddRowButton @click="onAddRowClick" />
        </div>
        <div class="table-header xs">
          Year
        </div>
        <div class="table-header xxl">
          Note
        </div>
        <div class="table-header sm">
          Date
        </div>
        <div class="table-header sm">
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
        <div :id="`${idx}-years`" class="table-col xs" @click="toggleEditable(`${idx}-years`, log.id)">
          <EditableSelectCell v-model="log.years" :is-editable="isEditable(`${idx}-years`)" :options="yearOptions" @input="debounceUpdate" @blur="onBlur" />
        </div>
        <div :id="`${idx}-note`" class="table-col xxl" @click="toggleEditable(`${idx}-note`, log.id)">
          <EditableTextAreaCell v-model="log.note" :is-editable="isEditable(`${idx}-note`)" @input="debounceUpdate" @blur="onBlur" />
        </div>
        <div :id="`${idx}-logDate`" class="table-col sm" @click="toggleEditable(`${idx}-logDate`, log.id)">
          <EditableDateCell v-model="log.logDate" :is-editable="isEditable(`${idx}-logDate`)" @input="debounceUpdate" @blur="onBlur" />
        </div>
        <div :id="`${idx}-alarmDate`" class="table-col sm" @click="toggleEditable(`${idx}-alarmDate`, log.id)">
          <EditableDateCell v-model="log.alarmDate" type="date" :is-editable="isEditable(`${idx}-alarmDate`)" @input="debounceUpdate" @blur="onBlur" />
        </div>
        <div :id="`${idx}-alarmComplete`" class="table-col xs">
          <CheckIcon v-if="log.alarmComplete" tabindex="0" class="text-green-500" />
        </div>
        <div :id="`${idx}-alarmTime`" class="table-col xs" @click="toggleEditable(`${idx}-alarmTime`, log.id)">
          <EditableDateCell v-model="log.alarmTime" type="time" :is-editable="isEditable(`${idx}-alarmTime`)" @input="debounceUpdate" @blur="onBlur" />
        </div>
        <div :id="`${idx}-alarmUserName`" class="table-col sm" @click="toggleEditable(`${idx}-alarmUserName`, log.id)">
          <EditableSelectCell v-model="log.alarmUserName" :is-editable="isEditable(`${idx}-alarmUserName`)" :options="userOptions" @input="debounceUpdate" @blur="onBlur" />
        </div>
        <div class="table-col xs" />
        <div :id="`${idx}-delete`" class="table-col xs">
          <DeleteButton @click="onDeleteClick(log.id)" />
        </div>
      </TableRow>
    </template>
  </Table>
</template>

<script>
import { mapState } from 'vuex'
import { debounce } from 'lodash'
import { models, mutations, priority, tableGroups, tabs } from '~/shared/constants'
import { searchArrOfObjs } from '~/shared/utility'

const columns = [
  'priority', 'years', 'note', 'logDate', 'alarmDate', 'alarmComplete', 'alarmTime', 'alarmUserName', 'delete'
]
const logsConstructor = {
  clientId: NaN,
  years: '',
  alarmUserId: null,
  alert: false,
  alarmComplete: false,
  alarmDate: null,
  alarmTime: null,
  logDate: null,
  priority: 0,
  note: '',
  secondsSpent: 0,
  archived: false,
  alerted: false
}

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
    ...mapState([models.selectedClient, models.valueTypes, models.users, models.search]),
    displayedLogs () {
      const logs = this.filteredLogs
      return searchArrOfObjs(logs, this.searchInput)
    },
    filteredLogs () {
      if (this.logs) {
        return this.logs
          .filter(log => this.showArchived === log.archived)
          .reverse()
      } else {
        return null
      }
    },
    debounceUpdate () {
      return debounce(this.handleUpdate, 500)
    },
    yearOptions () {
      return this.valueTypes.year_name.filter(year => year.show)
    },
    headers () {
      return this.$api.getHttpConfig()
    },
    clientId () {
      return this.selectedClient.id
    },
    logs () {
      if (this.selectedClient.logs) {
        return JSON.parse(JSON.stringify(this.selectedClient.logs))
      } else {
        return null
      }
    },
    userOptions () {
      return Object.values(this.users).map((user) => {
        return { value: user.username }
      })
    },
    searchInput () {
      return this.search?.[tableGroups.logsIncomeFbar]
    }
  },
  methods: {
    priorityColor (p) {
      return p ? priority[p] : ''
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
    handleUpdate () {
      const log = this.displayedLogs.find(log => log.id === this.editableLogId)
      this.$api.updateLog(this.headers, { clientId: this.clientId, logId: this.editableLogId }, log)
    },
    onDeleteClick (logId) {
      if (this.showArchived) {
        const log = this.displayedLogs.find(log => log.id === logId)
        log.archived = false
        this.$api.updateLog(this.headers, { clientId: this.clientId, logId }, log)
          .then(() => {
            this.updateClient(logId, log)
          })
      } else {
        this.$store.commit(
          mutations.setModelResponse,
          { model: models.modals, data: { delete: { showing: true, data: { id: logId, type: tabs.logs } } } }
        )
      }
    },
    updateClient (logId, log) {
      const logIndex = this.logs.findIndex(log => log.id === logId)
      this.logs[logIndex] = log
      this.updateStoreObject()
    },
    onAddRowClick () {
      const headers = this.$api.getHttpConfig()
      const clientId = this.selectedClient.id
      const today = new Date()
      const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
      const defaultValues = {
        clientId,
        years: this.yearOptions[0].value,
        logDate: date
      }
      const log = Object.assign({}, logsConstructor, defaultValues)
      this.$api.createLog(headers, { clientId, log })
        .then((data) => {
          this.addRowOnClient(data)
        })
    },
    addRowOnClient (log) {
      this.logs.push(log)
      this.updateStoreObject()
      this.$nextTick(() => {
        this.toggleEditable('0-years', log.id)
      })
    },
    updateStoreObject () {
      const data = Object.assign({}, this.selectedClient, { logs: this.logs })
      this.$store.commit(mutations.setModelResponse, { model: models.selectedClient, data })
    },
    onKeyDown () {
      const currentCell = this.editableId
      const idArr = currentCell.split('-')
      const columnIndex = columns.findIndex(col => col === idArr[1])
      if (columnIndex < columns.length - 1) {
        const nextCell = `${idArr[0]}-${columns[columnIndex + 1]}`
        this.toggleEditable(nextCell, this.editableLogId)
      }
    },
    onBlur () {
      this.editableId = ''
    }
  }
}
</script>

<style scoped>

</style>
