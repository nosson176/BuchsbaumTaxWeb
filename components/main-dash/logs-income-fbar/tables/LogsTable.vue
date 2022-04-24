<template>
  <Table v-if="isClientSelected" @keydown.tab.prevent="onTabPress">
    <template #header>
      <TableHeader>
        <div class="table-header">
          <AddRowButton @click="onAddRowClick" />
        </div>
        <div class="xs table-header" />
        <div class="table-header sm flex flex-col">
          <div class="flex items-center space-x-0.5">
            <span>Year</span>
            <DeleteButton small @click="yearFilterValue = ''" />
          </div>
          <HeaderSelectOption v-model="yearFilterValue" :options="filteredYearOptions" />
        </div>
        <div class="table-header xxl">Note</div>
        <div class="table-header sm">Date</div>
        <div class="table-header sm">Alarm</div>
        <div class="table-header xs">
          <button
            type="button"
            class="w-4 h-4 border border-transparent rounded bg-indigo-200 shadow-sm hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            @click="setAlarmFilter"
          />
        </div>
        <div class="table-header xs">Time</div>
        <div class="table-header sm flex flex-col">
          <div class="flex items-center space-x-0.5">
            <span>Emp</span>
            <DeleteButton small @click="employeeFilterValue = ''" />
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
        :class="{ 'alarm': isTodayOrPast(log.alarmDate) && !log.alarmComplete, 'selected': isSelected(log.id) }"
      >
        <div class="table-col bg-gray-200 mr-1">
          <ClickCell @click="toggleSelected(log)">{{ idx + 1 }}</ClickCell>
        </div>
        <div
          :id="`${idx}-priority`"
          class="table-col xs"
          @click="toggleEditable(`${idx}-priority`, log.id)"
        >
          <EditablePrioritySelectCell
            v-model="log.priority"
            :is-editable="isEditable(`${idx}-priority`)"
            @input="debounceUpdate"
            @blur="onBlur"
          />
        </div>
        <div
          :id="`${idx}-years`"
          class="table-col sm"
          @click="toggleEditable(`${idx}-years`, log.id)"
        >
          <Tooltip :disabled="!isMult(log.years) || isEditable(`${idx}-years`)" trigger="hover">
            <EditableSelectCell
              v-model="log.years"
              :is-editable="isEditable(`${idx}-years`)"
              :options="yearOptions"
              @input="debounceUpdate"
              @blur="onBlur"
            />
            <template #popper>
              <ul>
                <li v-for="(year, index) in splitYears(log.years)" :key="index">
                  <span v-if="isMult(log.years) && index">{{ year }}</span>
                </li>
              </ul>
            </template>
          </Tooltip>
        </div>
        <div
          :id="`${idx}-note`"
          class="table-col xxl"
          @click="toggleEditable(`${idx}-note`, log.id)"
        >
          <EditableTextAreaCell
            v-model="log.note"
            :is-editable="isEditable(`${idx}-note`)"
            @input="debounceUpdate"
            @blur="onBlur"
          />
        </div>
        <div
          :id="`${idx}-logDate`"
          class="table-col sm"
          @click="toggleEditable(`${idx}-logDate`, log.id)"
        >
          <EditableDateCell
            v-model="log.logDate"
            :is-editable="isEditable(`${idx}-logDate`)"
            @input="debounceUpdate"
            @blur="onBlur"
          />
        </div>
        <div
          :id="`${idx}-alarmDate`"
          class="table-col sm"
          @click="toggleEditable(`${idx}-alarmDate`, log.id)"
        >
          <EditableDateCell
            v-model="log.alarmDate"
            type="date"
            :is-editable="isEditable(`${idx}-alarmDate`)"
            @input="debounceUpdate"
            @blur="onBlur"
          />
        </div>
        <div :id="`${idx}-alarmComplete`" class="table-col xs" @click="toggleComplete(log)">
          <CheckIcon
            v-if="log.alarmDate"
            class="h-5 w-5 cursor-pointer"
            :class="log.alarmComplete ? 'text-green-500' : 'text-gray-400'"
          />
        </div>
        <div
          :id="`${idx}-alarmTime`"
          class="table-col xs"
          @click="toggleEditable(`${idx}-alarmTime`, log.id)"
        >
          <EditableDateCell
            v-model="log.alarmTime"
            type="time"
            :is-editable="isEditable(`${idx}-alarmTime`)"
            @input="debounceUpdate"
            @blur="onBlur"
          />
        </div>
        <div
          :id="`${idx}-alarmUserName`"
          class="table-col sm"
          @click="toggleEditable(`${idx}-alarmUserName`, log.id)"
        >
          <EditableSelectCell
            v-model="log.alarmUserName"
            :is-editable="isEditable(`${idx}-alarmUserName`)"
            :options="userOptions"
            @input="debounceUpdate"
            @blur="onBlur"
          />
        </div>
        <div :id="`${idx}-delete`" tabindex="-1" class="table-col xs">
          <DeleteButton small @click="onDeleteClick(log.id)" />
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
  'priority', 'years', 'note', 'logDate', 'alarmDate', 'alarmTime', 'alarmUserName', 'delete'
]

const alarmStatusValues = ['', true, false]

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
      selectedItems: {},
      filterByAlarmStatusValue: '',
      filterByAlarmStatusIndex: 0
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
    selectedClient (newClient, oldClient) {
      if (newClient.id !== oldClient.id) {
        Object.assign(this.$data, this.$options.data.apply(this))
        this.selectedItems = {}
        this.logs.forEach((log) => {
          this.selectedItems = Object.assign(this.selectedItems, { [log.id]: false })
        })
      }
    }
  },
  created () {
    if (this.logs) {
      this.logs.forEach((log) => {
        this.selectedItems = Object.assign(this.selectedItems, { [log.id]: false })
      })
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
    },
    isMult (year) {
      return year?.includes('\u000B')
    },
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
