<template>
  <Table>
    <template #header>
      <TableHeader>
        <div class="xs table-header">
          <AddRowButton @click="onAddRowClick" />
        </div>
        <div class="sm table-header">
          Cat
        </div>
        <div class="normal table-header">
          First
        </div>
        <div class="xs table-header">
          M
        </div>
        <div class="normal table-header">
          Last
        </div>
        <div class="sm table-header">
          DOB
        </div>
        <div class="normal table-header">
          SSN
        </div>
        <div class="sm table-header">
          Informal
        </div>
        <div class="sm table-header">
          Relation
        </div>
        <div class="sm table-header">
          Lang
        </div>
        <div class="xs table-header" />
      </TableHeader>
    </template>
    <template #body>
      <TableRow
        v-for="(personal, idx) in displayedPersonals"
        :key="personal.id"
        :idx="idx"
      >
        <div :id="`${idx}-include`" class="xs table-col">
          <div class="flex items-center h-5">
            <input
              id="include"
              :checked="personal.include"
              name="include"
              type="checkbox"
              class="pointer-events-none focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            >
          </div>
        </div>
        <div :id="`${idx}-category`" class="sm table-col-primary" @click="toggleEditable(`${idx}-category`, personal.id)">
          <EditableSelectCell v-model="personal.category" :is-editable="isEditable(`${idx}-category`)" :options="categoryOptions" @input="debounceUpdate" @blur="onBlur" />
        </div>
        <div :id="`${idx}-firstName`" class="normal table-col" @click="toggleEditable(`${idx}-firstName`, personal.id)">
          <EditableInputCell v-model="personal.firstName" :is-editable="isEditable(`${idx}-firstName`)" @input="debounceUpdate" @blur="onBlur" />
        </div>
        <div :id="`${idx}-middleInitial`" class="xs table-col" @click="toggleEditable(`${idx}-middleInitial`, personal.id)">
          <EditableInputCell v-model="personal.middleInitial" :is-editable="isEditable(`${idx}-middleInitial`)" @input="debounceUpdate" @blur="onBlur" />
        </div>
        <div :id="`${idx}-lastName`" class="normal table-col" @click="toggleEditable(`${idx}-lastName`, personal.id)">
          <EditableInputCell v-model="personal.lastName" :is-editable="isEditable(`${idx}-lastName`)" @input="debounceUpdate" @blur="onBlur" />
        </div>
        <div :id="`${idx}-dateOfBirth`" class="table-col sm" @click="toggleEditable(`${idx}-dateOfBirth`, personal.id)">
          <EditableDateCell v-model="personal.dateOfBirth" :is-editable="isEditable(`${idx}-dateOfBirth`)" @input="debounceUpdate" @blur="onBlur" />
        </div>
        <div :id="`${idx}-ssn`" class="normal table-col" @click="toggleEditable(`${idx}-ssn`, personal.id)">
          <EditableInputCell v-model="personal.ssn" :is-editable="isEditable(`${idx}-ssn`)" @input="debounceUpdate" @blur="onBlur" />
        </div>
        <div :id="`${idx}-informal`" class="sm table-col" @click="toggleEditable(`${idx}-informal`, personal.id)">
          <EditableInputCell v-model="personal.informal" :is-editable="isEditable(`${idx}-informal`)" @input="debounceUpdate" @blur="onBlur" />
        </div>
        <div :id="`${idx}-relation`" class="sm table-col" @click="toggleEditable(`${idx}-relation`, personal.id)">
          <EditableSelectCell v-model="personal.relation" :is-editable="isEditable(`${idx}-relation`)" :options="relationOptions" @input="debounceUpdate" @blur="onBlur" />
        </div>
        <div :id="`${idx}-language`" class="sm table-col" @click="toggleEditable(`${idx}-language`, personal.id)">
          <EditableSelectCell v-model="personal.language" :is-editable="isEditable(`${idx}-language`)" :options="languageOptions" @input="debounceUpdate" @blur="onBlur" />
        </div>
        <div :id="`${idx}-delete`" class="table-col xs">
          <DeleteButton @click="onDeleteClick(personal.id)" />
        </div>
      </TableRow>
    </template>
  </Table>
</template>

<script>
import { debounce } from 'lodash'
import { mapState } from 'vuex'
import { models, mutations, tabs } from '~/shared/constants'
import { sortByCategory } from '~/shared/domain-utilities'
import { searchArrOfObjs } from '~/shared/utility'

const taxPersonalConstructor = {
  clientId: NaN,
  category: '',
  include: true,
  language: '',
  relation: '',
  firstName: '',
  middleInitial: '',
  lastName: '',
  dateOfBirth: '',
  ssn: '000-000-000',
  informal: '',
  archived: false
}

export default {
  name: 'TaxPersonalsTable',
  props: {
    showArchived: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      editableId: '',
      editablePersonalId: ''
    }
  },
  computed: {
    ...mapState([models.selectedClient, models.valueTypes, models.search]),
    displayedPersonals () {
      let personals = []
      if (!this.showArchived) {
        personals = this.notArchived
      } else {
        personals = this.archived
      }
      return searchArrOfObjs(personals, this.searchInput)
    },
    notArchived () {
      if (this.taxPersonals) {
        return this.taxPersonals
          .filter(personal => !personal.archived)
          .sort((a, b) => sortByCategory(a, b))
      } else {
        return null
      }
    },
    archived () {
      if (this.taxPersonals) {
        return this.taxPersonals
          .filter(personal => personal.archived)
          .sort((a, b) => sortByCategory(a, b))
      } else {
        return null
      }
    },
    debounceUpdate () {
      return debounce(this.handleUpdate, 500)
    },
    categoryOptions () {
      return this.valueTypes.category.filter(category => category.show)
    },
    languageOptions () {
      return this.valueTypes.language.filter(language => language.show)
    },
    relationOptions () {
      return this.valueTypes.relation.filter(relation => relation.show)
    },
    headers () {
      return this.$api.getHttpConfig()
    },
    clientId () {
      return this.selectedClient.id
    },
    taxPersonals () {
      if (this.selectedClient.taxPersonals) {
        return JSON.parse(JSON.stringify(this.selectedClient.taxPersonals))
      } else {
        return null
      }
    },
    searchInput () {
      return this.search?.personalContact
    }
  },
  methods: {
    toggleEditable (id, personalId) {
      this.editablePersonalId = personalId
      if (!(this.editableId === id)) {
        this.editableId = id
      }
    },
    isEditable (id) {
      return this.editableId === id
    },
    handleUpdate () {
      const personal = this.displayedPersonals.find(personal => personal.id === this.editablePersonalId)
      this.$api.updateTaxPersonal(this.headers, { clientId: this.clientId, personalId: this.editablePersonalId }, personal)
    },
    onDeleteClick (personalId) {
      if (this.showArchived) {
        const personal = this.displayedPersonals.find(personal => personal.id === personalId)
        personal.archived = false
        this.$api.updateTaxPersonal(this.headers, { clientId: this.clientId, personalId }, personal)
          .then(() => {
            this.updateClient(personalId, personal)
          })
      } else {
        this.$store.commit(
          mutations.setModelResponse,
          { model: models.modals, data: { delete: { showing: true, data: { id: personalId, type: tabs.tax_personals } } } }
        )
      }
    },
    updateClient (personalId, personal) {
      const taxPersonalIndex = this.taxPersonals.findIndex(taxPersonal => taxPersonal.id === personalId)
      this.taxPersonals[taxPersonalIndex] = personal
      this.updateStoreObject()
    },
    onAddRowClick () {
      const headers = this.$api.getHttpConfig()
      const clientId = this.selectedClient.id
      const defaultValues = {
        clientId,
        category: this.categoryOptions[2].value,
        language: this.languageOptions[0].value,
        relation: this.relationOptions[0].value,
        dateOfBirth: new Date(),
        archived: this.showArchived
      }
      const personal = Object.assign({}, taxPersonalConstructor, defaultValues)
      this.$api.createTaxPersonal(headers, { clientId, personal })
        .then(() => {
          this.addRowOnClient(personal)
        })
    },
    addRowOnClient (personal) {
      this.taxPersonals.push(personal)
      this.updateStoreObject()
      this.$nextTick(() => {
        this.toggleEditable(`${this.displayedPersonals.length - 1}-category`, personal.id)
      })
    },
    updateStoreObject () {
      const data = Object.assign({}, this.selectedClient, { taxPersonals: this.taxPersonals })
      this.$store.commit(mutations.setModelResponse, { model: models.selectedClient, data })
    },
    onBlur () {
      this.editableId = ''
    }
  }
}
</script>

<style scoped>
.header {
  @apply px-1 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider;
}

.table-col {
  @apply px-1 py-1 whitespace-nowrap text-sm text-gray-500;
}

.table-primary-table-col {
  @apply px-1 py-1 whitespace-nowrap text-sm font-medium text-gray-900;
}

.edit-mode {
  @apply relative z-10 overflow-visible -mt-3.5;
}

.read-mode {
  @apply overflow-hidden overflow-ellipsis;
}
</style>
