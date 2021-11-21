<template>
  <Table @keydown.tab.prevent="onKeyDown">
    <template #header>
      <TableHeader>
        <div class="table-header xs" />
        <div class="table-header sm">
          Year
        </div>
        <div class="table-header xs">
          Cat
        </div>
        <div class="table-header  normal">
          Group
        </div>
        <div class="table-header xs">
          Ex
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
        v-for="(income, idx) in displayedIncome"
        :key="income.id"
        :idx="idx"
      >
        <div :id="`${idx}-include`" class="table-col xs">
          <CheckBoxToDisplayTrueFalse
            id="include"
            :checked="income.include"
            name="disabled"
            disabled
          />
        </div>
        <div :id="`${idx}-years`" class="table-col-primary sm" @click="toggleEditable(`${idx}-years`, income.id)">
          <EditableSelectCell :is-editable="isEditable(`${idx}-years`)" :selected-option="income.years" :options="yearNameOptions" @change="debounceUpdate" />
        </div>
        <div :id="`${idx}-category`" class="table-col xs" @click="toggleEditable(`${idx}-category`, income.id)">
          <EditableSelectCell :is-editable="isEditable(`${idx}-category`)" :selected-option="income.category" :options="categoryOptions" @change="debounceUpdate" />
        </div>
        <div :id="`${idx}-taxGroup`" class="table-col normal" @click="toggleEditable(`${idx}-taxGroup`, income.id)">
          <EditableSelectCell :is-editable="isEditable(`${idx}-taxGroup`)" :selected-option="income.taxGroup" :options="taxGroupOptions" @change="debounceUpdate" />
        </div>
        <div :id="`${idx}-exclusion`" class="table-col xs">
          <CheckBoxToDisplayTrueFalse
            id="exclusion"
            :checked="income.exclusion"
            name="disabled"
            disabled
          />
        </div>
        <div :id="`${idx}-taxType`" class="table-col normal" @click="toggleEditable(`${idx}-taxType`, income.id)">
          <EditableSelectCell :is-editable="isEditable(`${idx}-taxType`)" :selected-option="income.taxType" :options="taxTypeOptions" @change="debounceUpdate" />
        </div>
        <div :id="`${idx}-job`" class="table-col sm" @click="toggleEditable(`${idx}-job`, income.id)">
          <EditableSelectCell :is-editable="isEditable(`${idx}-job`)" :selected-option="income.job" :options="jobOptions" @change="debounceUpdate" />
        </div>
        <div :id="`${idx}-amount`" class="normal table-col" @click="toggleEditable(`${idx}-amount`, income.id)">
          <EditableInputCell v-model="income.amount" :is-editable="isEditable(`${idx}-amount`)" is-currency @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-currency`" class="table-col sm" @click="toggleEditable(`${idx}-currency`, income.id)">
          <EditableSelectCell :is-editable="isEditable(`${idx}-currency`)" :selected-option="income.currency" :options="currencyOptions" @change="debounceUpdate" />
        </div>
        <div :id="`${idx}-frequency`" class="table-col xs">
          {{ income.frequency || '' }}
        </div>
        <div :id="`${idx}-$`" class="table-col xs">
          $
        </div>
        <div :id="`${idx}-documents`" class="table-col sm">
          {{ income.documents }}
        </div>
        <div :id="`${idx}-description`" class="table-col lg">
          {{ income.description }}
        </div>
        <div :id="`${idx}-depend`" class="table-col sm">
          {{ income.depend }}
        </div>
        <div :id="`${idx}-delete`" class="table-col xs">
          <DeleteButton @click="onDeleteClick(income.id)" />
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
  'include', 'years', 'category', 'taxGroup', 'exclusion', 'taxType', 'job', 'amount', 'currency', 'frequency', '$', 'documents', 'description', 'depend', 'delete'
]

export default {
  name: 'IncomeTable',
  props: {
    showArchived: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      editableId: '',
      editableIncomeId: ''
    }
  },
  computed: {
    ...mapState([models.selectedClient, models.valueTypes, models.valueTaxGroups]),
    displayedIncome () {
      let income = []
      if (!this.showArchived) {
        income = this.notArchived
      } else {
        income = this.archived
      }
      return income
    },
    notArchived () {
      if (this.incomeBreakdowns) {
        return this.incomeBreakdowns
          .filter(income => !income.archived)
          .sort((a, b) => b.years - a.years)
      } else {
        return null
      }
    },
    archived () {
      if (this.incomeBreakdowns) {
        return this.incomeBreakdowns
          .filter(income => income.archived)
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
    incomeBreakdowns () {
      if (this.selectedClient.incomeBreakdowns) {
        return JSON.parse(JSON.stringify(this.selectedClient.incomeBreakdowns))
      } else {
        return null
      }
    }
  },
  methods: {
    toggleEditable (id, incomeId) {
      this.editableIncomeId = incomeId
      if (!(this.editableId === id)) {
        this.editableId = id
      }
    },
    isEditable (id) {
      return this.editableId === id
    },
    handleUpdate () {
      const income = this.displayedIncomes.find(income => income.id === this.editableIncomeId)
      this.$api.updateIncome(this.headers, { clientId: this.clientId, incomeId: this.editableIncomeId }, income)
    },
    onDeleteClick (incomeId) {
      if (this.showArchived) {
        const income = this.displayedIncome.find(income => income.id === incomeId)
        income.archived = false
        this.$api.updateIncome(this.headers, { clientId: this.clientId, incomeId }, income)
          .then(() => {
            this.updateClient(incomeId, income)
          })
      } else {
        this.$store.commit(
          mutations.setModelResponse,
          { model: models.modals, data: { delete: { showing: true, data: { id: incomeId, type: tabs.income } } } }
        )
      }
    },
    updateClient (incomeId, income) {
      const incomeIndex = this.incomeBreakdowns.findIndex(income => income.id === incomeId)
      this.incomeBreakdowns[incomeIndex] = income
      const data = Object.assign({}, this.selectedClient, { incomeBreakdowns: this.incomeBreakdowns })
      this.$store.commit(mutations.setModelResponse, { model: models.selectedClient, data })
    },
    onKeyDown () {
      const currentCell = this.editableId
      const idArr = currentCell.split('-')
      const columnIndex = columns.findIndex(col => col === idArr[1])
      if (columnIndex < columns.length - 1) {
        const nextCell = `${idArr[0]}-${columns[columnIndex + 1]}`
        this.toggleEditable(nextCell, this.editableIncomeId)
      }
    }
  }
}
</script>

<style scoped>

</style>
