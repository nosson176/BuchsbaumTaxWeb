<template>
  <Table v-if="isClientSelected" @keydown.tab.prevent="onKeyDown">
    <template #header>
      <TableHeader>
        <div class="table-header xs flex flex-col">
          <AddRowButton @click="onAddRowClick" />
          <div class="ml-1">
            <EditableCheckBoxCell v-model="includeAll" @input="debounceUpdateIncludeAll" />
          </div>
        </div>
        <div class="table-header xs flex flex-col">
          <div class="flex items-center space-x-0.5">
            <span>Year</span> <DeleteButton small @click="yearFilterValue = ''" />
          </div>
          <HeaderSelectOption v-model="yearFilterValue" :options="filteredYearsOptions" />
        </div>
        <div class="table-header xs flex flex-col">
          <div class="flex items-center space-x-0.5">
            <span>Cat</span> <DeleteButton small @click="categoryFilterValue = ''" />
          </div>
          <HeaderSelectOption v-model="categoryFilterValue" :options="filteredCategoriesOptions" />
        </div>
        <div class="table-header sm flex flex-col">
          <div class="flex items-center space-x-0.5">
            <span>Group</span> <DeleteButton small @click="groupFilterValue = ''" />
          </div>
          <HeaderSelectOption v-model="groupFilterValue" :options="filteredGroupsOptions" />
        </div>
        <div class="table-header xs">
          Ex
        </div>
        <div class="table-header sm flex flex-col">
          <div class="flex items-center space-x-0.5">
            <span>Type</span> <DeleteButton small @click="typeFilterValue = ''" />
          </div>
          <HeaderSelectOption v-model="typeFilterValue" :options="filteredTypesOptions" />
        </div>
        <div class="table-header xs flex flex-col">
          <div class="flex items-center space-x-0.5">
            <span>Job</span> <DeleteButton small @click="jobFilterValue = ''" />
          </div>
          <HeaderSelectOption v-model="jobFilterValue" :options="filteredJobsOptions" />
        </div>
        <div class="table-header sm">
          Amt
        </div>
        <div class="table-header xs flex flex-col">
          <div class="flex items-center space-x-0.5">
            <span>Curr</span> <DeleteButton small @click="currencyFilterValue = ''" />
          </div>
          <HeaderSelectOption v-model="currencyFilterValue" :options="filteredCurrenciesOptions" />
        </div>
        <div class="table-header xs">
          X
        </div>
        <div class="table-header sm">
          $
        </div>
        <div class="table-header xs">
          Doc
        </div>
        <div class="table-header lg flex flex-col">
          <div class="flex items-center space-x-0.5">
            <span>Description</span> <DeleteButton small @click="descriptionFilterValue = ''" />
          </div>
          <HeaderSelectOption v-model="descriptionFilterValue" :options="filteredDescriptionsOptions" />
        </div>
        <div class="table-header sm">
          Depend
        </div>
        <div class="table-header xs" />
      </TableHeader>
    </template>
    <template #body>
      <TableRow
        v-for="(income, idx) in displayedIncomes"
        :key="income.id"
        :idx="idx"
        :class="{'disabled': !income.include}"
      >
        <div :id="`${idx}-include`" class="table-col xs" @click="toggleEditable(`${idx}-include`, income.id)">
          <EditableCheckBoxCell v-model="income.include" :is-editable="isEditable(`${idx}-include`)" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-years`" class="table-col-primary xs" @click="toggleEditable(`${idx}-years`, income.id)">
          <EditableSelectCell v-model="income.years" :is-editable="isEditable(`${idx}-years`)" :options="yearNameOptions" @blur="onBlur" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-category`" class="table-col xs" @click="toggleEditable(`${idx}-category`, income.id)">
          <EditableSelectCell v-model="income.category" :is-editable="isEditable(`${idx}-category`)" :options="categoryOptions" @blur="onBlur" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-taxGroup`" class="table-col sm" @click="toggleEditable(`${idx}-taxGroup`, income.id)">
          <EditableSelectCell v-model="income.taxGroup" :is-editable="isEditable(`${idx}-taxGroup`)" :options="taxGroupOptions" @blur="onBlur" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-exclusion`" class="table-col xs" @click="toggleEditable(`${idx}-exclusion`, income.id)">
          <EditableCheckBoxCell v-model="income.exclusion" :is-editable="isEditable(`${idx}-exclusion`)" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-taxType`" class="table-col sm" @click="toggleEditable(`${idx}-taxType`, income.id)">
          <EditableSelectCell v-model="income.taxType" :is-editable="isEditable(`${idx}-taxType`)" :options="taxTypeOptions" @blur="onBlur" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-job`" class="table-col xs" @click="toggleEditable(`${idx}-job`, income.id)">
          <EditableSelectCell v-model="income.job" :is-editable="isEditable(`${idx}-job`)" :options="jobOptions" @blur="onBlur" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-amount`" class="table-col sm" @click="toggleEditable(`${idx}-amount`, income.id)">
          <EditableInputCell v-model="income.amount" :is-editable="isEditable(`${idx}-amount`)" currency @blur="onBlur" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-currency`" class="table-col xs" @click="toggleEditable(`${idx}-currency`, income.id)">
          <EditableSelectCell v-model="income.currency" :is-editable="isEditable(`${idx}-currency`)" :options="currencyOptions" @blur="onBlur" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-frequency`" class="table-col xs" @click="toggleEditable(`${idx}-frequency`, income.id)">
          <EditableInputCell v-model="income.frequency" :is-editable="isEditable(`${idx}-frequency`)" @blur="onBlur" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-$`" class="table-col sm" @click="toggleEditable(`${idx}-$`, income.id)">
          <EditableInputCell
            v-model="income.amountUSD"
            readonly
            :is-editable="isEditable(`${idx}-$`)"
            currency
            rounded
            @blur="onBlur"
            @input="debounceUpdate"
          />
        </div>
        <div :id="`${idx}-documents`" class="table-col xs" @click="toggleEditable(`${idx}-documents`, income.id)">
          <EditableSelectCell v-model="income.documents" :is-editable="isEditable(`${idx}-documents`)" :options="docOptions" @blur="onBlur" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-description`" class="table-col lg" @click="toggleEditable(`${idx}-description`, income.id)">
          <EditableInputCell v-model="income.description" :is-editable="isEditable(`${idx}-description`)" @blur="onBlur" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-depend`" class="table-col sm" @click="toggleEditable(`${idx}-depend`, income.id)">
          <EditableInputCell v-model="income.depend" :is-editable="isEditable(`${idx}-depend`)" @blur="onBlur" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-delete`" class="table-col xs">
          <DeleteButton small @click="onDeleteClick(income.id)" />
        </div>
      </TableRow>
      <TableRow class="sticky bottom-0 bg-gray-300 shadow">
        <div class="table-col xs" />
        <div class="table-col-primary xs" />
        <div class="table-col xs" />
        <div class="table-col sm" />
        <div class="table-col xs" />
        <div class="table-col sm" />
        <div class="table-col xs" />
        <div class="sm table-col-primary">
          {{ amountTotal }}
        </div>
        <div class="table-col xs" />
        <div class="table-col xs" />
        <div class="table-col-primary sm">
          {{ amountUSDTotal }}
        </div>
        <div class="table-col xs" />
        <div class="table-col lg" />
        <div class="table-col sm" />
        <div class="table-col xs" />
      </TableRow>
    </template>
  </Table>
</template>

<script>
import { debounce } from 'lodash'
import { mapState } from 'vuex'
import { models, mutations, tableGroups, tabs } from '~/shared/constants'
import { formatAsNumber, searchArrOfObjs } from '~/shared/utility'

const columns = [
  'include', 'years', 'category', 'taxGroup', 'exclusion', 'taxType', 'job', 'amount', 'currency', 'frequency', '$', 'documents', 'description', 'depend', 'delete'
]

const docOptions = [
  { value: 'HAS' },
  { value: 'NEEDS' }
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
      newIncomeId: NaN,
      editableIncomeId: '',
      yearFilterValue: '',
      categoryFilterValue: '',
      groupFilterValue: '',
      typeFilterValue: '',
      jobFilterValue: '',
      currencyFilterValue: '',
      descriptionFilterValue: '',
      includeAll: false
    }
  },
  computed: {
    ...mapState([models.selectedClient, models.valueTypes, models.valueTaxGroups, models.search]),
    displayedIncomes () {
      const incomes = this.shownIncomes
        .filter(income => this.filterIncomes(income))
      const newIncomeIdx = incomes?.findIndex(income => income.id === this.newIncomeId)
      if (newIncomeIdx > -1) {
        const tempIncome = incomes[newIncomeIdx]
        incomes.splice(newIncomeIdx, 1)
        incomes.unshift(tempIncome)
      }
      return searchArrOfObjs(incomes, this.searchInput)
    },
    shownIncomes () {
      if (this.incomeBreakdowns) {
        return this.incomeBreakdowns
          .filter(income => this.showArchived === income.archived)
          .sort((a, b) => b.years - a.years)
      } else {
        return null
      }
    },
    debounceUpdate () {
      return debounce(this.handleUpdate, 500)
    },
    debounceUpdateIncludeAll () {
      return debounce(this.handleUpdateIncludeAll, 500)
    },
    categoryOptions () {
      return this.valueTypes.category.filter(category => category.show)
    },
    yearNameOptions () {
      return this.valueTypes.year_name.filter(yearName => yearName.show)
    },
    taxTypeOptions () {
      return this.valueTypes.tax_type.filter(taxType => taxType.show && taxType.parentId === this.editableIncomeTaxGroupId)
    },
    editableIncomeTaxGroupId () {
      const income = this.displayedIncomes.find(income => income.id === this.editableIncomeId)
      const taxGroup = this.taxGroupOptions.find(taxGroup => taxGroup.value === income?.taxGroup)
      return taxGroup?.id
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
      return this.$api.getHeaders()
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
    },
    searchInput () {
      return this.search?.[tableGroups.logsIncomeFbar]
    },
    docOptions () {
      return docOptions
    },
    amountTotal () {
      return formatAsNumber(this.displayedIncomes
        .filter(income => income.include)
        .reduce((acc, income) => income.frequency ? (acc + income.amount * income.frequency) : (acc + income.amount), 0))
    },
    amountUSDTotal () {
      return `$${formatAsNumber(Math.round(this.displayedIncomes
        .filter(income => income.include)
        .reduce((acc, income) => {
          if (!income.amountUSD) {
            return acc
          }
          return income.frequency ? (acc + income.amountUSD * income.frequency) : (acc + income.amountUSD)
        }, 0)
      ))}`
    },
    filteredYearsOptions () {
      const options = this.yearNameOptions
        .filter(yearName => this.shownIncomes.find(income => income.years === yearName.value))
      return options
    },
    filteredCategoriesOptions () {
      const options = this.categoryOptions
        .filter(category => this.shownIncomes.find(income => income.category === category.value))
      return options
    },
    filteredGroupsOptions () {
      const options = this.taxGroupOptions
        .filter(taxGroup => this.shownIncomes.find(income => income.taxGroup === taxGroup.value))
      return options
    },
    filteredTypesOptions () {
      const options = this.valueTypes.tax_type
        .filter(taxType => taxType.show && this.shownIncomes.find(income => income.taxType === taxType.value))
      return options
    },
    filteredJobsOptions () {
      const options = this.jobOptions
        .filter(job => this.shownIncomes.find(income => income.job === job.value))
      return options
    },
    filteredCurrenciesOptions () {
      const options = this.currencyOptions
        .filter(currency => this.shownIncomes.find(income => income.currency === currency.value))
      return options
    },
    filteredDescriptionsOptions () {
      const options = this.shownIncomes
        .filter(income => income.description)
        .map(income => income.description)
        .filter((description, idx, arr) => arr.indexOf(description) === idx)
        .map(description => ({ id: description, include: true, show: true, sortOrder: 0, value: description }))
      return options
    },
    filterByYear () {
      return !(this.yearFilterValue === '')
    },
    filterByCategory () {
      return !(this.categoryFilterValue === '')
    },
    filterByGroup () {
      return !(this.groupFilterValue === '')
    },
    filterByType () {
      return !(this.typeFilterValue === '')
    },
    filterByJob () {
      return !(this.jobFilterValue === '')
    },
    filterByCurrency () {
      return !(this.currencyFilterValue === '')
    },
    filterByDescription () {
      return !(this.descriptionFilterValue === '')
    },
    isClientSelected () {
      return !Array.isArray(this.selectedClient) || this.selectedClient.length > 0
    }
  },
  watch: {
    selectedClient: {
      handler () {
        this.newIncomeId = NaN
        this.editableId = ''
        this.editableFbarId = ''
        this.yearFilterValue = ''
        this.categoryFilterValue = ''
        this.groupFilterValue = ''
        this.typeFilterValue = ''
        this.jobFilterValue = ''
        this.currencyFilterValue = ''
        this.descriptionFilterValue = ''
      },
      deep: true
    }
  },
  mounted () {
    if (this.displayedIncomes) {
      this.includeAll = this.displayedIncomes.every(income => income.include)
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
    handleUpdateIncludeAll () {
      this.displayedIncomes.forEach((income) => {
        income.include = this.includeAll
      })
      this.$api.updateIncome(this.headers, { clientId: this.clientId }, this.displayedIncomes)
    },
    onDeleteClick (incomeId) {
      if (this.showArchived) {
        const income = this.displayedIncomes.find(income => income.id === incomeId)
        income.archived = false
        this.$api.updateIncome(this.headers, { clientId: this.clientId, incomeId }, income)
      } else {
        this.$store.commit(
          mutations.setModelResponse,
          { model: models.modals, data: { delete: { showing: true, data: { id: incomeId, type: tabs.income } } } }
        )
      }
    },
    onAddRowClick () {
      if (!this.selectedClient) {
        return
      }
      const headers = this.$api.getHeaders()
      const clientId = this.selectedClient.id
      const defaultValues = { clientId }
      const income = Object.assign({}, defaultValues)
      this.$api.createIncome(headers, { income })
        .then(async (data) => {
          await this.$api.getClientData(this.headers, this.selectedClient.id)
          this.newIncomeId = data.id
          this.toggleEditable(`0-${columns[0]}`, data.id)
        })
    },
    onKeyDown () {
      const currentCell = this.editableId
      const idArr = currentCell.split('-')
      const columnIndex = columns.findIndex(col => col === idArr[1])
      if (columnIndex < columns.length - 1) {
        const nextCell = `${idArr[0]}-${columns[columnIndex + 1]}`
        this.toggleEditable(nextCell, this.editableIncomeId)
      }
    },
    onBlur () {
      this.editableId = ''
    },
    filterIncomes (income) {
      let returnValue = true
      returnValue = this.filterByYear ? income.years === this.yearFilterValue && returnValue : returnValue
      returnValue = this.filterByCategory ? income.category === this.categoryFilterValue && returnValue : returnValue
      returnValue = this.filterByGroup ? income.taxGroup === this.groupFilterValue && returnValue : returnValue
      returnValue = this.filterByType ? income.taxType === this.typeFilterValue && returnValue : returnValue
      returnValue = this.filterByJob ? income.job === this.jobFilterValue && returnValue : returnValue
      returnValue = this.filterByCurrency ? income.currency === this.currencyFilterValue && returnValue : returnValue
      returnValue = this.filterByDescription ? income.description === this.descriptionFilterValue && returnValue : returnValue
      return returnValue
    }
  }
}
</script>

<style scoped>

</style>
