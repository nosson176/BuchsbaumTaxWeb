<template>
  <Table @keydown.tab.prevent @keyup.tab.exact="goToNextColumn" @keyup.shift.tab.exact="goToPrevColumn">
    <template #header>
      <TableHeader>
        <div class="xs table-header">
          <AddRowButton @click="onAddRowClick" />
        </div>
        <div class="table-header xs">T</div>
        <div class="table-header lg">Memo</div>
        <div class="table-header xs" />
      </TableHeader>
    </template>
    <template #body>
      <TableRow v-for="(checklist, idx) in displayedChecklists" :key="checklist.id" :idx="idx">
        <div :id="`${idx}-finished`" class="table-col xs" @click="toggleEditable(`${idx}-finished`, checklist.id)">
          <EditableCheckBoxCell
            v-model="checklist.finished"
            :is-editable="isEditable(`${idx}-finished`)"
            @blur="onBlur"
          />
        </div>
        <div :id="`${idx}-translate`" class="table-col xs" @click="toggleEditable(`${idx}-translate`, checklist.id)">
          <EditableCheckBoxCell
            v-model="checklist.translate"
            :is-editable="isEditable(`${idx}-translate`)"
            @blur="onBlur"
          />
        </div>
        <div :id="`${idx}-memo`" class="table-col lg" @click="toggleEditable(`${idx}-memo`, checklist.id)">
          <EditableSelectCell
            v-model="checklist.memo"
            :options="memoOptions"
            :is-editable="isEditable(`${idx}-memo`)"
            @blur="onBlur"
          />
        </div>
        <div :id="`${idx}-delete`" class="table-col xs">
          <DeleteButton small @click="onDeleteClick(checklist.id)" />
        </div>
      </TableRow>
    </template>
  </Table>
</template>

<script>
import { mapState } from 'vuex'
import { searchArrOfObjs } from '~/shared/utility'
import { models, tableGroups } from '~/shared/constants'

const columns = ['finished', 'translate', 'memo', 'delete']

export default {
  name: 'ChecklistsTable',
  props: {
    showArchived: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      editableId: '',
      newChecklistId: NaN,
      editableChecklistId: '',
    }
  },
  computed: {
    ...mapState([models.valueTypes, models.selectedClient]),
    displayedChecklists() {
      const checklists = this.filteredChecklists
      const newChecklistIdx = checklists?.findIndex((checklist) => checklist.id === this.newChecklistId)
      if (newChecklistIdx > -1) {
        const tempChecklist = checklists[newChecklistIdx]
        checklists.splice(newChecklistIdx, 1)
        checklists.unshift(tempChecklist)
      }
      return searchArrOfObjs(checklists, this.searchInput)
    },
    checklists() {
      if (this.selectedClient?.checklists) {
        return JSON.parse(JSON.stringify(this.selectedClient.checklists))
      } else {
        return null
      }
    },
    filteredChecklists() {
      if (this.checklists) {
        return this.checklists.filter((fee) => this.showArchived === fee.archived)
      } else {
        return null
      }
    },
    searchInput() {
      return this.search?.[tableGroups.feesChecklists]
    },
    memoOptions() {
      return this.valueTypes.checklist_memo.filter((memo) => memo.show)
    },
    headers() {
      return this.$api.getHeaders()
    },
  },
  methods: {
    toggleEditable(id, checklistId) {
      this.handleUpdate()
      this.editableChecklistId = checklistId
      if (!(this.editableId === id)) {
        this.editableId = id
      }
    },
    isEditable(editableId) {
      return this.editableId === editableId
    },
    handleUpdate() {
      if (!this.editableChecklistId) return
      const checklist = this.displayedChecklists.find((checklist) => checklist.id === this.editableChecklistId)
      this.$api.updateChecklist(
        this.headers,
        { clientId: this.selectedClient.id, checklistId: this.editableChecklistId },
        checklist
      )
    },
    onBlur() {
      this.handleUpdate()
      this.editableId = ''
    },
    onAddRowClick() {
      if (!this.selectedClient) {
        return
      }
      const checklist = {
        clientId: this.selectedClient.id,
      }
      this.$api.createChecklist(this.headers, { checklist }).then(async (data) => {
        await this.$api.getClientData(this.headers, this.selectedClient.id)
        this.newChecklistId = data.id
        this.toggleEditable(`0-${columns[0]}`, data.id)
      })
    },
    goToNextColumn() {
      const currentCell = this.editableId
      const idArr = currentCell.split('-')
      const columnIndex = columns.findIndex((col) => col === idArr[1])
      const currentRow = Number(idArr[0])
      if (columnIndex < columns.length - 1) {
        const nextCell = `${currentRow}-${columns[columnIndex + 1]}`
        this.toggleEditable(nextCell, this.editableChecklistId)
      } else if (columnIndex === columns.length - 1 && currentRow < this.displayedChecklists.length - 1) {
        const nextRow = currentRow + 1
        const nextCell = `${nextRow}-${columns[0]}`
        this.toggleEditable(nextCell, this.editableChecklistId)
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
  },
}
</script>

<style scoped></style>
