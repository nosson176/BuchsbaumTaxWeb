<template>
  <Table v-if="isClientSelected" @keydown.tab.prevent @keyup.tab.exact="goToNextColumn"
    @keyup.shift.tab.exact="goToPrevColumn">
    <template #header>
      <TableHeader>
        <div class="table-header flex items-start">
          <AddRowButton @click="onAddRowClick" />
          <CopyIcon @click.native="copyLog" class="cursor-pointer h-5 w-4 ml-2" />
          <PasteIcon v-if="hasCopyLogs" @click.native="pasteLogs" class="cursor-pointer h-5 w-4 ml-2" />
        </div>
        <div class="xs table-header">
          <ClockIcon class="h-4 w-4 ml-2 cursor-pointer" @click.native="onAddRowClick(true)" />
        </div>
        <div class="table-header flex flex-col year">
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
          <button type="button"
            class="w-4 h-4 border border-transparent rounded bg-indigo-200 shadow-sm hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            @click="setAlarmFilter" />
        </div>
        <div class="table-header sm flex flex-col">
          <div class="flex items-center space-x-0.5">
            <span>Emp</span>
            <DeleteButton small @click="employeeFilterValue = ''" />
          </div>
          <HeaderSelectOption v-model="employeeFilterValue" :options="filteredUserOptions" />
        </div>
        <div v-if="playTime && globalPlayTime" class="table-header sm flex">
          <PauseIcon class="h-4 w-4 text-green-500 mr-2 cursor-pointer" @click.native="stopTime" />
          {{ currentTimeSpent }}
        </div>
        <div v-else class="table-header sm flex">
          <PlayIcon class="h-4 w-4 text-green-500 mr-2 cursor-pointer" @click.native="runTime" />
          -- : --
        </div>
        <div class="table-header xs">
          <PicnicTableIcon @click.native="picnicTablePopup" class="cursor-pointer h-5 w-4 ml-2" />
        </div>
      </TableHeader>
    </template>
    <template #body>
      <TableRow v-for="(log, idx) in displayedLogs" :key="log.id" :idx="idx" :selected="isSelected(log.id)"
        :class="{ alarm: isTodayOrPast(log.alarmDate) && !log.alarmComplete }">
        <div class="table-col bg-gray-200 mr-1">
          <ClickCell @click="toggleSelected(log)">{{ idx + 1 }}</ClickCell>
        </div>
        <div :id="`${idx}-priority`" class="table-col xs"
          @click="toggleEditable(`${idx}-priority`, log.id, log.priority)">
          <EditablePrioritySelectCell v-model="log.priority" :is-editable="isEditable(`${idx}-priority`)"
            @blur="onBlur(log.priority)" @tab="goToNextColumn" />
        </div>
        <div :id="`${idx}-years`" class="table-col year" @click="toggleEditable(`${idx}-years`, log.id, log.years)">
          <Tooltip :disabled="!isMult(log.years) || isEditable(`${idx}-years`)" trigger="hover">
            <EditableSelectCell v-model="log.years" :is-editable="isEditable(`${idx}-years`)" :options="yearOptions"
              @blur="onBlur(log.years)" />
            <template #popper>
              <ul>
                <li v-for="(year, index) in splitYears(log.years)" :key="index">
                  <span v-if="isMult(log.years) && index">{{ year }}</span>
                </li>
              </ul>
            </template>
          </Tooltip>
        </div>
        <div :id="`${idx}-note`" class="table-col xxl" @click="toggleEditable(`${idx}-note`, log.id, log.note)">
          <EditableTextAreaCell v-model="log.note" @keyup.enter.native="onBlur(log.note)"
            :is-editable="isEditable(`${idx}-note`)" @blur="onBlur(log.note)" />
        </div>
        <div :id="`${idx}-logDate`" class="table-col sm" @click="toggleEditable(`${idx}-logDate`, log.id, log.logDate)">
          <EditableDateCell v-model="log.logDate" :is-editable="isEditable(`${idx}-logDate`)"
            @blur="onBlur(log.logDate)" />
        </div>
        <div :id="`${idx}-alarmDate`" class="table-col sm"
          @click="toggleEditable(`${idx}-alarmDate`, log.id, log.alarmDate)">
          <EditableDateCell v-model="log.alarmDate" type="date" :is-editable="isEditable(`${idx}-alarmDate`)"
            @blur="onBlur(log.alarmDate)" />
        </div>
        <div :id="`${idx}-alarmComplete`" class="table-col xs" @click="toggleComplete(log)">
          <CheckIcon v-if="log.alarmDate" class="h-5 w-5 cursor-pointer"
            :class="log.alarmComplete ? 'text-green-500' : 'text-gray-400'" />
        </div>
        <div :id="`${idx}-alarmUserName`" class="table-col sm"
          @click="toggleEditable(`${idx}-alarmUserName`, log.id, log.alarmUserName)">
          <EditableSelectCell v-model="log.alarmUserName" :is-editable="isEditable(`${idx}-alarmUserName`)"
            :options="userOptions" @blur="onBlur(log.alarmUserName)" />
        </div>
        <div :id="`${idx}-secondsSpent`" class="table-col sm"
          @click="toggleEditable(`${idx}-secondsSpent`, log.id, log.timeSpent)">
          <EditableInputCell v-model="log.timeSpent" :is-editable="isEditable(`${idx}-secondsSpent`)"
            @blur="updateSecondsSpent(log)" @keypress.native.enter="updateSecondsSpent(log)" />
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
import { isToday, isPast, parseISO, intervalToDuration } from 'date-fns'
import { models, mutations, tableGroups, tabs } from '~/shared/constants'
import { boldSearchWord, searchArrOfObjs } from '~/shared/utility'

const columns = ['priority', 'years', 'note', 'logDate', 'alarmDate', 'alarmUserName', 'secondsSpent', 'delete']

const alarmStatusValues = ['', true, false]

export default {
  name: 'LogsTable',
  props: {
    showArchived: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      editableId: '',
      editableLogId: '',
      yearFilterValue: '',
      employeeFilterValue: '',
      selectedItems: {},
      filterByAlarmStatusValue: '',
      filterByAlarmStatusIndex: 0,
      currentTimeOnLoad: 0,
      currentTimeSpent: 0,
      playTime: true,
      intervalId: '',
      oldValue: '',
    }
  },
  computed: {
    ...mapState([
      models.selectedClient,
      models.valueTypes,
      models.users,
      models.search,
      models.cmdPressed,
      models.secondsSpentOnClient,
      models.clientSearchOption,
      models.clientSearchValue,
      models.globalPlayTime,
      models.copyLogs,
    ]),
    displayedLogs() {
      const logs = this.shownLogs.filter((log) => this.filterLogs(log))
      const mappedLogs = logs.map((log) => {
        if (log.alarmUserId && !log.alarmUserName) {
          log.alarmUserName = this.usersArray[log.alarmUserId].username
        }
        log.timeSpent = this.getTimeSpentOnClient(log)
        return log
      })
      if (
        this.clientSearchOption === "logs::note" &&
        this.clientSearchValue.length > 0 &&
        (this.searchInput === '' || this.searchInput === undefined)
      ) {
        const filterBySearchInput = searchArrOfObjs(mappedLogs, this.clientSearchValue)
        return boldSearchWord(filterBySearchInput, this.clientSearchValue)
      }
      const filterBySearchInput = searchArrOfObjs(mappedLogs, this.searchInput)
      return boldSearchWord(filterBySearchInput, this.searchInput)
    },
    shownLogs() {
      if (this.logs) {
        return this.logs.filter((log) => this.showArchived === log.archived)
      } else {
        return null
      }
    },
    yearOptions() {
      return this.valueTypes.year_name.filter((year) => year.show)
    },
    headers() {
      return this.$api.getHeaders()
    },
    clientId() {
      return this.selectedClient.id
    },
    logs() {
      if (this.selectedClient.logs) {
        return JSON.parse(JSON.stringify(this.selectedClient.logs))
      } else {
        return null
      }
    },
    userOptions() {
      return Object.values(this.users).map((user) => {
        return { value: user.username }
      })
    },
    searchInput() {
      return this.search?.[tableGroups.logsIncomeFbar]
    },
    isClientSelected() {
      return !Array.isArray(this.selectedClient) || this.selectedClient.length > 0
    },
    filteredYearOptions() {
      const options = this.yearOptions.filter((yearName) => this.shownLogs?.find((log) => log.years === yearName.value))
      return options
    },
    filteredUserOptions() {
      const options = this.userOptions.filter((user) => this.shownLogs?.find((log) => log.alarmUserName === user.value))
      return options
    },
    filterByYear() {
      return !(this.yearFilterValue === '')
    },
    filterByEmployee() {
      return !(this.employeeFilterValue === '')
    },
    isCmdPressed() {
      return this.cmdPressed && !Array.isArray(this.cmdPressed)
    },
    selectedLogIds() {
      return Object.keys(this.selectedItems).filter((id) => this.selectedItems[id])
    },
    isCopyingLogs() {
      return this.isCmdPressed && this.selectedLogIds.length > 0
    },
    filterByAlarmStatus() {
      return !(this.filterByAlarmStatusValue === '')
    },
    usersArray() {
      const usersArray = []
      for (const key in this.users) {
        const user = this.users[key]
        usersArray[user.id] = user
      }
      return usersArray
    },
    globalPlaytimeValue() {
      return this.$store.state.globalPlayTime;
    },
    hasCopyLogs() {
      return this.$store.state.copyLogs.length > 0;
    }
  },
  created() {
    this.resetClock("created")
    if (this.$store.getters[models.selectedClient]?.id) {
      this.intervalId = setInterval(() => {
        const timeSpent = this.getCurrentTimeSpent()
        if (timeSpent) {
          this.$store.commit(mutations.setModelResponse, { model: models.secondsSpentOnClient, data: timeSpent })
        }
      }, 1000)
    }
  },
  beforeDestroy() {
    clearInterval(this.intervalId)
  },
  watch: {
    globalPlaytimeValue(newValue) {
      if (newValue === false) {
        this.stopTime();
      } if (newValue === true) {
        this.runTime()
      }
    },
    selectedClient() {
      this.runTime()
    }
  },
  methods: {
    picnicTablePopup() {
      let url = process.env.NODE_ENV === 'development' ?
        `http://localhost:3000/picnicTable?client=${encodeURIComponent(this.selectedClient.id)}`
        :
        `https://buch-tax.com/picnicTable?client=${encodeURIComponent(this.selectedClient.id)}`
      console.log("url", url);
      window.open(url);

    },
    copyLog() {
      if (!this.selectedLogIds) return

      this.selectedLogIds.forEach((logId, idx) => {
        const isLogCopied = this.$store.state.copyLogs.some(log => {
          return log.id === Number(logId)
        });
        if (isLogCopied) return;

        const logIndex = this.displayedLogs.findIndex((log) => log.id === Number(logId))
        const log = this.displayedLogs[logIndex]

        if (log) {
          const copyLogs = Object.assign({}, log)
          this.$store.commit('setCopyLogs', copyLogs);
          return copyLogs
        }
      })
      this.selectedLogIds = []
    },
    pasteLogs() {
      // Guard clause if copyLogs is empty or undefined
      if (!this.$store.state.copyLogs || this.$store.state.copyLogs.length === 0) return;

      // Commit a mutation to update each log's clientId and logDate
      this.$store.commit('updateCopyLogs', {
        clientId: this.selectedClient.id,
        logDate: new Date()
      });


      // Use Promise.all to ensure all logs are created before proceeding
      const createLogPromises = this.$store.state.copyLogs.map(log => {
        return this.$api.createLog(this.headers, { log });
      });

      Promise.all(createLogPromises)
        .then(() => {
          // After all logs are created, refresh client data
          return this.$api.getClientData(this.headers, this.selectedClient.id);
        })
        .then(() => {
          // Clear copyLogs after successful paste and refresh
          this.$store.commit('clearCopyLogs');
        })
        .catch(error => {
          // Handle any errors that occur during the process
          console.error('Error during pasteLogs operation:', error);
        });
    },
    runTime() {
      clearInterval(this.intervalId)
      this.currentTimeOnLoad = new Date()
      this.playTime = true
      this.intervalId = setInterval(() => {
        const timeSpent = this.getCurrentTimeSpent()
        if (timeSpent) {
          this.$store.commit(mutations.setModelResponse, { model: models.secondsSpentOnClient, data: timeSpent })
        }
      }, 1000)
    },
    stopTime() {
      clearInterval(this.intervalId)
      this.resetClock()
      this.playTime = false
    },
    toggleEditable(id, logId, value) {
      if (!value) {
        const val = id.split("-")[1]
        const log = this.displayedLogs.find((log) => log.id === logId)
        this.oldValue = log[val]
      } else this.oldValue = value
      if (this.editableId !== id) {
        this.editableId = id;
        this.editableLogId = logId;
      }
    },
    isEditable(id) {
      return this.editableId === id
    },
    handleUpdate() {
      if (!this.editableLogId) return
      const log = this.displayedLogs.find((log) => log.id === this.editableLogId)
      for (const key in this.users) {
        if (this.users[key].username === log?.alarmUserName) {
          log.alarmUserId = this.users[key].id
        }
      }
      return this.$api.updateLog(this.headers, { clientId: this.clientId, logId: this.editableLogId }, log)
    },
    onDeleteClick(logId) {
      if (this.showArchived) {
        const log = this.displayedLogs.find((log) => log.id === logId)
        log.archived = false
        this.$api.updateLog(this.headers, { clientId: this.clientId, logId }, log)
      } else {
        this.$store.commit(mutations.setModelResponse, {
          model: models.modals,
          data: { delete: { showing: true, data: { id: logId, type: tabs.logs, label: 'log note' } } },
        })
      }
    },
    onAddRowClick(addSecondsSpent = false) {
      if (!this.selectedClient) {
        return
      }
      const defaultValues = {
        clientId: this.selectedClient.id,
        logDate: new Date(),
      }
      if (addSecondsSpent) {
        defaultValues.secondsSpent = this.secondsSpentOnClient
        this.resetClock()
      }
      if (this.isCopyingLogs) {
        this.selectedLogIds.forEach(async (logId, idx) => {
          const logIndex = this.displayedLogs.findIndex((log) => log.id === Number(logId))
          const log = this.displayedLogs[logIndex]
          const newLog = Object.assign({}, log)
          await this.$api.createLog(this.headers, { log: newLog }).then(async (data) => {
            if (this.selectedLogIds.length === idx + 1) {
              await this.$api.getClientData(this.headers, this.selectedClient.id)
              this.toggleEditable(`${logIndex}-${columns[1]}`, data.id)
            }
          })
        })
      } else {
        const log = Object.assign({}, defaultValues)
        this.$api.createLog(this.headers, { log }).then(async (data) => {
          await this.$api.getClientData(this.headers, this.selectedClient.id)
          this.toggleEditable(`0-${columns[1]}`, data.id)
        })
      }
      this.$store.commit(mutations.setModelResponse, { model: models.promptOnClientChange, data: false })
      this.$store.commit(mutations.setModelResponse, { model: models.secondsSpentOnClient, data: 0 })
    },
    onBlur(val) {
      if (this.oldValue !== val && this.oldValue !== undefined) {
        this.handleUpdate()
        this.goToNextColumn()
        return
      }
      this.editableId = ""
    },
    isTodayOrPast(date) {
      const parsedDate = parseISO(date)
      return isToday(parsedDate) || isPast(parsedDate)
    },
    toggleComplete(log) {
      if (!this.isTodayOrPast(log.alarmDate) && !log.alarmComplete) {
        return
      } else if (log.alarmComplete) {
        log.alarmComplete = false
      } else if (this.isTodayOrPast(log.alarmDate) && !log.alarmComplete) {
        log.alarmComplete = true
      }
      this.editableLogId = log.id
      this.handleUpdate()
    },
    filterLogs(log) {
      const hasAlarm = log.alarmDate
      let returnValue = true
      returnValue = this.filterByYear ? log.years === this.yearFilterValue && returnValue : returnValue
      returnValue = this.filterByEmployee ? log.alarmUserName === this.employeeFilterValue && returnValue : returnValue
      returnValue = this.filterByAlarmStatus
        ? log.alarmComplete === this.filterByAlarmStatusValue && hasAlarm && returnValue
        : returnValue
      return returnValue
    },
    toggleSelected(log) {
      this.selectedItems[log.id] = !this.selectedItems[log.id]
      this.selectedItems = Object.assign({}, this.selectedItems)
    },
    isSelected(logId) {
      return this.selectedItems[logId]
    },
    goToNextColumn() {
      const currentCell = this.editableId
      const idArr = currentCell.split('-')
      const columnIndex = columns.findIndex((col) => col === idArr[1])
      const currentRow = Number(idArr[0])
      if (columnIndex < columns.length - 1) {
        const nextCell = `${currentRow}-${columns[columnIndex + 1]}`
        this.toggleEditable(nextCell, this.editableLogId)
      } else if (columnIndex === columns.length - 1 && currentRow < this.displayedLogs.length - 1) {
        const nextRow = currentRow + 1
        const nextCell = `${nextRow}-${columns[0]}`
        this.toggleEditable(nextCell, this.editableLogId)
      }
    },
    goToPrevColumn() {
      const currentCell = this.editableId
      const idArr = currentCell.split('-')
      const columnIndex = columns.findIndex((col) => col === idArr[1])
      const currentRow = Number(idArr[0])
      if (columnIndex === 0 && currentRow > 0) {
        const prevRow = currentRow - 1
        const prevCell = `${prevRow}-${columns[columns.length - 1]}`
        this.toggleEditable(prevCell, this.editableLogId)
      } else if (columnIndex > 0) {
        const prevCell = `${currentRow}-${columns[columnIndex - 1]}`
        this.toggleEditable(prevCell, this.editableLogId)
      }
    },
    setAlarmFilter() {
      this.filterByAlarmStatusIndex = (this.filterByAlarmStatusIndex + 1) % 3
      this.filterByAlarmStatusValue = alarmStatusValues[this.filterByAlarmStatusIndex]
    },
    splitYears(years) {
      return years?.split('\u000B')
    },
    isMult(year) {
      return year?.includes('\u000B')
    },
    getCurrentTimeSpent() {
      const duration = intervalToDuration({ start: this.currentTimeOnLoad, end: new Date() })
      const hh = duration.hours < 10 ? '0' + duration.hours : duration.hours
      const mm = duration.minutes < 10 ? '0' + duration.minutes : duration.minutes
      const ss = duration.seconds < 10 ? '0' + duration.seconds : duration.seconds
      this.currentTimeSpent = `${hh}:${mm}:${ss}`
      return this.formatToSeconds(duration)
    },
    formatToSeconds(duration) {
      let totalSeconds = duration.seconds
      if (duration.minutes > 0) {
        totalSeconds += duration.minutes * 60
      }
      if (duration.hours > 0) {
        totalSeconds += duration.hours * 3600
      }
      return totalSeconds
    },
    getTimeSpentOnClient(log) {
      const seconds = log.secondsSpent || 0
      const duration = intervalToDuration({ start: 0, end: seconds * 1000 })
      const hh = duration.hours < 10 ? '0' + duration.hours : duration.hours
      const mm = duration.minutes < 10 ? '0' + duration.minutes : duration.minutes
      return seconds > 59 ? `${hh}:${mm}` : ''
    },
    resetClock(e) {
      if (e === "created") this.currentTimeOnLoad = new Date()
      this.$store.commit(mutations.setModelResponse, { model: models.secondsSpentOnClient, data: 0 })
      this.$store.commit(mutations.setModelResponse, { model: models.promptOnClientChange, data: true })
    },
    updateSecondsSpent(log) {
      this.onBlur()
      const timeArr = log.timeSpent.split(':')
      if (timeArr.length < 2 || isNaN(timeArr[0]) || isNaN(timeArr[1])) {
        log.timeSpent = this.getTimeSpentOnClient(log)
        return false
      }
      log.secondsSpent = timeArr[0] * 3600 + timeArr[1] * 60
    },
  },
}
</script>

<!-- <style scoped>
.alarm {
  @apply bg-indigo-100;
}

.year {
  min-width: 4rem;
  max-width: 5rem;
}

@media screen and (min-width: 1919px) {
  .year {
    @apply w-1/5;

    min-width: 3rem;
  }
}
</style> -->
