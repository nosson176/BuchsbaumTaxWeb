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
        <div :id="`${idx}-finished`" class="table-col xs"
          @click="toggleEditable(`${idx}-finished`, checklist.id, checklist.finished)">
          <EditableCheckBoxCell v-model="checklist.finished" :is-editable="isEditable(`${idx}-finished`)"
            @blur="onBlur(checklist.finished)" />
        </div>
        <div :id="`${idx}-translate`" class="table-col xs"
          @click="toggleEditable(`${idx}-translate`, checklist.id, checklist.translate)">
          <EditableCheckBoxCell v-model="checklist.translate" :is-editable="isEditable(`${idx}-translate`)"
            @blur="onBlur(checklist.translate)" />
        </div>
        <div :id="`${idx}-memo`" class="table-col lg"
          @click="toggleEditable(`${idx}-memo`, checklist.id, checklist.memo)">
          <EditableSelectCell v-model="checklist.memo" :options="memoOptions" :is-editable="isEditable(`${idx}-memo`)"
            @blur="onBlur(checklist.memo)" />
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
import { generateRandomId, searchArrOfObjs } from '~/shared/utility'
import { models, mutations, tableGroups, tabs } from '~/shared/constants'

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
      oldValue: '',
      updateChecklists: []
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
  beforeDestroy() {
    if (this.updateChecklists.length > 0) this.sendChecklistsToServer()
  },
  methods: {
    toggleEditable(id, checklistId, value) {
      // this.handleUpdate()
      if (!value) {
        const val = id.split("-")[1]
        const check = this.displayedChecklists.find((check) => check.id === checklistId)
        this.oldValue = check[val]
      } else this.oldValue = value
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

      const index = this.updateChecklists.findIndex(check => check.id === checklist.id)
      if (index !== -1) {
        this.updateChecklists[index] = checklist
      } else {
        this.updateChecklists.push(checklist)
      }
    },
    onBlur(val) {
      if (this.oldValue !== val) {
        this.handleUpdate()
        this.goToNextColumn()
        return
      }
      this.editableId = ''
    },
    sendChecklistsToServer() {
      this.$api.updateChecklists(this.headers, this.updateChecklists)
        .catch(() => this.$toast.error('Error updating contact'))
    },
    onAddRowClick() {
      if (!this.selectedClient) {
        return
      }
      const checklist = {
        clientId: this.selectedClient.id,
        archived: false,
        id: generateRandomId(),
      }
      const newChecklist = Object.assign({}, checklist)
      this.updateChecklists.push(newChecklist)
      this.$store.commit('pushNewChecklist', {
        state: this.selectedClient,
        newChecklist
      });
      this.toggleEditable(`0-${columns[0]}`, newChecklist.id)
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
    onDeleteClick(checklistId) {
      if (this.showArchived) {
        const checklist = this.displayedChecklists.find((checklist) => checklist.id === checklistId)
        checklist.archived = false
        this.$api.updateChecklist(this.headers, { clientId: this.selectedClient.id, checklistId }, checklist)
      } else {
        this.$store.commit(mutations.setModelResponse, {
          model: models.modals,
          data: { delete: { showing: true, data: { id: checklistId, type: tabs.checklists, label: 'checklist' } } },
        })
      }
    },
  },
}
</script>

<style scoped></style>
