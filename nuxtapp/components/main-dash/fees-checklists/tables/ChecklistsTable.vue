<template>
  <Table @keydown.tab.prevent="onKeyDown">
    <template #header>
      <TableHeader>
        <div class="xs table-header">
          <AddRowButton @click="onAddRowClick" />
        </div>
        <div class="table-header xs">
          T
        </div>
        <div class="table-header lg">
          Memo
        </div>
        <div class="table-header xs" />
      </TableHeader>
    </template>
    <template #body>
      <TableRow
        v-for="(checklist,idx) in displayedChecklists"
        :key="checklist.id"
        :idx="idx"
      >
        <div :id="`${idx}-finished`" class="table-col xs" @click="setEditable(`${idx}-finished`, checklist.id)">
          <EditableCheckBoxCell v-model="checklist.finished" :is-editable="isEditable(`${idx}-finished`)" @input="debounceUpdate" @blur="onBlur" />
        </div>
        <div :id="`${idx}-translate`" class="table-col xs" @click="setEditable(`${idx}-translate`, checklist.id)">
          <EditableCheckBoxCell v-model="checklist.translate" :is-editable="isEditable(`${idx}-translate`)" @input="debounceUpdate" @blur="onBlur" />
        </div>
        <div :id="`${idx}-memo`" class="table-col lg" @click="setEditable(`${idx}-memo`, checklist.id)">
          <EditableSelectCell v-model="checklist.memo" :options="memoOptions" :is-editable="isEditable(`${idx}-memo`)" @blur="onBlur" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-delete`" class="table-col xs">
          <DeleteButton @click="onDeleteClick(checklist.id)" />
        </div>
      </TableRow>
    </template>
  </Table>
</template>

<script>
import { mapState } from 'vuex'
import { debounce } from 'lodash'
import { searchArrOfObjs } from '~/shared/utility'
import { models, tableGroups } from '~/shared/constants'

const columns = [
  'finished', 'translate', 'memo', 'delete'
]

export default {
  name: 'ChecklistsTable',
  props: {
    showArchived: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      editable: '',
      editableChecklistId: ''
    }
  },
  computed: {
    ...mapState([models.valueTypes, models.selectedClient]),
    displayedChecklists () {
      const checklists = this.filteredChecklists
      return searchArrOfObjs(checklists, this.searchInput)
    },
    checklists () {
      if (this.selectedClient?.checklists) {
        return JSON.parse(JSON.stringify(this.selectedClient.checklists))
      } else {
        return null
      }
    },
    filteredChecklists () {
      if (this.checklists) {
        return this.checklists
          .filter(fee => this.showArchived === fee.archived)
      } else {
        return null
      }
    },
    searchInput () {
      return this.search?.[tableGroups.feesChecklists]
    },
    memoOptions () {
      return this.valueTypes.checklist_memo.filter(memo => memo.show)
    },
    debounceUpdate () {
      return debounce(this.handleUpdate, 500)
    },
    headers () {
      return this.$api.getHeaders()
    }
  },
  methods: {
    setEditable (editable, id) {
      this.editable = editable
      this.editableChecklistId = id
    },
    isEditable (editable) {
      return this.editable === editable
    },
    handleUpdate () {
      const checklist = this.displayedChecklists.find(checklist => checklist.id === this.editableChecklistId)
      this.$api.updateChecklist(this.headers, { checklistId: this.editableChecklistId }, checklist)
    },
    onBlur () {
      this.editable = ''
    },
    onAddRowClick () {

    },
    onKeyDown () {
      const currentCell = this.editable
      const idArr = currentCell.split('-')
      const columnIndex = columns.findIndex(col => col === idArr[1])
      if (columnIndex < columns.length - 1) {
        const nextCell = `${idArr[0]}-${columns[columnIndex + 1]}`
        this.setEditable(nextCell, this.editableChecklistId)
      }
    }
  }
}
</script>

<style scoped>

</style>
