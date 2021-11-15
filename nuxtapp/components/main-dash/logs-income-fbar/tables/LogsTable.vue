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
          <EditableSelectCell :is-editable="isEditable(`${idx}-years`)" :selected-option="log.years" :options="yearOptions" @change="debounceUpdate" />
        </div>
        <div :id="`${idx}-note`" class="table-col xxl" @click="toggleEditable(`${idx}-note`, log.id)">
          <EditableTextAreaCell v-model="log.note" :is-editable="isEditable(`${idx}-note`)" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-logDate`" class="table-col sm" @click="toggleEditable(`${idx}-logDate`, log.id)">
          <EditableDateCell v-model="log.logDate" :is-editable="isEditable(`${idx}-logDate`)" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-alarmDate`" class="table-col sm" @click="toggleEditable(`${idx}-alarmDate`, log.id)">
          <EditableDateCell v-model="log.alarmDate" :is-editable="isEditable(`${idx}-alarmDate`)" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-alarmComplete`" class="table-col xs">
          <CheckIcon v-if="log.alarmComplete" class="text-green-500" />
        </div>
        <div :id="`${idx}-alarmTime`" class="table-col xs">
          {{ log.alarmTime }}
        </div>
        <div :id="`${idx}-alarmUserName`" class="table-col sm">
          {{ log.alarmUserName }}
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
import { models, mutations, priority, tabs } from '~/shared/constants'

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
    ...mapState([models.selectedClient, models.valueTypes]),
    displayedLogs () {
      let logs = []
      if (!this.showArchived) {
        logs = this.notArchived
      } else {
        logs = this.archived
      }
      return logs
    },
    notArchived () {
      if (this.logs) {
        return this.logs
          .filter(log => !log.archived)
          .reverse()
      } else {
        return null
      }
    },
    archived () {
      if (this.logs) {
        return this.logs
          .filter(log => log.archived)
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
      const data = Object.assign({}, this.selectedClient, { logs: this.logs })
      this.$store.commit(mutations.setModelResponse, { model: models.selectedClient, data })
    }
  }
}
</script>

<style scoped>

</style>
