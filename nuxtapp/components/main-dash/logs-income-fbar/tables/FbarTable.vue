<template>
  <Table @keydown.tab.prevent="onKeyDown">
    <template #header>
      <TableHeader>
        <div class="xs table-header">
          <AddRowButton @click="onAddRowClick" />
        </div>
        <div class="table-header sm">
          Year
        </div>
        <div class="table-header xs">
          Cat
        </div>
        <div class="table-header  normal">
          Group
        </div>
        <div class="table-header normal">
          Type
        </div>
        <div class="table-header sm">
          Job
        </div>
        <div class="table-header normal">
          Amt
        </div>
        <div class="table-header sm">
          Curr
        </div>
        <div class="table-header xs">
          X
        </div>
        <div class="table-header xs">
          $
        </div>
        <div class="table-header sm">
          Doc
        </div>
        <div class="table-header lg">
          Description
        </div>
        <div class="table-header sm">
          Depend
        </div>
        <div class="table-header xs" />
      </TableHeader>
    </template>
    <template #body>
      <TableRow
        v-for="(fbar, idx) in displayedFbars"
        :key="fbar.id"
        :idx="idx"
      >
        <div :id="`${idx}-include`" class="table-col xs">
          <CheckBoxToDisplayTrueFalse
            id="include"
            :checked="fbar.include"
            name="disabled"
            disabled
          />
        </div>
        <div :id="`${idx}-years`" class="table-col-primary sm" @click="toggleEditable(`${idx}-years`, fbar.id)">
          <EditableSelectCell v-model="fbar.years" :is-editable="isEditable(`${idx}-years`)" :options="yearNameOptions" @blur="onBlur" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-category`" class="table-col xs" @click="toggleEditable(`${idx}-category`, fbar.id)">
          <EditableSelectCell v-model="fbar.category" :is-editable="isEditable(`${idx}-category`)" :options="categoryOptions" @blur="onBlur" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-taxGroup`" class="table-col normal" @click="toggleEditable(`${idx}-taxGroup`, fbar.id)">
          <EditableSelectCell v-model="fbar.taxGroup" :is-editable="isEditable(`${idx}-taxGroup`)" :options="taxGroupOptions" @blur="onBlur" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-taxType`" class="table-col normal" @click="toggleEditable(`${idx}-taxType`, fbar.id)">
          <EditableSelectCell v-model="fbar.taxType" :is-editable="isEditable(`${idx}-taxType`)" :options="taxTypeOptions" @blur="onBlur" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-job`" class="table-col sm" @click="toggleEditable(`${idx}-job`, fbar.id)">
          <EditableSelectCell v-model="fbar.job" :is-editable="isEditable(`${idx}-job`)" :options="jobOptions" @blur="onBlur" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-amount`" class="normal table-col" @click="toggleEditable(`${idx}-amount`, fbar.id)">
          <EditableInputCell v-model="fbar.amount" :is-editable="isEditable(`${idx}-amount`)" is-currency @blur="onBlur" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-currency`" class="table-col sm" @click="toggleEditable(`${idx}-currency`, fbar.id)">
          <EditableSelectCell v-model="fbar.currency" :is-editable="isEditable(`${idx}-currency`)" :options="currencyOptions" @blur="onBlur" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-frequency`" class="table-col xs">
          {{ fbar.frequency || '' }}
        </div>
        <div :id="`${idx}-$`" class="table-col xs">
          $
        </div>
        <div :id="`${idx}-documents`" class="table-col sm">
          {{ fbar.documents }}
        </div>
        <div :id="`${idx}-description`" class="table-col lg">
          {{ fbar.description }}
        </div>
        <div :id="`${idx}-depend`" class="table-col sm">
          {{ fbar.depend }}
        </div>
        <div :id="`${idx}-delete`" class="table-col xs">
          <DeleteButton @click="onDeleteClick(fbar.id)" />
        </div>
      </TableRow>
    </template>
  </Table>
</template>

<script>
import { debounce } from 'lodash'
import { mapState } from 'vuex'
import { models, mutations, tabs } from '~/shared/constants'

const columns = [
  'include', 'years', 'category', 'taxGroup', 'taxType', 'job', 'amount', 'currency', 'frequency', '$', 'documents', 'description', 'depend', 'delete'
]
const fbarBreakdownsConstructor = {
  clientId: NaN,
  years: '',
  category: '',
  taxGroup: '',
  taxType: '',
  part: '',
  currency: '',
  frequency: 0,
  documents: '',
  description: '',
  amount: 0,
  depend: '',
  include: true,
  archived: false
}

export default {
  name: 'FbarTable',
  props: {
    showArchived: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      editableId: '',
      editableFbarId: ''
    }
  },
  computed: {
    ...mapState([models.selectedClient, models.valueTypes, models.valueTaxGroups]),
    displayedFbars () {
      let fbar = []
      if (!this.showArchived) {
        fbar = this.notArchived
      } else {
        fbar = this.archived
      }
      return fbar
    },
    notArchived () {
      if (this.fbarBreakdowns) {
        return this.fbarBreakdowns
          .filter(fbar => !fbar.archived)
          .sort((a, b) => b.years - a.years)
      } else {
        return null
      }
    },
    archived () {
      if (this.fbarBreakdowns) {
        return this.fbarBreakdowns
          .filter(fbar => fbar.archived)
          .sort((a, b) => b.years - a.years)
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
    yearNameOptions () {
      return this.valueTypes.year_name.filter(yearName => yearName.show)
    },
    taxTypeOptions () {
      return this.valueTypes.tax_type.filter(taxType => taxType.show)
    },
    jobOptions () {
      return this.valueTypes.job.filter(job => job.show)
    },
    currencyOptions () {
      return this.valueTypes.currency.filter(currency => currency.show)
    },
    taxGroupOptions () {
      return Object.values(this.valueTaxGroups).filter(taxGroup => taxGroup.show)
    },
    headers () {
      return this.$api.getHttpConfig()
    },
    clientId () {
      return this.selectedClient.id
    },
    fbarBreakdowns () {
      if (this.selectedClient.fbarBreakdowns) {
        return JSON.parse(JSON.stringify(this.selectedClient.fbarBreakdowns))
      } else {
        return null
      }
    }
  },
  methods: {
    toggleEditable (id, fbarId) {
      this.editableFbarId = fbarId
      if (!(this.editableId === id)) {
        this.editableId = id
      }
    },
    isEditable (id) {
      return this.editableId === id
    },
    handleUpdate () {
      const fbar = this.displayedFbars.find(fbar => fbar.id === this.editableFbarId)
      this.$api.updateFbar(this.headers, { clientId: this.clientId, fbarId: this.editableFbarId }, fbar)
    },
    onDeleteClick (fbarId) {
      if (this.showArchived) {
        const fbar = this.displayedFbars.find(fbar => fbar.id === fbarId)
        fbar.archived = false
        this.$api.updateFbar(this.headers, { clientId: this.clientId, fbarId }, fbar)
          .then(() => {
            this.updateClient(fbarId, fbar)
          })
      } else {
        this.$store.commit(
          mutations.setModelResponse,
          { model: models.modals, data: { delete: { showing: true, data: { id: fbarId, type: tabs.fbar } } } }
        )
      }
    },
    updateClient (fbarId, fbar) {
      const fbarIndex = this.fbarBreakdowns.findIndex(fbar => fbar.id === fbarId)
      this.fbarBreakdowns[fbarIndex] = fbar
      this.updateStoreObject()
    },
    onAddRowClick () {
      const headers = this.$api.getHttpConfig()
      const clientId = this.selectedClient.id
      const defaultValues = {
        clientId,
        category: this.categoryOptions[2].value,
        years: this.yearNameOptions[0].value,
        taxType: this.taxTypeOptions[0].value,
        taxGroup: this.taxGroupOptions[0].value,
        job: this.jobOptions[0].value,
        currency: this.currencyOptions[0].value
      }
      const fbar = Object.assign({}, fbarBreakdownsConstructor, defaultValues)
      this.$api.createFbar(headers, { clientId, fbar })
        .then(() => {
          this.addRowOnClient(fbar)
        })
    },
    addRowOnClient (fbar) {
      this.fbarBreakdowns.push(fbar)
      this.updateStoreObject()
      this.$nextTick(() => {
        this.toggleEditable(`${this.displayedFbars.length - 1}-years`, fbar.id)
      })
    },
    updateStoreObject () {
      const data = Object.assign({}, this.selectedClient, { fbarBreakdowns: this.fbarBreakdowns })
      this.$store.commit(mutations.setModelResponse, { model: models.selectedClient, data })
    },
    onKeyDown () {
      const currentCell = this.editableId
      const idArr = currentCell.split('-')
      const columnIndex = columns.findIndex(col => col === idArr[1])
      if (columnIndex < columns.length - 1) {
        const nextCell = `${idArr[0]}-${columns[columnIndex + 1]}`
        this.toggleEditable(nextCell, this.editableFbarId)
      }
    },
    onBlur () {
      this.editableId = ''
    }
  }
}
</script>

<style scoped>

</style>
