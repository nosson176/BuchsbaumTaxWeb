<template>
  <Table @keydown.tab.prevent @keyup.tab.exact="goToNextColumn" @keyup.shift.tab.exact="goToPrevColumn">
    <template #header>
      <TableHeader>
        <div class="table-header">
          <AddRowButton @click="onAddRowClick" />
        </div>
        <div class="table-header xs"></div>
        <div class="sm table-header">Cat</div>
        <div class="xs table-header"></div>
        <div class="normal table-header">First</div>
        <div class="xs table-header">M</div>
        <div class="normal table-header">Last</div>
        <div class="sm table-header">DOB</div>
        <div class="normal table-header">SSN</div>
        <div class="sm table-header">Informal</div>
        <div class="sm table-header">Relation</div>
        <div class="sm table-header">Lang</div>
        <div class="xs table-header" />
      </TableHeader>
    </template>
    <template #body>
      <TableRow v-for="(personal, idx) in displayedPersonals" :key="personal.id" :idx="idx"
        :selected="isSelected(personal.id)" :class="{ disabled: !personal.include }">
        <div class="table-col bg-gray-200 mr-1">
          <ClickCell @click="toggleSelected(personal)">{{ idx + 1 }}</ClickCell>
        </div>
        <div :id="`${idx}-include`" class="table-col xs" @click="toggleEditable(`${idx}-include`, personal.id)">
          <EditableCheckBoxCell v-model="personal.include" :is-editable="isEditable(`${idx}-include`)"
            @input="handleUpdate" />
        </div>
        <div :id="`${idx}-category`" class="sm table-col-primary"
          @click="toggleEditable(`${idx}-category`, personal.id, personal.category)">
          <EditableSelectCell v-model="personal.category" :is-editable="isEditable(`${idx}-category`)"
            :options="categoryOptions" @blur="onBlur(personal.category)" />
        </div>
        <div class="table-col xs">
          <button v-if="isPriSec(personal)" @click="irsPopup">
            <GlobeIcon class="w-4 h-4 text-indigo-500" />
          </button>
        </div>
        <div :id="`${idx}-firstName`" class="normal table-col"
          @click="toggleEditable(`${idx}-firstName`, personal.id, personal.firstName)">
          <EditableInputCell v-model="personal.firstName" @keyup.enter.native="onBlur(personal.firstName)"
            :is-editable="isEditable(`${idx}-firstName`)" @blur="onBlur(personal.firstName)" />
        </div>
        <div :id="`${idx}-middleInitial`" class="xs table-col"
          @click="toggleEditable(`${idx}-middleInitial`, personal.id, personal.middleInitial)">
          <EditableInputCell v-model="personal.middleInitial" @keyup.enter.native="onBlur(personal.middleInitial)"
            :is-editable="isEditable(`${idx}-middleInitial`)" @blur="onBlur(personal.middleInitial)" />
        </div>
        <div :id="`${idx}-lastName`" class="normal table-col"
          @click="toggleEditable(`${idx}-lastName`, personal.id, personal.lastName)">
          <EditableInputCell v-model="personal.lastName" @keyup.enter.native="onBlur(personal.lastName)"
            :is-editable="isEditable(`${idx}-lastName`)" @blur="onBlur(personal.lastName)" />
        </div>
        <div :id="`${idx}-dateOfBirth`" class="table-col sm"
          @click="toggleEditable(`${idx}-dateOfBirth`, personal.id, personal.dateOfBirth)">
          <EditableDateCell v-model="personal.dateOfBirth" :is-editable="isEditable(`${idx}-dateOfBirth`)"
            @blur="onBlur(personal.dateOfBirth)" />
        </div>
        <div :id="`${idx}-ssn`" class="normal table-col"
          @click="toggleEditable(`${idx}-ssn`, personal.id, personal.ssn)">
          <EditableInputCell v-model="personal.ssn" @keyup.enter.native="onBlur(personal.ssn)"
            :class="ssnClassObj(personal.ssn, personal.include)" :is-editable="isEditable(`${idx}-ssn`)"
            @blur="onBlur(personal.ssn)" />
        </div>
        <div :id="`${idx}-informal`" class="sm table-col"
          @click="toggleEditable(`${idx}-informal`, personal.id, personal.informal)">
          <EditableInputCell v-model="personal.informal" @keyup.enter.native="onBlur(personal.informal)"
            :is-editable="isEditable(`${idx}-informal`)" @blur="onBlur(personal.informal)" />
        </div>
        <div :id="`${idx}-relation`" class="sm table-col"
          @click="toggleEditable(`${idx}-relation`, personal.id, personal.relation)">
          <EditableSelectCell v-model="personal.relation" :is-editable="isEditable(`${idx}-relation`)"
            :options="relationOptions" @blur="onBlur(personal.relation)" />
        </div>
        <div :id="`${idx}-language`" class="sm table-col"
          @click="toggleEditable(`${idx}-language`, personal.id, personal.language)">
          <EditableSelectCell v-model="personal.language" :is-editable="isEditable(`${idx}-language`)"
            :options="languageOptions" @blur="onBlur(personal.language)" />
        </div>
        <div :id="`${idx}-delete`" class="table-col xs">
          <DeleteButton small @click="onDeleteClick(personal)" />
        </div>
      </TableRow>
    </template>
  </Table>
</template>

<script>
import { mapState } from 'vuex'
import { categories, models, tableGroups } from '~/shared/constants'
import { generateRandomId, searchArrOfObjs } from '~/shared/utility'

const columns = [
  'include',
  'category',
  'firstName',
  'middleInitial',
  'lastName',
  'dateOfBirth',
  'ssn',
  'informal',
  'relation',
  'language',
  'delete',
]

export default {
  name: 'TaxPersonalsTable',
  props: {
    showArchived: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      editableId: '',
      newPersonalId: NaN,
      editablePersonalId: '',
      oldValue: '',
      selectedItems: {},
      updateTaxPersonal: []
    }
  },
  computed: {
    ...mapState([models.selectedClient, models.valueTypes, models.search, models.cmdPressed]),
    displayedPersonals() {
      const personals = this.filteredPersonals
      return searchArrOfObjs(personals, this.searchInput)
    },
    filteredPersonals() {
      if (this.taxPersonals) {
        return this.taxPersonals.filter((personal) => this.showArchived === personal.archived)
      } else {
        return null
      }
    },
    categoryOptions() {
      return this.valueTypes.category.filter((category) => category.show)
    },
    languageOptions() {
      return this.valueTypes.language.filter((language) => language.show)
    },
    relationOptions() {
      return this.valueTypes.relation.filter((relation) => relation.show)
    },
    headers() {
      return this.$api.getHeaders()
    },
    clientId() {
      return this.selectedClient.id
    },
    taxPersonals() {
      if (this.selectedClient.taxPersonals) {
        return JSON.parse(JSON.stringify(this.selectedClient.taxPersonals))
      } else {
        return null
      }
    },
    searchInput() {
      return this.search?.[tableGroups.personalContact]
    },
    isCmdPressed() {
      return this.cmdPressed && !Array.isArray(this.cmdPressed)
    },
    isCopyingPersonals() {
      return this.isCmdPressed && this.selectedPersonalIds.length > 0
    },
    selectedPersonalIds() {
      return Object.keys(this.selectedItems).filter((id) => this.selectedItems[id])
    },
  },
  beforeDestroy() {
    if (this.updateTaxPersonal.length > 0) this.sendUpdateTaxPersonal()
  },
  methods: {
    toggleEditable(id, personalId, value) {
      if (!value) {
        const val = id.split("-")[1]
        const personal = this.displayedPersonals.find((personal) => personal.id === personalId)
        this.oldValue = personal[val]
      } else this.oldValue = value
      this.editablePersonalId = personalId
      if (!(this.editableId === id)) {
        this.editableId = id
      }
    },
    isEditable(id) {
      return this.editableId === id
    },
    toggleSelected(personal) {
      this.selectedItems[personal.id] = !this.selectedItems[personal.id]
      this.selectedItems = Object.assign({}, this.selectedItems)
    },
    isSelected(personalId) {
      return this.selectedItems[personalId]
    },
    handleUpdate() {
      if (!this.editablePersonalId) return
      const personal = this.displayedPersonals.find((personal) => personal.id === this.editablePersonalId)
      if (/^([0-9]{9})$/.test(personal.ssn)) {
        personal.ssn = personal.ssn.replace(/^([0-9]{3})([0-9]{2})([0-9]{4})$/, '$1-$2-$3')
      }
      const index = this.updateTaxPersonal.findIndex(per => per.id === personal.id)
      if (index !== -1) {
        this.updateTaxPersonal[index] = personal
      } else {
        this.updateTaxPersonal.push(personal)
      }
    },
    sendUpdateTaxPersonal() {
      this.$api.updateTaxPersonals(this.headers, this.updateTaxPersonal)
        .catch(() => this.$toast.error('Error updating contact'))
    },
    onDeleteClick(personalObj) {
      const personal = this.displayedPersonals.find((personal) => personal.id === personalObj.id)
      if (this.showArchived) {
        personal.archived = false
      } else {
        personal.archived = true
      }
      const index = this.updateTaxPersonal.findIndex(c => c.id === personal.id)
      if (index !== -1) {
        this.updateTaxPersonal[index] = personal
      } else {
        this.updateTaxPersonal.push(personal)
      }

      this.$store.dispatch('updateTaxPersonalAction', { personal });
    },
    updateClient(personalId, personal) {
      const taxPersonalIndex = this.taxPersonals.findIndex((taxPersonal) => taxPersonal.id === personalId)
      this.taxPersonals[taxPersonalIndex] = personal
      this.updateStoreObject()
    },
    onAddRowClick() {
      if (!this.selectedClient) {
        return
      }
      const clientId = this.selectedClient.id
      const defaultValues = {
        clientId,
        lastName: this.selectedClient.lastName.replace(/[0-9]/g, ''),
        include: true,
        archived: false,
        id: generateRandomId(),
      }
      if (this.isCopyingPersonals) {
        this.selectedPersonalIds.forEach((personalId, idx) => {
          const personalIndex = this.displayedPersonals.findIndex((personal) => personal.id === Number(personalId))
          const personal = this.displayedPersonals[personalIndex]
          const newPersonal = Object.assign({}, personal)
          newPersonal.id = generateRandomId()
          this.updateTaxPersonal.push(newPersonal)
          this.$store.commit('pushNewTaxPersonal', {
            state: this.selectedClient,
            taxPersonal: newPersonal
          });
          this.toggleEditable(`${personalIndex}-${columns[0]}`, newPersonal.id)
        })
      } else {
        const personal = Object.assign({}, defaultValues)
        this.updateTaxPersonal.push(personal)
        this.$store.commit('pushNewTaxPersonal', {
          state: this.selectedClient,
          personal
        });
        this.toggleEditable(`0-${columns[0]}`, personal.id)
      }
    },
    goToNextColumn() {
      const currentCell = this.editableId
      const idArr = currentCell.split('-')
      const columnIndex = columns.findIndex((col) => col === idArr[1])
      const currentRow = Number(idArr[0])
      if (columnIndex < columns.length - 1) {
        const nextCell = `${currentRow}-${columns[columnIndex + 1]}`
        this.toggleEditable(nextCell, this.editablePersonalId)
      } else if (columnIndex === columns.length - 1 && currentRow < this.displayedPersonals.length - 1) {
        const nextRow = currentRow + 1
        const nextCell = `${nextRow}-${columns[0]}`
        this.toggleEditable(nextCell, this.editablePersonalId)
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
    onBlur(val) {
      if (this.oldValue !== val) {
        this.handleUpdate()
        this.goToNextColumn()
        return
      }
      this.editableId = ""
    },
    isRedText(ssn) {
      return ssn?.charAt(0) === '9'
    },
    isPriSec(personal) {
      return personal.category === categories.primary || personal.category === categories.secondary
    },
    irsPopup() {
      window.open('https://sa.www4.irs.gov/irfof/lang/en/irfofgetstatus.jsp', 'popup', 'width=770,height=770')
    },
    ssnClassObj(ssn, include) {
      if (this.isRedText(ssn) && include) {
        return 'text-red-500'
      } else if (this.isRedText(ssn) && !include) {
        return 'text-red-200'
      } else {
        return ''
      }
    },
  },
}
</script>

<style scoped></style>
