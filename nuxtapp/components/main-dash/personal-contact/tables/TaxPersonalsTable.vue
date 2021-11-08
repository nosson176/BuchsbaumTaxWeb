<template>
  <Table>
    <template #header>
      <TableHeader>
        <div class="xs table-header" />
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
          <EditableSelectCell :is-editable="isEditable(`${idx}-category`)" :selected-option="personal.category" :options="categories" @change="debounceUpdate" />
        </div>
        <div :id="`${idx}-firstName`" class="normal table-col" @click="toggleEditable(`${idx}-firstName`, personal.id)">
          <EditableInputCell v-model="personal.firstName" :is-editable="isEditable(`${idx}-firstName`)" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-middleInitial`" class="xs table-col" @click="toggleEditable(`${idx}-middleInitial`, personal.id)">
          <EditableInputCell v-model="personal.middleInitial" :is-editable="isEditable(`${idx}-middleInitial`)" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-lastName`" class="normal table-col" @click="toggleEditable(`${idx}-lastName`, personal.id)">
          <EditableInputCell v-model="personal.lastName" :is-editable="isEditable(`${idx}-lastName`)" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-dateOfBirth`" class="sm table-col">
          {{ formatDate(personal.dateOfBirth) }}
        </div>
        <div :id="`${idx}-ssn`" class="normal table-col" @click="toggleEditable(`${idx}-ssn`, personal.id)">
          <EditableInputCell v-model="personal.ssn" :is-editable="isEditable(`${idx}-ssn`)" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-informal`" class="sm table-col" @click="toggleEditable(`${idx}-informal`, personal.id)">
          <EditableInputCell v-model="personal.informal" :is-editable="isEditable(`${idx}-informal`)" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-relation`" class="sm table-col">
          {{ personal.relation }}
        </div>
        <div :id="`${idx}-language`" class="sm table-col">
          {{ personal.language }}
        </div>
        <div :id="`${idx}-delete`" class="table-col xs">
          <DeleteButton />
        </div>
      </TableRow>
    </template>
  </Table>
</template>

<script>
import { debounce } from 'lodash'
import { mapState } from 'vuex'
import { models } from '~/shared/constants'
import { formatDateForTable, sortByCategory } from '~/shared/domain-utilities'

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
    ...mapState([models.selectedClient, models.valueTypes]),
    displayedPersonals () {
      let personals = []
      if (!this.showArchived) {
        personals = this.notArchived
      } else {
        personals = this.archived
      }
      return JSON.parse(JSON.stringify(personals))
    },
    notArchived () {
      if (this.selectedClient.taxPersonals) {
        return this.selectedClient.taxPersonals
          .filter(personal => !personal.archived)
          .sort((a, b) => sortByCategory(a, b))
      } else {
        return null
      }
    },
    archived () {
      if (this.selectedClient.taxPersonals) {
        return this.selectedClient.taxPersonals
          .filter(personal => personal.archived)
          .sort((a, b) => sortByCategory(a, b))
      } else {
        return null
      }
    },
    debounceUpdate () {
      return debounce(this.handleUpdate, 500)
    },
    categories () {
      return this.valueTypes.category
    }
  },
  methods: {
    formatDate (date) {
      return date ? formatDateForTable(date) : ''
    },
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
      const headers = this.$api.getHttpConfig()
      const clientId = this.selectedClient.id
      const personalId = this.editablePersonalId
      const personal = this.displayedPersonals.find(personal => personal.id === personalId)
      this.$api.updatePersonal(headers, { clientId, personalId }, personal)
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
</style>
