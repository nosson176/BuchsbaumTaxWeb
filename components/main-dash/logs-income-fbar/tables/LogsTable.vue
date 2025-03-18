//update
<template>
  <Table v-if="isClientSelected" @wheel.prevent @keydown.tab.prevent @keyup.shift.tab.exact="goToPrevColumn">
    <template #header>
      <TableHeader class="border-amber-500 head">
        <div class="table-header flex items-center space-x-2">
          <div class="flex flex-col items-center space-y-1">
            <AddRowButton @click="onAddRowClick" class="self-start m-0" />
            <div class="flex items-center" style="flex-shrink: 0; min-width: auto;">
              <CopyIcon @click.native="copyLog" class="cursor-pointer h-5 w-5" />
              <PasteIcon v-if="hasCopyLogs" @click.native="pasteLogs" class="cursor-pointer h-5 w-5" />
            </div>
          </div>
        </div>

        <div class="xxs table-header">
          <ClockIcon class="h-4 w-4 ml-2 cursor-pointer" @click.native="onAddRowClick(true)" />
        </div>
        <div class="table-header flex items-end  w-min ml-1.5 ">
          <div class="flex-col">
            <div class="flex items-center space-x-0.5">
              <span>Year</span>
              <DeleteButton small @click="yearFilterValue = ''" />
            </div>
            <HeaderSelectOption v-model="yearFilterValue" :options="filteredYearOptions" />
          </div>
        </div>
        <div class="table-header w-3/4 ml-3">Note</div>
        <div class="table-header xs">Date</div>
        <!-- <div class="table-header sm">Alarm</div> -->
        <div class="table-header sm flex flex-col ml-3 ">
          <div class="flex items-center space-x-0.5 ">
            <span>Emp</span>
            <DeleteButton small @click="employeeFilterValue = ''" />
          </div>
          <HeaderSelectOption class="w-3/4" v-model="employeeFilterValue" :options="filteredUserOptions" />
        </div>
        <!-- <div class="table-header sm">Time</div> -->
        <div class="flex ">
          <div class="table-header ">
            <button type="button"
              class="w-4 h-4 border border-transparent rounded bg-indigo-200 shadow-sm hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              @click="setAlarmFilter" />
          </div>
          <div class="table-header sm">Time</div>
        </div>
        <div v-if="playTime && globalPlayTime" class="table-header sm flex justify-center">
          <PauseIcon class="h-4 w-4 text-green-500 mr-2 cursor-pointer" @click.native="stopTime" />
          {{ currentTimeSpent }}
        </div>
        <div v-else class="table-header sm flex">
          <PlayIcon class="h-4 w-4 text-green-500 mr-2 cursor-pointer" @click.native="runTime" />
          -- : --
        </div>
        <div class="table-header flex-start ">
          <PicnicTableIcon @click.native="picnicTablePopup" class="cursor-pointer h-5 w-4  mr-2" />
        </div>
      </TableHeader>
    </template>
    <template #body>
      <TableRow v-for="(log, idx) in displayedLogs" :key="log.id" :idx="idx" :selected="isSelected(log.id)"
        class="flex justify-between " :class="{ alarm: isTodayOrPast(log.alarmTime) && !log.alarmComplete }">
        <div class="table-col bg-gray-200 ">
          <ClickCell @click="toggleSelected(log)">{{ idx + 1 }}</ClickCell>
        </div>
        <div :id="`${idx}-priority`" class="table-col w-min"
          @click="toggleEditable(`${idx}-priority`, log.id, log.priority)">
          <EditablePrioritySelectCell v-model="log.priority" :is-editable="isEditable(`${idx}-priority`)"
            @blur="onBlur(log.priority, 'priority')" @keyup.tab.native="onBlur(log.priority, 'priority', $event)"
            @keyup.esc.native="onBlur(log.priority, 'priority', $event)" />
        </div>
        <div :id="`${idx}-years`" class="table-col xxs" @click="toggleEditable(`${idx}-years`, log.id, log.years)">
          <Tooltip :disabled="!isMult(log.years) || forceCloseTooltip" trigger="hover" :delay="500"
            :placement="isEditable(`${idx}-years`) ? 'left' : 'right'" :interactive="true" :html="true">
            <EditableMultiSelect class="w-10 overflow-ellipsis" v-model="log.years"
              :auto-focus="isEditable(`${idx}-years`)" :is-editable="isEditable(`${idx}-years`)" :options="yearOptions"
              @blur="onBlur(log.years, 'years', $event)" placeholder="Year"
              @keyup.tab.native="onBlur(log.years, 'years', $event)"
              @keyup.esc.native="onBlur(log.years, 'years', $event)" />
            <template #popper>
              <ul>
                <li v-for="(year, index) in splitYears(log.years)" :key="index">
                  <span v-if="isMult(log.years) && index">{{ year }}</span>
                </li>
              </ul>
            </template>
          </Tooltip>
        </div>
        <!-- <div :id="`${idx}-years`" class="table-col xxs" @click="toggleEditable(`${idx}-years`, log.id, log.years)">
          <Tooltip :disabled="!isMult(log.years) || isEditable(`${idx}-years`)" trigger="hover" :delay="500"
            placement="right" :interactive="true" :html="true">
            <EditableSelectCell class=" w-10 overflow-ellipsis" v-model="log.years"
              :auto-focus="isEditable(`${idx}-years`)" :is-editable="isEditable(`${idx}-years`)" :options="yearOptions"
              @blur="onBlur(log.years, 'years')" />
            <template #popper>
              <ul>
                <li v-for="(year, index) in splitYears(log.years)" :key="index">
                  <span v-if="isMult(log.years) && index">{{ year }}</span>
                </li>
              </ul>
            </template>
          </Tooltip>
        </div> -->
        <div :id="`${idx}-note`" class="table-col xl relative" @click="toggleEditable(`${idx}-note`, log.id, log.note)"
          @mouseenter="!isEditable(`${idx}-note`) && showTooltip(idx)" @mouseleave="hideTooltip">
          <EditableTextAreaCell v-model="log.note" :prevent-enter="true"
            @keyup.enter.native="onBlur(log.note, 'note', $event)" @keyup.esc.native="onBlur(log.note, 'note', $event)"
            :is-editable="isEditable(`${idx}-note`)" @blur="onBlur(log.note, 'note', $event)" :over="false"
            :showOverflow="true" :pre="false" @keyup.tab.native="onBlur(log.note, 'note', $event)"
            @focus.native.prevent="handleFocus" />

          <!-- Custom Tooltip -->
          <div v-show="activeTooltipIndex === idx && !isEditable(`${idx}-note`)"
            class="absolute z-50 bg-gray-800 text-white p-2 rounded-md shadow-lg max-w-md whitespace-normal break-words"
            style="top: calc(50% + 25%); left: 0;">
            <div class="absolute -top-2 left-4 border-8 border-transparent border-b-gray-800"></div>
            {{ log.note }}
          </div>
        </div>
        <div :id="`${idx}-logDate`" class="table-col xs" @click="toggleEditable(`${idx}-logDate`, log.id, log.logDate)">
          <EditableDateCell v-model="log.logDate" :is-editable="isEditable(`${idx}-logDate`)"
            @blur="onBlur(log.logDate, 'logDate', $event)" @keyup.tab.native="onBlur(log.logDate, 'logDate', $event)"
            @keyup.esc.native="onBlur(log.logDate, 'logDate', $event)" />
        </div>
        <!-- <div :id="`${idx}-alarmDate`" class="table-col sm"
          @click="toggleEditable(`${idx}-alarmDate`, log.id, log.alarmDate)">
          <EditableDateCell v-model="log.alarmDate" :is-editable="isEditable(`${idx}-alarmDate`)"
            @blur="onBlur(log.alarmDate, 'alarmDate')" />
        </div> -->

        <!-- <div :id="`${idx}-alarmTime`" class="table-col sm"
          @click="toggleEditable(`${idx}-alarmTime`, log.id, log.alarmTime)">
          <EditableDateCell2 v-model="log.alarmTime" :is-editable="isEditable(`${idx}-alarmTime`)"
            @blur="onBlur(log.alarmTime, 'alarmTime')" value-type="format" type="datetime" format="DD-MM-YYYY HH:mm"
            placeholder="Select date and time" @focusout="onBlur(log.alarmTime, 'alarmTime')" />
        </div> -->
        <div :id="`${idx}-alarmUserName`" class="table-col xs"
          @click="toggleEditable(`${idx}-alarmUserName`, log.id, log.alarmUserName)">
          <EditableSelectCell v-model="log.alarmUserName" :is-editable="isEditable(`${idx}-alarmUserName`)"
            :options="userOptions" @blur="onBlur(log.alarmUserName, 'alarmUserName', $event)"
            @keyup.tab.native="onBlur(log.alarmUserName, 'alarmUserName', $event)"
            @keyup.esc.native="onBlur(log.alarmUserName, 'alarmUserName', $event)"
            @click="onBlur(log.alarmUserName, 'alarmUserName', $event)" initiallyOpen=true />
        </div>
        <!-- <div :id="`${idx}-alarmUserName`" class="table-col sm"
        @click="toggleEditable(`${idx}-alarmUserName`, log.id, log.alarmUserName)">
        <EditableSelectCell v-model="log.alarmUserName" :is-editable="isEditable(`${idx}-alarmUserName`)"
        :options="userOptions" @blur="onBlur(log.alarmUserName, 'alarmUserName')" />
      </div> -->
        <div :id="`${idx}-alarmTime`" class="table-col xs"
          @click="toggleEditable(`${idx}-alarmTime`, log.id, log.alarmTime)">
          <EditableDateCell2 v-model="log.alarmTime" :is-editable="isEditable(`${idx}-alarmTime`)"
            @blur="onBlur(log.alarmTime, 'alarmTime', $event)" value-type="format" type="datetime"
            format="MM-DD-YYYY HH:mm" placeholder="Select date and time" @focusout="onBlur(log.alarmTime, 'alarmTime')"
            @keyup.tab.native="onBlur(log.alarmTime, 'alarmTime', $event)"
            @keyup.esc.native="onBlur(log.alarmTime, 'alarmTime', $event)" />
        </div>
        <div :id="`${idx}-alarmComplete`" class="table-col xxs" @click="toggleComplete(log, 'alarmComplete')">
          <CheckIcon v-if="log.alarmTime" class="h-5 w-5 cursor-pointer"
            :class="log.alarmComplete ? 'text-green-500' : 'text-gray-400'" />
        </div>
        <div :id="`${idx}-secondsSpent`" class="table-col xxs"
          @click="toggleEditable(`${idx}-secondsSpent`, log.id, log.timeSpent)">
          <EditableInputCell v-model="log.timeSpent" :is-editable="isEditable(`${idx}-secondsSpent`)"
            @blur="updateSecondsSpent(log, log.secondsSpent, 'secondsSpent')"
            @keyup.tab.native="updateSecondsSpent(log, log.secondsSpent, 'secondsSpent')" />
        </div>
        <div :id="`${idx}-delete`" tabindex="-1" class="table-col mr-2  xxs">
          <Tooltip :delay="500" placement="right" :interactive="true" :html="true">
            <DeleteButton small @click="onDeleteClick(log.id)" />
            <template #popper>
              <div class="tooltip-content p-2 max-w-md">
                <ul v-if="log.historyLogJson && log.historyLogJson.length > 0 || log.createdBy" class="list-disc pl-4">
                  <span class="font-semibold mb-2 block"><strong>Created by</strong> {{ log.createdBy }} => {{
                    formatDateLog(log.createdTime)
                  }}</span>
                  <div class="div"></div>
                  <li v-for="(change, changeIdx) in log.historyLogJson" :key="changeIdx" class="mb-1">
                    <span class="font-semibold">
                      ({{ formatDateLog(change.date) }}) {{ change.userName }} => {{ change.field }} =>
                    </span>
                    {{ truncateText(change.val) }}
                  </li>
                </ul>
                <p v-else class="text-gray-500">No changes recorded</p>
              </div>
            </template>
          </Tooltip>
        </div>
      </TableRow>
      <div>
        <Modal :showing="showDeleteModal" @hide="closeDeleteModal">
          <DeleteType :label="deleteTypeLabel" @hide="closeDeleteModal" @delete="deleteLog" />
        </Modal>
      </div>
    </template>
  </Table>


</template>

<script>
import { mapState } from 'vuex'
import { intervalToDuration } from 'date-fns'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { models, mutations, tableGroups } from '~/shared/constants'
import { boldSearchWord, convertToUnixTimestamp, formatDateLog, generateRandomId, getStartDayInUnixTime, searchArrOfObjs } from '~/shared/utility'

const columns = ['priority', 'years', 'note', 'logDate', 'alarmUserName', 'alarmTime']
// const columns = ['priority', 'years', 'note', 'logDate', 'alarmDate', 'alarmTime', 'alarmUserName', 'secondsSpent', 'delete']

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
      updatAndNewLogs: [],
      showDeleteModal: false,
      deleteLogId: null,
      deleteTypeLabel: 'log',
      activeTooltipIndex: null,
      tooltipTimer: null,
      forceCloseTooltip: false, // Controls tooltip visibility
      dateFieldsInProgress: new Set()
    }
  },
  computed: {
    ...mapState([
      models.selectedClient,
      models.currentUser,
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
      const logs = this.shownLogs?.filter((log) => this.filterLogs(log))
      if (!logs || logs.length === 0) return []
      const mappedLogs = logs?.map((log) => {
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
        // מסנן את הלוגים לפי הערך של showArchived
        // const filteredLogs = this.logs?.filter(log => this.showArchived === log.archived);
        // ממיר את ה-historyLogJson מ-JSON string לאובייקט JSON
        const updatedLogs = this.logs.map(log => {
          if (log.historyLogJson && typeof log.historyLogJson === 'string') {
            try {
              log.historyLogJson = this.parseHistoryLogJson(log.historyLogJson)
            } catch (e) {
              console.error('Failed to parse JSON for log:', log, e);
            }
          }
          return log;
        });

        return updatedLogs;
      } else {
        return null;
      }
    },
    isEditable() {
      return (id) => this.editableId === id
    },
    yearOptions() {
      return this.valueTypes?.year_name?.filter((year) => year.show)
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
      const options = Object.values(this.users).map((user) => {
        return { value: user.username };
      });

      // Add a blank option at the beginning or end
      options.unshift({ value: '' });  // To add a blank option at the beginning
      // Alternatively, you can use `options.push({ value: '' });` to add at the end

      return options;
    },
    searchInput() {
      return this.search?.[tableGroups.logsIncomeFbar]
    },
    isClientSelected() {
      return !Array.isArray(this.selectedClient) || this.selectedClient.length > 0
    },
    filteredYearOptions() {
      const options = this.yearOptions?.filter((yearName) => this.shownLogs?.find((log) => log.years === yearName.value))
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
      return this.isCmdPressed || this.selectedLogIds.length > 0
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
      }, 60000)
    }
  },
  mounted() {
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
    if (this.tooltipTimer) {
      clearTimeout(this.tooltipTimer);
    }
    this.saveUpdatAndNewLogs();
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
    handleFocus(event) {
      event.preventDefault();
    },
    showTooltip(idx) {
      if (this.tooltipTimer) {
        clearTimeout(this.tooltipTimer);
      }
      this.tooltipTimer = setTimeout(() => {
        this.activeTooltipIndex = idx;
      }, 500);
    },

    hideTooltip() {
      if (this.tooltipTimer) {
        clearTimeout(this.tooltipTimer);
      }
      this.activeTooltipIndex = null;
    },
    formatDateLog,

    handleBeforeUnload(event) {
      clearInterval(this.intervalId);
      this.saveUpdatAndNewLogs();
      // Optionally, to show a confirmation dialog
      event.preventDefault();
      event.returnValue = '';
    },
    truncateText(text, length = 50) {
      if (!text) return '';
      return text.length > length ? text.substring(0, length) + '...' : text;
    },
    parseHistoryLogJson(historyLogJson) {
      if (!historyLogJson) return [];
      try {
        return typeof historyLogJson === 'string'
          ? JSON.parse(historyLogJson)
          : historyLogJson;
      } catch (error) {
        console.error('Error parsing historyLogJson:', error);
        return [];
      }
    },

    picnicTablePopup() {
      const url = process.env.NODE_ENV === 'development' ?
        `http://localhost:3000/picnicTable?client=${encodeURIComponent(this.selectedClient.id)}`
        :
        `https://buch-tax.com/picnicTable?client=${encodeURIComponent(this.selectedClient.id)}`
      window.open(url);

    },
    copyLog() {
      if (!this.selectedLogIds) return;

      this.selectedLogIds.forEach((logId, idx) => {
        const isLogCopied = this.$store.state.copyLogs.some(log => log.id === Number(logId));
        if (isLogCopied) return;

        const logIndex = this.displayedLogs.findIndex(log => log.id === Number(logId));
        const log = this.displayedLogs[logIndex];

        if (log) {
          // צור עותק של הלוג ושנה את historyLogJson למערך ריק
          const copyLog = { ...log, alarmComplete: false, alarmUserId: null, alarmDate: null, alarmTime: null, alarmUserName: null, historyLogJson: [], id: generateRandomId(), new: true, createdBy: this.currentUser.username };

          // שמור את הלוג המועתק בחנות
          this.$store.commit('setCopyLogs', copyLog);

          return copyLog;
        }
      });

      this.selectedLogIds = [];
    },
    pasteLogs() {
      if (!this.$store.state.copyLogs || this.$store.state.copyLogs.length === 0) return;

      // Commit a mutation to update each log's clientId and logDate
      this.$store.commit('updateCopyLogs', {
        clientId: this.selectedClient.id,
        logDate: getStartDayInUnixTime()
      });
      let newLogC
      // Loop through the copyLogs and push to updatAndNewLogs locally in the component
      this.$store.state.copyLogs.forEach(copy => {
        const newLog = { ...copy, id: generateRandomId(), createdBy: this.currentUser.username }; // Create a new log with a new ID
        newLogC = newLog
        // Push the log into the local data (updatAndNewLogs)
        this.updatAndNewLogs.push(newLog);

        // Commit the new log to Vuex with the updated client and log information
        this.$store.commit('pushNewLog', {
          state: this.selectedClient,
          log: newLog
        });
      });
      this.selectedItems = {}
      const copyLogIndex = this.displayedLogs.findIndex((log) => log.id === Number(newLogC.id))
      this.toggleEditable(`${copyLogIndex}-${columns[1]}`, newLogC.id)
      // Clear the copyLogs after pasting
      this.$store.commit('clearCopyLogs');
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
        if (log) {
          this.oldValue = log[val]
          this.isEditable(id)
        }
      } else this.oldValue = value
      if (this.editableId !== id) {
        this.editableId = id;
        this.editableLogId = logId;
      }
    },

    handleUpdate(val, field) {
      if (!this.editableLogId) return;

      const logIndex = this.displayedLogs.findIndex((log) => log.id === this.editableLogId);
      if (logIndex === -1) return;


      const updatedLog = { ...this.displayedLogs[logIndex] };
      if (field === 'years') {
        if (!val.startsWith('\n')) {
          val = '\n' + val;
        }
        updatedLog.years = val
      }

      // Helper function to validate and send alarm
      const validateAndSendAlarm = (updatedLog, alarmTime) => {
        const currentTime = dayjs();
        const endOfDay = dayjs().endOf('day');

        if (alarmTime.isValid() && alarmTime.isAfter(currentTime) && alarmTime.isBefore(endOfDay)) {
          if (updatedLog.alarmUserId !== this.currentUser.id) {
            this.$websocket.sendAlarmToServer(updatedLog);
          } else {
            this.$store.commit('pushDayLog', {
              state: this.selectedClient,
              log: updatedLog
            });
          }
        }
      };

      // Handle alarmTime field update
      if (field === 'alarmTime') {
        dayjs.extend(customParseFormat);
        const alarmTime = dayjs(val, 'MM-DD-YYYY HH:mm', true);
        if (alarmTime.isValid()) {
          updatedLog.alarmTime = val;
          if (updatedLog.alarmUserId) {
            validateAndSendAlarm(updatedLog, alarmTime);
          }
        }

      }
      if (field === 'alarmUserName') {
        // אם הערך ריק, נאפס גם את ה-ID
        const user = val ? Object.values(this.users).find(user => user.username === val) : null;
        updatedLog.alarmUserId = user ? user.id : null;
        dayjs.extend(customParseFormat);
        const alarmTime = dayjs(updatedLog.alarmTime, 'DD-MM-YYYY HH:mm', true);
        validateAndSendAlarm(updatedLog, alarmTime);
      }

      if (field === 'note') updatedLog.noteDate = Date.now()
      // Dispatch update action
      this.$store.dispatch('updateLogAction', { log: updatedLog });

      // Update logs in parent component
      this.updateUpdatAndNewLogs(updatedLog, val, field);
    },

    updateUpdatAndNewLogs(updatedLog, val, field) {
      // Find the index of the log to update
      const index = this.updatAndNewLogs.findIndex(log => log.id === updatedLog.id);
      // Define the history entry to log changes
      const historyEntry = {
        userName: this.currentUser.username,
        date: Date.now(),
        field,
        val
      };

      if (index !== -1) {
        // Ensure reactivity for specific fields
        if (field === 'alarmDate') {
          this.$set(this.updatAndNewLogs[index], 'alarmCreateChange', Date.now());
        }

        if (field === 'alarmUserName') {
          this.$set(this.updatAndNewLogs[index], 'alarmUserId', updatedLog.alarmUserId);
        }

        // Update the field value
        this.$set(this.updatAndNewLogs[index], field, val);

        // Initialize `historyLogJson` if not already an array
        if (!this.updatAndNewLogs[index].new) {
          if (!Array.isArray(this.updatAndNewLogs[index].historyLogJson)) {
            this.$set(this.updatAndNewLogs[index], 'historyLogJson', []);
          }
          // Add the new history entry
          this.updatAndNewLogs[index].historyLogJson.push(historyEntry);
        }
      } else {
        // Initialize `historyLogJson` if it doesn't exist
        const newHistoryLogJson = Array.isArray(updatedLog.historyLogJson)
          ? [...updatedLog.historyLogJson]
          : [];
        newHistoryLogJson.push(historyEntry);
        // Push the new log object
        this.updatAndNewLogs.push({
          ...updatedLog,
          historyLogJson: newHistoryLogJson
        });
      }
    },


    async saveUpdatAndNewLogs() {
      if (this.updatAndNewLogs.length === 0) return
      try {
        const logsToSave = this.updatAndNewLogs.map(log => ({
          ...log,
          alarmTime: convertToUnixTimestamp(log.alarmTime),
          historyLogJson: JSON.stringify(log.historyLogJson)
        }));
        await this.$api.updateLogs(this.headers, logsToSave);
      } catch (error) {
        console.error('Error saving logs:', error);
      }
    },

    onDeleteClick(logId) {
      this.deleteLogId = logId
      this.showDeleteModal = true
    },

    closeDeleteModal() {
      this.showDeleteModal = false
    },

    deleteLog() {
      this.$api.deleteLog(this.headers, { logId: this.deleteLogId }).then(res => {
        this.closeDeleteModal()
        this.$store.commit('deleteLog', this.deleteLogId)
        const index = this.updatAndNewLogs.findIndex(log => log.id === this.deleteLogId)
        this.updatAndNewLogs.splice(index, 1)
      })
    },
    onAddRowClick(addSecondsSpent = false) {
      if (!this.selectedClient) {
        return
      }
      const defaultValues = {
        clientId: this.selectedClient.id,
        logDate: getStartDayInUnixTime(),
        id: generateRandomId(),
        archived: false,
        years: '',
        alarmComplete: false,
        alert: false,
        alerted: false,
        priority: 0,
        timeSpent: "",
        note: "",
        historyLogJson: [],
        new: true,
        createdBy: this.currentUser.username,
        alarmCreateChange: null,
        alarmUserId: null,
        alarmTime: null,
        alarmDate: null,
        created_time: Date.now()
      }
      if (addSecondsSpent) {
        defaultValues.secondsSpent = this.secondsSpentOnClient
        this.resetClock()
      }
      if (this.isCopyingLogs) {
        this.selectedLogIds.forEach((logId) => {
          const logIndex = this.displayedLogs.findIndex((log) => log.id === Number(logId))
          const log = this.displayedLogs[logIndex]

          const newLog = {
            ...log,
            id: generateRandomId(),
            logDate: getStartDayInUnixTime(),
            new: true,
            historyLogJson: [],
            createdBy: this.currentUser.username,
            alarmComplete: false,
            alarmUserId: null,
            alarmDate: null,
            alarmTime: null,
            alarmUserName: null,
            created_time: Date.now()
          };

          this.updatAndNewLogs.push(newLog)
          this.$store.commit('pushNewLog', {
            state: this.selectedClient,
            log: newLog
          });
          this.selectedItems = {}
          const copyLogIndex = this.displayedLogs.findIndex((log) => log.id === Number(newLog.id))
          this.$nextTick(() => {
            this.toggleEditable(`${copyLogIndex}-${columns[1]}`, newLog.id)
          })
        })
      } else {
        const log = Object.assign({}, defaultValues)
        this.updatAndNewLogs.push(log)
        this.$store.commit('pushNewLog', {
          state: this.selectedClient,
          log
        });
        this.$nextTick(() => {
          // Set the editable state after the new row is rendered
          this.editableId = `0-years`
          this.editableLogId = this.isCopyingLogs ? this.displayedLogs[0].id : defaultValues.id
        })
        // this.toggleEditable(`0-years`, log.id)
        // })
      }
      this.$store.commit(mutations.setModelResponse, { model: models.promptOnClientChange, data: false })
      this.$store.commit(mutations.setModelResponse, { model: models.secondsSpentOnClient, data: 0 })
    },
    hideToolTip() {
      this.forceCloseTooltip = true; // Close tooltip on blur
      setTimeout(() => {
        this.forceCloseTooltip = false; // Re-enable tooltip after a short delay
      }, 100);
    },
    onBlur(val, field, event = null) {
      if (event?.shiftKey && event?.key === "Tab") return;
      // }

      if (field === 'years' && !this.forceCloseTooltip) {
        this.hideToolTip(); // Controls tooltip visibility
      }
      // Special handling for date fields
      if (field === 'logDate') {
        // If this field is already being processed, skip
        if (this.dateFieldsInProgress.has(field)) {
          return;
        }


        // Mark this field as being processed
        this.dateFieldsInProgress.add(field);

        // Use setTimeout to allow the date picker to complete its update
        setTimeout(() => {
          const oldValueStr = JSON.stringify(this.oldValue);


          // Only proceed with update if values are different
          if (oldValueStr !== val) {
            this.handleUpdate();
            this.goToNextColumn();
          } else {
            // If no changes, still move to next item
            this.goToNextColumn();
          }

          // Remove field from processing set
          this.dateFieldsInProgress.delete(field);
        }, 100);

        return;
      }
      if (event === false) {
        this.handleUpdate(val, field);
        this.editableId = "";
        return
      }

      if (this.displayedLogs.find(log => log.id === this.editableLogId)?.new ||
        ['alarmDate', 'alarmUserName', 'alarmTime'].includes(field)) {
        if (!(this.oldValue === '' && val === '')) {
          this.handleUpdate(val, field);
          if (event?.key !== 'Escape') {
            this.goToNextColumn();
            return;
          }
          this.editableId = "";
          return;
        }
      }
      // For existing logs, only handle if value changed
      if (this.oldValue !== val && this.oldValue !== undefined && !(this.oldValue === '' && val === '')) {
        this.handleUpdate(val, field)
        if (event?.key !== 'Escape' && event?.type !== 'blur') {
          this.goToNextColumn(field)
          return
        }
        this.editableId = ""
        return
      }
      if (event?.key === 'Tab' || event?.key === 'Enter') {
        this.goToNextColumn()
        return
      }
      this.editableId = ""
      this.activeTooltipIndex = null
    },

    isTodayOrPast(timestamp) {

      if (!timestamp) return false;
      try {
        // Get current date at start of day for comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Handle Unix timestamp in milliseconds
        if (typeof timestamp === 'number') {
          const date = new Date(timestamp);
          return date <= today;
        }

        // Handle string timestamp (keeping this for flexibility)
        // Parse using built-in Date object instead of dayjs
        const parsedDate = new Date(timestamp);
        if (isNaN(parsedDate.getTime())) return false;

        return parsedDate <= today;
      } catch (error) {
        console.error('Error checking date:', error);
        return false;
      }
    },
    toggleComplete(log, field) {
      if (!this.isTodayOrPast(log.alarmTime) && !log.alarmComplete) {
        return
      } else if (log.alarmComplete) {
        log.alarmComplete = false
      } else if (this.isTodayOrPast(log.alarmTime) && !log.alarmComplete) {
        log.alarmComplete = true
      }
      this.editableLogId = log.id
      this.handleUpdate(log.alarmComplete, field)
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

    goToNextColumn(field) {
      if (!this.editableId) {
        console.warn('No editable ID found');
        return;
      }

      const currentCell = this.editableId
      const idArr = currentCell.split('-')
      if (idArr[1] === 'years' && !this.forceCloseTooltip) this.hideToolTip()// Controls tooltip visibility
      const columnIndex = columns.findIndex((col) => col === idArr[1])
      const currentRow = Number(idArr[0])

      // Handle special case for alarmUserName to alarmTime transition
      if (idArr[1] === 'alarmUserName') {
        const nextCell = `${currentRow}-alarmTime`
        this.$nextTick(() => {
          this.toggleEditable(nextCell, this.editableLogId)
        })
        return
      }

      if (columnIndex < columns.length - 1) {
        const nextCell = `${currentRow}-${columns[columnIndex + 1]}`
        this.$nextTick(() => {
          this.toggleEditable(nextCell, this.editableLogId)
        })
      }
      else if (columnIndex === columns.length - 1 && currentRow < this.displayedLogs.length - 1) {
        const nextRow = currentRow + 1
        const nextCell = `${nextRow}-${columns[0]}`
        this.$nextTick(() => {
          this.toggleEditable(nextCell, this.editableLogId)
        })
      } else this.editableId = ''
      this.activeTooltipIndex = null
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
      } else if (columnIndex === 0 && currentRow === 0) {
        this.editableId = ''
      }
      else if (columnIndex > 0) {
        const prevCell = `${idArr[0]}-${columns[columnIndex - 1]}`
        this.toggleEditable(prevCell, this.editableLogId)
      }
    },
    setAlarmFilter() {
      this.filterByAlarmStatusIndex = (this.filterByAlarmStatusIndex + 1) % 3
      this.filterByAlarmStatusValue = alarmStatusValues[this.filterByAlarmStatusIndex]
    },
    splitYears(years) {
      return years?.split(/\r?\n/); // Split on newlines (Windows `\r\n` or Unix `\n`)
    },
    /* eslint-disable no-control-regex */
    isMult(year) {
      return /\r|\n|\u000B/.test(year);
    },
    /* eslint-enable no-control-regex */
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
      if (log.secondsSpent && log.secondsSpent < 59) return ''
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
    updateSecondsSpent(log, val, field) {
      this.onBlur(val, field)
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

<style scoped>
.head {
  width: 100%
}

.alarm {
  @apply bg-purple-200;
}

.year {
  min-width: 4rem;
  max-width: 5rem;
}

.tooltip-content {
  text-align: left;
}

@media screen and (min-width: 1919px) {
  .year {
    @apply w-1/5;

    min-width: 3rem;
  }

  .spinner-overlay {
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    /* background-color: rgba(0, 0, 0, 0.2); */
    z-index: 100;
    height: 100%;
  }

  /* Spinner design */
  .spinner {
    border: 6px solid #f3f3f3;
    border-top: 6px solid #3498db;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 1.5s linear infinite;
  }

  /* Spinner rotation animation */
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
