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
          <EditableTextAreaCell v-model="log.note" :is-editable="isEditable(`${idx}-note`)" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-logDate`" class="table-col xs" @click="toggleEditable(`${idx}-logDate`, log.id)">
          <EditableDateCell v-model="log.logDate" :is-editable="isEditable(`${idx}-logDate`)" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-alarmDate`" class="table-col xs" @click="toggleEditable(`${idx}-alarmDate`, log.id)">
          <EditableDateCell v-model="log.alarmDate" :is-editable="isEditable(`${idx}-alarmDate`)" @input="debounceUpdate" />
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
      let logs = []
      if (!this.showArchived) {
        logs = this.notArchived
      } else {
        logs = this.archived
      }
      return JSON.parse(JSON.stringify(logs))
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
      return debounce(this.handleUpdate, 500)
    }
  },
  methods: {
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
    handleUpdate () {
      const headers = this.$api.getHttpConfig()
      const clientId = this.selectedClient.id
      const logId = this.editableLogId
      const log = this.displayedLogs.find(log => log.id === logId)
      this.$api.updateLog(headers, { clientId, logId }, log)
    }
  }
}
</script>

<style scoped>

</style>
