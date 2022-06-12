<template>
  <Table @keydown.tab.prevent="onKeyDown">
    <template #header>
      <TableHeader>
        <div class="xs table-header">
          <AddRowButton @click="onAddRowClick" />
        </div>
        <div class="sm table-header">Cat</div>
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
      <TableRow
        v-for="(personal, idx) in displayedPersonals"
        :key="personal.id"
        :idx="idx"
        :class="{ disabled: !personal.include }"
      >
        <div class="table-col bg-gray-200 mr-1">
          <ClickCell>{{ idx + 1 }}</ClickCell>
        </div>
        <div :id="`${idx}-include`" class="table-col xs" @click="toggleEditable(`${idx}-include`, personal.id)">
          <EditableCheckBoxCell
            v-model="personal.include"
            :is-editable="isEditable(`${idx}-include`)"
            @input="debounceUpdate"
          />
        </div>
        <div
          :id="`${idx}-category`"
          class="sm table-col-primary"
          @click="toggleEditable(`${idx}-category`, personal.id)"
        >
          <EditableSelectCell
            v-model="personal.category"
            :is-editable="isEditable(`${idx}-category`)"
            :options="categoryOptions"
            @input="debounceUpdate"
            @blur="onBlur"
          />
        </div>
        <div :id="`${idx}-firstName`" class="normal table-col" @click="toggleEditable(`${idx}-firstName`, personal.id)">
          <EditableInputCell
            v-model="personal.firstName"
            :is-editable="isEditable(`${idx}-firstName`)"
            @input="debounceUpdate"
            @blur="onBlur"
          />
        </div>
        <div
          :id="`${idx}-middleInitial`"
          class="xs table-col"
          @click="toggleEditable(`${idx}-middleInitial`, personal.id)"
        >
          <EditableInputCell
            v-model="personal.middleInitial"
            :is-editable="isEditable(`${idx}-middleInitial`)"
            @input="debounceUpdate"
            @blur="onBlur"
          />
        </div>
        <div :id="`${idx}-lastName`" class="normal table-col" @click="toggleEditable(`${idx}-lastName`, personal.id)">
          <EditableInputCell
            v-model="personal.lastName"
            :is-editable="isEditable(`${idx}-lastName`)"
            @input="debounceUpdate"
            @blur="onBlur"
          />
        </div>
        <div :id="`${idx}-dateOfBirth`" class="table-col sm" @click="toggleEditable(`${idx}-dateOfBirth`, personal.id)">
          <EditableDateCell
            v-model="personal.dateOfBirth"
            :is-editable="isEditable(`${idx}-dateOfBirth`)"
            @input="debounceUpdate"
            @blur="onBlur"
          />
        </div>
        <div :id="`${idx}-ssn`" class="normal table-col" @click="toggleEditable(`${idx}-ssn`, personal.id)">
          <EditableInputCell
            v-model="personal.ssn"
            :class="ssnClassObj(personal.ssn, personal.include)"
            :is-editable="isEditable(`${idx}-ssn`)"
            @input="debounceUpdate"
            @blur="onBlur"
          />
        </div>
        <div :id="`${idx}-informal`" class="sm table-col" @click="toggleEditable(`${idx}-informal`, personal.id)">
          <EditableInputCell
            v-model="personal.informal"
            :is-editable="isEditable(`${idx}-informal`)"
            @input="debounceUpdate"
            @blur="onBlur"
          />
        </div>
        <div :id="`${idx}-relation`" class="sm table-col" @click="toggleEditable(`${idx}-relation`, personal.id)">
          <EditableSelectCell
            v-model="personal.relation"
            :is-editable="isEditable(`${idx}-relation`)"
            :options="relationOptions"
            @input="debounceUpdate"
            @blur="onBlur"
          />
        </div>
        <div :id="`${idx}-language`" class="sm table-col" @click="toggleEditable(`${idx}-language`, personal.id)">
          <EditableSelectCell
            v-model="personal.language"
            :is-editable="isEditable(`${idx}-language`)"
            :options="languageOptions"
            @input="debounceUpdate"
            @blur="onBlur"
          />
        </div>
        <div :id="`${idx}-delete`" class="table-col xs">
          <DeleteButton small @click="onDeleteClick(personal.id)" />
        </div>
      </TableRow>
    </template>
  </Table>
</template>

<script>
import { debounce } from 'lodash'
import { mapState } from 'vuex'
import { models, mutations, tableGroups, tabs } from '~/shared/constants'
import { searchArrOfObjs } from '~/shared/utility'

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
    }
  },
  computed: {
    ...mapState([models.selectedClient, models.valueTypes, models.search]),
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
    debounceUpdate() {
      return debounce(this.handleUpdate, 500)
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
  },
  methods: {
    toggleEditable(id, personalId) {
      this.editablePersonalId = personalId
      if (!(this.editableId === id)) {
        this.editableId = id
      }
    },
    isEditable(id) {
      return this.editableId === id
    },
    handleUpdate() {
      const personal = this.displayedPersonals.find((personal) => personal.id === this.editablePersonalId)
      if (/^([0-9]{9})$/.test(personal.ssn)) {
        personal.ssn = personal.ssn.replace(/^([0-9]{3})([0-9]{2})([0-9]{4})$/, '$1-$2-$3')
      }
      this.$api.updateTaxPersonal(
        this.headers,
        { clientId: this.clientId, personalId: this.editablePersonalId },
        personal
      )
    },
    onDeleteClick(personalId) {
      if (this.showArchived) {
        const personal = this.displayedPersonals.find((personal) => personal.id === personalId)
        personal.archived = false
        this.$api.updateTaxPersonal(this.headers, { clientId: this.clientId, personalId }, personal)
      } else {
        this.$store.commit(mutations.setModelResponse, {
          model: models.modals,
          data: { delete: { showing: true, data: { id: personalId, type: tabs.tax_personals } } },
        })
      }
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
      }
      const personal = Object.assign({}, defaultValues)
      this.$api.createTaxPersonal(this.headers, { personal }).then(async (data) => {
        await this.$api.getClientData(this.headers, this.selectedClient.id)
        this.toggleEditable(`0-${columns[0]}`, data.id)
      })
    },
    onKeyDown() {
      const currentCell = this.editableId
      const idArr = currentCell.split('-')
      const columnIndex = columns.findIndex((col) => col === idArr[1])
      if (columnIndex < columns.length - 1) {
        const nextCell = `${idArr[0]}-${columns[columnIndex + 1]}`
        this.toggleEditable(nextCell, this.editablePersonalId)
      } else if (columnIndex === columns.length - 1) {
        const row = Number(idArr[0]) + 1
        const nextCell = `${row}-${columns[0]}`
        this.toggleEditable(nextCell, this.editablePersonalId)
      }
    },
    onBlur() {
      this.editableId = ''
    },
    isRedText(ssn) {
      return ssn?.charAt(0) === '9'
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
