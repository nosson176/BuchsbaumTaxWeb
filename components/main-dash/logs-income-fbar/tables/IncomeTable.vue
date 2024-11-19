<template>
  <Table v-if="isClientSelected" @keydown.tab.prevent @keyup.tab.exact="goToNextColumn"
    @keyup.shift.tab.exact="goToPrevColumn">
    <template #header>
      <TableHeader>
        <div class="table-header w-6 flex flex-col">
          <AddRowButton @click="onAddRowClick" />
          <HeaderSelectOption v-model="includeAll" menu :options="includeOptions" @input="handleUpdateIncludeAll" />
        </div>
        <div class="table-header w-6" />
        <div class="table-header xs flex flex-col">
          <div class="flex items-center space-x-0.5">
            <span>Year</span>
            <DeleteButton small @click="yearFilterValue = ''" />
          </div>
          <HeaderSelectOption v-model="yearFilterValue" :options="filteredYearsOptions" />
        </div>
        <div class="table-header xs flex flex-col">
          <div class="flex items-center space-x-0.5">
            <span>Cat</span>
            <DeleteButton small @click="categoryFilterValue = ''" />
          </div>
          <HeaderSelectOption v-model="categoryFilterValue" :options="filteredCategoriesOptions" />
        </div>
        <div class="table-header sm flex flex-col">
          <div class="flex items-center space-x-0.5">
            <span>Group</span>
            <DeleteButton small @click="groupFilterValue = ''" />
          </div>
          <HeaderSelectOption v-model="groupFilterValue" :options="filteredGroupsOptions" />
        </div>
        <div class="table-header xs">Ex</div>
        <div class="table-header sm flex flex-col">
          <div class="flex items-center space-x-0.5">
            <span>Type</span>
            <DeleteButton small @click="typeFilterValue = ''" />
          </div>
          <HeaderSelectOption v-model="typeFilterValue" :options="filteredTypesOptions" />
        </div>
        <div class="table-header xs flex flex-col">
          <div class="flex items-center space-x-0.5">
            <span>Job</span>
            <DeleteButton small @click="jobFilterValue = ''" />
          </div>
          <HeaderSelectOption v-model="jobFilterValue" :options="filteredJobsOptions" />
        </div>
        <div class="table-header sm">Amt</div>
        <div class="table-header xs flex flex-col">
          <div class="flex items-center space-x-0.5">
            <span>Curr</span>
            <DeleteButton small @click="currencyFilterValue = ''" />
          </div>
          <HeaderSelectOption v-model="currencyFilterValue" :options="filteredCurrenciesOptions" />
        </div>
        <div class="table-header xs text-center">X</div>
        <div class="table-header sm">$</div>
        <div class="table-header xs">Doc</div>
        <div class="table-header xl flex flex-col">
          <div class="flex items-center space-x-0.5">
            <span>Description</span>
            <DeleteButton small @click="descriptionFilterValue = ''" />
          </div>
          <HeaderSelectOption v-model="descriptionFilterValue" :options="filteredDescriptionsOptions" />
        </div>
        <div class="table-header sm">Depend</div>
        <div class="table-header xs" />
      </TableHeader>
    </template>
    <template #body>
      <TableRow v-for="(income, idx) in displayedIncomes" :key="income.id" :idx="idx" :selected="isSelected(income.id)"
        :class="{ disabled: !income.include }">
        <div class="table-col bg-gray-200 w-6">
          <ClickCell @click="toggleSelected(income)">{{ idx + 1 }}</ClickCell>
        </div>
        <div :id="`${idx}-include`" class="table-col w-6"
          @click="toggleEditable(`${idx}-include`, income.id, income.include)">
          <EditableCheckBoxCell v-model="income.include" :is-editable="isEditable(`${idx}-include`)"
            @input="handleUpdate" />
        </div>
        <div :id="`${idx}-years`" class="table-col-primary xs"
          @click="toggleEditable(`${idx}-years`, income.id, income.years)">
          <EditableSelectCell v-model="income.years" :is-editable="isEditable(`${idx}-years`)"
            :options="yearNameOptions" @blur="onBlur(income.years)" />
        </div>
        <div :id="`${idx}-category`" class="table-col xs"
          @click="toggleEditable(`${idx}-category`, income.id, income.category)">
          <EditableSelectCell v-model="income.category" :is-editable="isEditable(`${idx}-category`)"
            :options="categoryOptions" @blur="onBlur(income.category)" />
        </div>
        <div :id="`${idx}-taxGroup`" class="table-col sm"
          @click="toggleEditable(`${idx}-taxGroup`, income.id, income.taxGroup)">
          <EditableSelectCell v-model="income.taxGroup" :is-editable="isEditable(`${idx}-taxGroup`)"
            :options="taxGroupOptions" @blur="onBlur(income.taxGroup)" />
        </div>
        <div :id="`${idx}-exclusion`" class="table-col xs"
          @click="toggleEditable(`${idx}-exclusion`, income.id, income.exclusion)">
          <EditableCheckBoxCell v-model="income.exclusion" :is-editable="isEditable(`${idx}-exclusion`)"
            @input="handleUpdate" />
        </div>
        <div :id="`${idx}-taxType`" class="table-col sm"
          @click="toggleEditable(`${idx}-taxType`, income.id, income.taxType)">
          <EditableSelectCell v-model="income.taxType" :is-editable="isEditable(`${idx}-taxType`)"
            :options="taxTypeOptions" @blur="onBlur(income.taxType)" />
        </div>
        <div :id="`${idx}-job`" class="table-col xs" @click="toggleEditable(`${idx}-job`, income.id, income.job)">
          <EditableSelectCell v-model="income.job" :is-editable="isEditable(`${idx}-job`)" :options="jobOptions"
            @blur="onBlur(income.job)" />
        </div>
        <div :id="`${idx}-amount`" tabindex="-1" class="table-col sm"
          @click="toggleEditable(`${idx}-amount`, income.id, income.amount, `selectAll`)">
          <EditableInputCell v-model="income.amount" :selectAll="true" @keyup.enter.native="onBlur(fbar.amount)"
            :is-editable="isEditable(`${idx}-amount`)" currency @blur="onBlur(income.amount)" />
        </div>
        <div :id="`${idx}-currency`" class="table-col xs"
          @click="toggleEditable(`${idx}-currency`, income.id, income.currency)">
          <EditableSelectCell v-model="income.currency" :is-editable="isEditable(`${idx}-currency`)"
            :options="currencyOptions" @blur="onBlur(income.currency)" />
        </div>
        <div :id="`${idx}-frequency`" class="table-col xs" tabindex="-1"
          @click="toggleEditable(`${idx}-frequency`, income.id, income.frequency)">
          <EditableInputCell v-model="income.frequency" @keyup.enter.native="onBlur(fbar.frequency)"
            :is-editable="isEditable(`${idx}-frequency`)" @blur="onBlur(income.frequency)" />
        </div>
        <div :id="`${idx}-amount`" class="table-col sm"
          @click="toggleEditable(`${idx}-$`, income.id, income.amountUSD)">
          <EditableInputCell v-model="income.amountUSD" :selectAll="true" @keyup.enter.native="onBlur(fbar.amountUSD)"
            readonly :is-editable="isEditable(`${idx}-amount`)" currency rounded @blur="onBlur(income.amountUSD)" />
        </div>
        <div :id="`${idx}-documents`" class="table-col xs" tabindex="-1"
          @click="toggleEditable(`${idx}-documents`, income.id, income.documents)">
          <EditableSelectCell v-model="income.documents" :is-editable="isEditable(`${idx}-documents`)"
            :options="docOptions" @blur="onBlur(income.documents)" />
        </div>
        <div :id="`${idx}-description`" tabindex="-1" class="table-col xl"
          @click="toggleEditable(`${idx}-description`, income.id, income.description)">
          <EditableInputCell v-model="income.description" @keyup.enter.native="onBlur(fbar.description)"
            :is-editable="isEditable(`${idx}-description`)" @blur="onBlur(income.description)" />
        </div>
        <div :id="`${idx}-depend`" tabindex="-1" class="table-col sm"
          @click="toggleEditable(`${idx}-depend`, income.id, income.depend)">
          <EditableInputCell v-model="income.depend" @keyup.enter.native="onBlur(fbar.depend)"
            :is-editable="isEditable(`${idx}-depend`)" @blur="onBlur(income.depend)" />
        </div>
        <div :id="`${idx}-delete`" class="table-col xs">
          <DeleteButton small @click="onDeleteClick(income.id)" />
        </div>
      </TableRow>
      <TableRow class="sticky bottom-0 bg-gray-300 shadow">
        <div class="table-col w-6" />
        <div class="table-col w-6" />
        <div class="table-col-primary xs" />
        <div class="table-col xs" />
        <div class="table-col sm" />
        <div class="table-col xs" />
        <div class="table-col sm" />
        <div class="table-col xs" />
        <div class="sm table-col-primary">{{ amountTotal }}</div>
        <div class="table-col xs" />
        <div class="table-col xs" />
        <div class="table-col-primary sm">{{ amountUSDTotal }}</div>
        <div class="table-col xs" />
        <div class="table-col xl" />
        <div class="table-col sm" />
        <div class="table-col xs" />
      </TableRow>
    </template>
  </Table>
</template>

<script>
import { mapState } from 'vuex'
import { models, tableGroups } from '~/shared/constants'
import { formatAsNumber, generateRandomId, searchArrOfObjs, setAsValidNumber } from '~/shared/utility'

const columns = [
  'include',
  'years',
  'category',
  'taxGroup',
  'exclusion',
  'taxType',
  'job',
  'amount',
  'currency',
  'frequency',
  'documents',
  'description',
  'depend',
  'delete',
]

const docOptions = [{ value: 'HAS' }, { value: 'NEEDS' }]

const includeOptions = [
  { value: '', name: '' },
  { value: 'select', name: 'Select All' },
  { value: 'deselect', name: 'Deselect All' },
]

export default {
  name: 'IncomeTable',
  props: {
    showArchived: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      editableId: '',
      editableIncomeId: '',
      yearFilterValue: '',
      categoryFilterValue: '',
      groupFilterValue: '',
      typeFilterValue: '',
      jobFilterValue: '',
      currencyFilterValue: '',
      descriptionFilterValue: '',
      includeAll: '',
      selectedItems: {},
      oldValue: '',
      updateIncomes: []

    }
  },
  computed: {
    ...mapState([models.selectedClient, models.valueTypes, models.valueTaxGroups, models.search, models.cmdPressed]),
    displayedIncomes() {
      const incomes = this.shownIncomes.filter((income) => this.filterIncomes(income))
      return searchArrOfObjs(incomes, this.searchInput)
    },
    shownIncomes() {
      if (this.incomeBreakdowns) {
        return this.incomeBreakdowns.filter((income) => this.showArchived === income.archived)
      } else {
        return null
      }
    },
    categoryOptions() {
      return this.valueTypes.category.filter((category) => category.show)
    },
    yearNameOptions() {
      return this.valueTypes.year_name.filter((yearName) => yearName.show)
    },
    taxTypeOptions() {
      return this.valueTypes.tax_type.filter(
        (taxType) => taxType.show && taxType.parentId === this.editableIncomeTaxGroupId
      )
    },
    editableIncomeTaxGroupId() {
      const income = this.displayedIncomes.find((income) => income.id === this.editableIncomeId)
      const taxGroup = this.taxGroupOptions.find((taxGroup) => taxGroup.value === income?.taxGroup)
      return taxGroup?.id
    },
    jobOptions() {
      return this.valueTypes.job.filter((job) => job.show)
    },
    currencyOptions() {
      return this.valueTypes.currency.filter((currency) => currency.show)
    },
    taxGroupOptions() {
      return Object.values(this.valueTaxGroups).filter((taxGroup) => taxGroup.show)
    },
    headers() {
      return this.$api.getHeaders()
    },
    clientId() {
      return this.selectedClient.id
    },
    incomeBreakdowns() {
      if (this.selectedClient.incomeBreakdowns) {
        return JSON.parse(JSON.stringify(this.selectedClient.incomeBreakdowns))
      } else {
        return null
      }
    },
    searchInput() {
      return this.search?.[tableGroups.logsIncomeFbar]
    },
    docOptions() {
      return docOptions
    },
    amountTotal() {
      return formatAsNumber(
        this.displayedIncomes
          .filter((income) => income.include)
          .reduce((acc, income) => (income.frequency ? acc + income.amount * income.frequency : acc + income.amount), 0)
      )
    },
    amountUSDTotal() {
      return `$${formatAsNumber(
        Math.round(
          this.displayedIncomes
            .filter((income) => income.include)
            .reduce((acc, income) => {
              if (!income.amountUSD) {
                return acc
              }
              return income.frequency ? acc + income.amountUSD * income.frequency : acc + income.amountUSD
            }, 0)
        )
      )}`
    },
    filteredYearsOptions() {
      const options = this.yearNameOptions.filter((yearName) =>
        this.shownIncomes.find((income) => income.years === yearName.value)
      )
      return options
    },
    filteredCategoriesOptions() {
      const options = this.categoryOptions.filter((category) =>
        this.shownIncomes.find((income) => income.category === category.value)
      )
      return options
    },
    filteredGroupsOptions() {
      const options = this.taxGroupOptions.filter((taxGroup) =>
        this.shownIncomes.find((income) => income.taxGroup === taxGroup.value)
      )
      return options
    },
    filteredTypesOptions() {
      const options = this.valueTypes.tax_type.filter(
        (taxType) => taxType.show && this.shownIncomes.find((income) => income.taxType === taxType.value)
      )
      return options
    },
    filteredJobsOptions() {
      const options = this.jobOptions.filter((job) => this.shownIncomes.find((income) => income.job === job.value))
      return options
    },
    filteredCurrenciesOptions() {
      const options = this.currencyOptions.filter((currency) =>
        this.shownIncomes.find((income) => income.currency === currency.value)
      )
      return options
    },
    filteredDescriptionsOptions() {
      const options = this.shownIncomes
        .filter((income) => income.description)
        .map((income) => income.description)
        .filter((description, idx, arr) => arr.indexOf(description) === idx)
        .map((description) => ({ id: description, include: true, show: true, sortOrder: 0, value: description }))
      return options
    },
    filterByYear() {
      return !(this.yearFilterValue === '')
    },
    filterByCategory() {
      return !(this.categoryFilterValue === '')
    },
    filterByGroup() {
      return !(this.groupFilterValue === '')
    },
    filterByType() {
      return !(this.typeFilterValue === '')
    },
    filterByJob() {
      return !(this.jobFilterValue === '')
    },
    filterByCurrency() {
      return !(this.currencyFilterValue === '')
    },
    filterByDescription() {
      return !(this.descriptionFilterValue === '')
    },
    isClientSelected() {
      return !Array.isArray(this.selectedClient) || this.selectedClient.length > 0
    },
    includeOptions() {
      return includeOptions
    },
    isCmdPressed() {
      return this.cmdPressed && !Array.isArray(this.cmdPressed)
    },
    selectedIncomeIds() {
      return Object.keys(this.selectedItems).filter((id) => this.selectedItems[id])
    },
    isCopyingIncomes() {
      return this.isCmdPressed && this.selectedIncomeIds.length > 0
    },
  },
  beforeDestroy() {
    if (this.updateIncomes.length > 0) this.sendIncomesToServer()
  },
  methods: {
    toggleEditable(id, incomeId, value, selectAll) {
      if (!value) {
        const val = id.split("-")[1]
        const income = this.displayedIncomes.find((income) => income.id === incomeId)
        this.oldValue = income[val]
      } else this.oldValue = value
      this.editableIncomeId = incomeId
      if (!(this.editableId === id)) {
        this.editableId = id
      }
    },
    isEditable(id) {
      return this.editableId === id
    },
    handleUpdate() {
      if (!this.editableIncomeId) return
      const income = this.displayedIncomes.find((income) => income.id === this.editableIncomeId)
      income.amount = setAsValidNumber(income.amount)

      const index = this.updateIncomes.findIndex(inc => inc.id === income.id)
      if (index !== -1) {
        this.updateIncomes[index] = income
      } else {
        this.updateIncomes.push(income)
      }
    },
    sendIncomesToServer() {
      this.$api.updateIncomes(this.headers, this.updateIncomes)
    },
    handleUpdateIncludeAll() {
      this.displayedIncomes.forEach((income) => {
        if (this.includeAll === 'select') {
          income.include = true
        } else if (this.includeAll === 'deselect') {
          income.include = false
        }
      })
      if (this.includeAll !== '') {
        this.$api.updateIncome(this.headers, { clientId: this.clientId }, this.displayedIncomes)
      }
    },
    onDeleteClick(incomeId) {
      const income = this.displayedIncomes.find((income) => income.id === incomeId)
      if (this.showArchived) {
        income.archived = false
      } else {
        income.archived = true
      }
      const index = this.updateIncomes.findIndex(inc => inc.id === income.id)
      if (index !== -1) {
        this.updateIncomes[index] = income
      } else {
        this.updateIncomes.push(income)
      }

      this.$store.dispatch('updateIncomeAction', { income });
      // this.$store.dispatch('updateLogAction', { log });
      // this.updateUpdatAndNewLogs(log, log.archived, 'archived');
    },
    // onDeleteClick(incomeId) {
    //   if (this.showArchived) {
    //   const income = this.displayedIncomes.find((income) => income.id === incomeId)
    //     income.archived = false
    //     this.$api.updateIncome(this.headers, { clientId: this.clientId, incomeId }, income)
    //   } else {
    //     this.$store.commit(mutations.setModelResponse, {
    //       model: models.modals,
    //       data: {
    //         delete: { showing: true, data: { id: incomeId, type: tabs.income, label: 'income breakdown record' } },
    //       },
    //     })
    //   }
    // },
    onAddRowClick() {
      if (!this.selectedClient) {
        return
      }
      const defaultValues = {
        clientId: this.selectedClient.id,
        include: true,
        archived: false,
        id: generateRandomId(),
      }
      if (this.isCopyingIncomes) {
        this.selectedIncomeIds.forEach((incomeId, idx) => {
          const incomeIndex = this.displayedIncomes.findIndex((income) => income.id === Number(incomeId))
          const income = this.displayedIncomes[incomeIndex]
          const newIncome = Object.assign({}, income)
          newIncome.id = generateRandomId()
          this.updateIncomes.push(newIncome)
          this.$store.commit('pushNewIncome', {
            state: this.selectedClient,
            income: newIncome
          });
          // await this.$api.createIncome(this.headers, { income: newIncome }).then(async (data) => {
          //   if (this.selectedIncomeIds.length === idx + 1) {
          //     await this.$api.getClientData(this.headers, this.selectedClient.id)
          this.toggleEditable(`${incomeIndex}-${columns[1]}`, newIncome.id)
          //   }
          // })
        })
      } else {
        const income = Object.assign({}, defaultValues)
        this.updateIncomes.push(income)
        this.$store.commit('pushNewIncome', {
          state: this.selectedClient,
          income
        });
        // this.$api.createIncome(this.headers, { income }).then(async (data) => {
        //   await this.$api.getClientData(this.headers, this.selectedClient.id)
        this.toggleEditable(`0-${columns[0]}`, income.id)
        // })
      }
    },
    goToNextColumn() {
      const currentCell = this.editableId
      const idArr = currentCell.split('-')
      const columnIndex = columns.findIndex((col) => col === idArr[1])
      const currentRow = Number(idArr[0])
      if (columnIndex < columns.length - 1) {
        const nextCell = `${idArr[0]}-${columns[columnIndex + 1]}`
        this.toggleEditable(nextCell, this.editableIncomeId)
      } else if (columnIndex === columns.length - 1 && currentRow < this.displayedIncomes.length - 1) {
        const nextRow = currentRow + 1
        const nextCell = `${nextRow}-${columns[0]}`
        this.toggleEditable(nextCell, this.editableIncomeId)
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
        this.toggleEditable(prevCell, this.editableIncomeId)
      } else if (columnIndex > 0) {
        const prevCell = `${idArr[0]}-${columns[columnIndex - 1]}`
        this.toggleEditable(prevCell, this.editableIncomeId)
      }
    },
    onBlur(val) {
      if (this.oldValue !== val && this.oldValue !== undefined) {
        this.handleUpdate()
        this.goToNextColumn()
        return
      }
      this.editableId = ""
    },
    filterIncomes(income) {
      let returnValue = true
      returnValue = this.filterByYear ? income.years === this.yearFilterValue && returnValue : returnValue
      returnValue = this.filterByCategory ? income.category === this.categoryFilterValue && returnValue : returnValue
      returnValue = this.filterByGroup ? income.taxGroup === this.groupFilterValue && returnValue : returnValue
      returnValue = this.filterByType ? income.taxType === this.typeFilterValue && returnValue : returnValue
      returnValue = this.filterByJob ? income.job === this.jobFilterValue && returnValue : returnValue
      returnValue = this.filterByCurrency ? income.currency === this.currencyFilterValue && returnValue : returnValue
      returnValue = this.filterByDescription
        ? income.description === this.descriptionFilterValue && returnValue
        : returnValue
      return returnValue
    },
    toggleSelected(income) {
      this.selectedItems[income.id] = !this.selectedItems[income.id]
      this.selectedItems = Object.assign({}, this.selectedItems)
    },
    isSelected(incomeId) {
      return this.selectedItems[incomeId]
    },
  },
}
</script>

<style scoped></style>
