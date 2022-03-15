<template>
  <hot-table ref="table" :settings="hotSettings"></hot-table>
</template>

<script>
import { mapState } from 'vuex'
import { debounce } from 'lodash'
import { isToday, isPast, parseISO } from 'date-fns'
import { HotTable } from '@handsontable/vue';
import { registerAllModules } from 'handsontable/registry';
import { models, mutations, tableGroups, tabs } from '~/shared/constants'
import { searchArrOfObjs } from '~/shared/utility'

// register Handsontable's modules
registerAllModules();

const columns = [
  'priority', 'years', 'note', 'logDate', 'alarmDate', 'alarmTime', 'alarmUserName', 'delete'
]

const alarmStatusValues = ['', true, false]

export default {
  name: 'LogsTable',
  components: {
    HotTable,
  },
  props: {
    showArchived: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      hotSettings: {
        data: [[
          '', '', '', '', '', '', '', ''
        ]
        ],
        colHeaders: ['Priority', 'Years', 'Note', 'Log Date', 'Alarm Date', 'Alarm Time', 'Alarm User', ''],
        rowHeaders: true,
        licenseKey: "non-commercial-and-evaluation",
        width: '100%',
        height: '100%',
        colWidths: [50, 60, 600, 60, 60, 60, 60, 50],
      }
    }
  },
  computed: {
    ...mapState([models.selectedClient, models.valueTypes, models.users, models.search, models.cmdPressed]),
    displayedLogs () {
      const logs = this.shownLogs
        .filter(log => this.filterLogs(log))
      const newLogIdx = logs?.findIndex(contact => contact.id === this.newLogId)
      if (newLogIdx > -1) {
        const tempLog = logs[newLogIdx]
        logs.splice(newLogIdx, 1)
        logs.unshift(tempLog)
      }
      return searchArrOfObjs(logs, this.searchInput).map(log => {
        log.alarmDate = log.alarmDate ? parseISO(log.alarmDate) : null
        log.logDate = log.logDate ? parseISO(log.logDate) : null
        return log
      })
    },
    shownLogs () {
      if (this.logs) {
        return this.logs
          .filter(log => this.showArchived === log.archived)
      } else {
        return null
      }
    },
    mappedLogs () {
      return this.shownLogs?.map(log => {
        return [
          log.priority,
          log.years,
          log.note || '',
          log.logDate || '',
          log.alarmDate || '',
          log.alarmTime || '',
          log.alarmUserName || '',
          log.id,
        ]
      })
    },
    debounceUpdate () {
      return debounce(this.handleUpdate, 500)
    },
    yearOptions () {
      return this.valueTypes.year_name.filter(year => year.show).map(year => year.value)
    },
    headers () {
      return this.$api.getHeaders()
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
    },
    isClientSelected () {
      return !Array.isArray(this.selectedClient) || this.selectedClient.length > 0
    },
    filteredYearOptions () {
      const options = this.yearOptions
        .filter(yearName => this.shownLogs?.find(log => log.years === yearName.value))
      return options
    },
    filteredUserOptions () {
      const options = this.userOptions
        .filter(user => this.shownLogs?.find(log => log.alarmUserName === user.value))
      return options
    },
    filterByYear () {
      return !(this.yearFilterValue === '')
    },
    filterByEmployee () {
      return !(this.employeeFilterValue === '')
    },
    isCmdPressed () {
      return this.cmdPressed && !Array.isArray(this.cmdPressed)
    },
    selectedLogIds () {
      return Object.keys(this.selectedItems).filter(id => this.selectedItems[id])
    },
    isCopyingLogs () {
      return this.isCmdPressed && this.selectedLogIds.length > 0
    },
    filterByAlarmStatus () {
      return !(this.filterByAlarmStatusValue === '')
    }
  },
  watch: {
    selectedClient (newClient) {
      Object.assign(this.$data, this.$options.data.apply(this))
      if (newClient) {
        this.selectedItems = {}
        this.logs.forEach((log) => {
          this.selectedItems = Object.assign(this.selectedItems, { [log.id]: false })
        })
      }
    }
  },
  updated () {
    this.$refs.table.hotInstance.updateSettings({
      data: this.mappedLogs,
      columns: [
        {},
        {
          type: 'dropdown',
          source: this.yearOptions,
        },
        {},
        {},
        {},
        {},
        {},
        {},
      ],
    });
  },
  mounted () {
    this.$refs.table.hotInstance.updateSettings({
      data: this.mappedLogs,
      columns: [
        {},
        {
          type: 'dropdown',
          source: this.yearOptions,
        },
        {},
        {},
        {},
        {},
        {},
        {},
      ],
    });
  },
  methods: {
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
      } else {
        this.$store.commit(
          mutations.setModelResponse,
          { model: models.modals, data: { delete: { showing: true, data: { id: logId, type: tabs.logs } } } }
        )
      }
    },
    onAddRowClick () {
      if (!this.selectedClient) {
        return
      }
      const defaultValues = {
        clientId: this.selectedClient.id
      }
      if (this.isCopyingLogs) {
        this.selectedLogIds.forEach(async (logId, idx) => {
          const log = this.displayedLogs.find(log => log.id === Number(logId))
          const newLog = Object.assign({}, log)
          await this.$api.createLog(this.headers, { log: newLog })
            .then(async (data) => {
              if (this.selectedLogIds.length === idx + 1) {
                await this.$api.getClientData(this.headers, this.selectedClient.id)
                this.newLogId = data.id
                this.toggleEditable(`0-${columns[0]}`, data.id)
              }
            })
        })
      } else {
        const log = Object.assign({}, defaultValues)
        this.$api.createLog(this.headers, { log })
          .then(async (data) => {
            await this.$api.getClientData(this.headers, this.selectedClient.id)
            this.newLogId = data.id
            this.toggleEditable(`0-${columns[0]}`, data.id)
          })
      }
    },
    onBlur () {
      this.editableId = ''
    },
    isTodayOrPast (date) {
      const parsedDate = parseISO(date)
      return isToday(parsedDate) || isPast(parsedDate)
    },
    toggleComplete (log) {
      if (!this.isTodayOrPast(log.alarmDate) && !log.alarmComplete) {
        return
      } else if (log.alarmComplete) {
        log.alarmComplete = false
      } else if (this.isTodayOrPast(log.alarmDate) && !log.alarmComplete) {
        log.alarmComplete = true
      }
      this.editableLogId = log.id
      this.debounceUpdate()
    },
    filterLogs (log) {
      const hasAlarm = log.alarmDate
      let returnValue = true
      returnValue = this.filterByYear ? log.years === this.yearFilterValue && returnValue : returnValue
      returnValue = this.filterByEmployee ? log.alarmUserName === this.employeeFilterValue && returnValue : returnValue
      returnValue = this.filterByAlarmStatus ? log.alarmComplete === this.filterByAlarmStatusValue && hasAlarm && returnValue : returnValue
      return returnValue
    },
    toggleSelected (log) {
      this.selectedItems[log.id] = !this.selectedItems[log.id]
      this.selectedItems = Object.assign({}, this.selectedItems)
    },
    isSelected (logId) {
      return this.selectedItems[logId]
    },
    onTabPress () {
      const currentCell = this.editableId
      const idArr = currentCell.split('-')
      const columnIndex = columns.findIndex(col => col === idArr[1])
      if (columnIndex < columns.length - 1) {
        const nextCell = `${idArr[0]}-${columns[columnIndex + 1]}`
        this.toggleEditable(nextCell, this.editableLogId)
      } else if (columnIndex === columns.length - 1) {
        const row = Number(idArr[0]) + 1
        const nextCell = `${row}-${columns[0]}`
        this.toggleEditable(nextCell, this.editableLogId)
      }
    },
    setAlarmFilter () {
      this.filterByAlarmStatusIndex = (this.filterByAlarmStatusIndex + 1) % 3
      this.filterByAlarmStatusValue = alarmStatusValues[this.filterByAlarmStatusIndex]
    },
    splitYears (years) {
      return years?.split('\u000B')
    }
  }
}
</script>

<style scoped>
.alarm {
  @apply bg-indigo-100;
}

.selected {
  @apply bg-indigo-200;
}
</style>
