<template>
  <Table v-if="isClientSelected" @keydown.tab.prevent="onKeyDown">
    <template #header>
      <TableHeader>
        <div class="xs table-header" />
        <div class="xs table-header">
          <AddRowButton @click="onAddRowClick" />
        </div>
        <div class="table-header sm flex flex-col">
          <div class="flex items-center space-x-1">
            <span>Year</span> <DeleteButton @click="yearFilterValue = ''" />
          </div>
          <HeaderSelectOption v-model="yearFilterValue" :options="filteredYearOptions" />
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
        <div class="table-header sm flex flex-col">
          <div class="flex items-center space-x-0.5">
            <span>Emp</span> <DeleteButton @click="employeeFilterValue = ''" />
          </div>
          <HeaderSelectOption v-model="employeeFilterValue" :options="filteredUserOptions" />
        </div>
        <div class="table-header xs" />
      </TableHeader>
    </template>
    <template #body>
      <TableRow
        v-for="(log, idx) in displayedLogs"
        :key="log.id"
        :idx="idx"
        :class="{'alarm': isTodayOrPast(log.alarmDate) && !log.alarmComplete}"
      >
        <div class="xs table-col">
          <ToggleButton v-model="selectedItems[log.id]" @click="toggleSelected($event, log)" />
        </div>
        <div :id="`${idx}-priority`" class="table-col xs" @click="toggleEditable(`${idx}-priority`, log.id)">
          <EditablePrioritySelectCell v-model="log.priority" :is-editable="isEditable(`${idx}-priority`)" @input="debounceUpdate" @blur="onBlur" />
        </div>
        <div :id="`${idx}-years`" class="table-col sm" @click="toggleEditable(`${idx}-years`, log.id)">
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
        <div :id="`${idx}-alarmComplete`" class="table-col xs" @click="toggleComplete(log)">
          <CheckIcon
            v-if="log.alarmComplete || isTodayOrPast(log.alarmDate)"
            tabindex="0"
            class="cursor-pointer"
            :class="isTodayOrPast(log.alarmDate) && !log.alarmComplete ? 'text-gray-400' : 'text-green-500'"
          />
        </div>
        <div :id="`${idx}-alarmTime`" class="table-col xs" @click="toggleEditable(`${idx}-alarmTime`, log.id)">
          <EditableDateCell v-model="log.alarmTime" type="time" :is-editable="isEditable(`${idx}-alarmTime`)" @input="debounceUpdate" @blur="onBlur" />
        </div>
        <div :id="`${idx}-alarmUserName`" class="table-col sm" @click="toggleEditable(`${idx}-alarmUserName`, log.id)">
          <EditableSelectCell v-model="log.alarmUserName" :is-editable="isEditable(`${idx}-alarmUserName`)" :options="userOptions" @input="debounceUpdate" @blur="onBlur" />
        </div>
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
import { isToday, isPast, parseISO } from 'date-fns'
import { models, mutations, tableGroups, tabs } from '~/shared/constants'
import { searchArrOfObjs } from '~/shared/utility'

const columns = [
  'priority', 'years', 'note', 'logDate', 'alarmDate', 'alarmComplete', 'alarmTime', 'alarmUserName', 'delete'
]

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
      newLogId: NaN,
      editableId: '',
      editableLogId: '',
      yearFilterValue: '',
      employeeFilterValue: '',
      selectedItems: {}
    }
  },
  computed: {
    ...mapState([models.selectedClient, models.valueTypes, models.users, models.search]),
    displayedLogs () {
      const logs = this.shownLogs
        .filter(log => this.filterLogs(log))
      const newLogIdx = logs?.findIndex(contact => contact.id === this.newLogId)
      if (newLogIdx > -1) {
        const tempLog = logs[newLogIdx]
        logs.splice(newLogIdx, 1)
        logs.unshift(tempLog)
      }
      return searchArrOfObjs(logs, this.searchInput)
    },
    shownLogs () {
      if (this.logs) {
        return this.logs
          .filter(log => this.showArchived === log.archived)
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
    }
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
        .then(() => this.$api.getClientData(this.headers, this.selectedClient.id))
    },
    onDeleteClick (logId) {
      if (this.showArchived) {
        const log = this.displayedLogs.find(log => log.id === logId)
        log.archived = false
        this.$api.updateLog(this.headers, { clientId: this.clientId, logId }, log)
          .then(() => this.$api.getClientData(this.headers, this.selectedClient.id))
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
      const headers = this.$api.getHeaders()
      const clientId = this.selectedClient.id
      const defaultValues = {
        clientId
      }
      const log = Object.assign({}, defaultValues)
      this.$api.createLog(headers, { clientId, log })
        .then(async (data) => {
          await this.$api.getClientData(this.headers, this.selectedClient.id)
          this.newLogId = data.id
          this.toggleEditable(`0-${columns[0]}`, data.id)
        })
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
      let returnValue = true
      returnValue = this.filterByYear ? log.years === this.yearFilterValue && returnValue : returnValue
      returnValue = this.filterByEmployee ? log.alarmUserName === this.employeeFilterValue && returnValue : returnValue
      return returnValue
    },
    toggleSelected (newVal, log) {
      console.log(newVal, log)
      this.selectedItems = Object.assign(this.selectedItems, { [log.id]: newVal })
      console.log(this.selectedItems)
    }
  }
}
</script>

<style scoped>
.alarm {
  @apply bg-indigo-100;
}
</style>
