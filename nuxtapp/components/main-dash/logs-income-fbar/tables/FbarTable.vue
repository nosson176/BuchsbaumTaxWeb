<template>
  <Table v-if="isClientSelected" @keydown.tab.prevent="onKeyDown">
    <template #header>
      <TableHeader>
        <div class="table-header xs flex flex-col">
          <AddRowButton @click="onAddRowClick" />
          <div>
            <HeaderSelectOption v-model="includeAll" menu :options="includeOptions" @input="handleUpdateIncludeAll" />
          </div>
        </div>
        <div class="table-header xs flex flex-col">
          <div class="flex items-center space-x-0.5">
            <span>Year</span> <DeleteButton small @click="yearFilterValue = ''" />
          </div>
          <HeaderSelectOption v-model="yearFilterValue" :options="filteredYearOptions" />
        </div>
        <div class="table-header xs flex flex-col">
          <div class="flex items-center space-x-0.5">
            <span>Cat</span> <DeleteButton small @click="categoryFilterValue = ''" />
          </div>
          <HeaderSelectOption v-model="categoryFilterValue" :options="filteredCategoryOptions" />
        </div>
        <div class="table-header  sm flex flex-col">
          <div class="flex items-center space-x-0.5">
            <span>Group</span> <DeleteButton small @click="groupFilterValue = ''" />
          </div>
          <HeaderSelectOption v-model="groupFilterValue" :options="filteredGroupOptions" />
        </div>
        <div class="table-header sm flex flex-col">
          <div class="flex items-center space-x-0.5">
            <span>Type</span> <DeleteButton small @click="typeFilterValue = ''" />
          </div>
          <HeaderSelectOption v-model="typeFilterValue" :options="filteredTypeOptions" />
        </div>
        <div class="table-header xs flex flex-col">
          <div class="flex items-center space-x-0.5">
            <span>Job</span> <DeleteButton small @click="jobFilterValue = ''" />
          </div>
          <HeaderSelectOption v-model="jobFilterValue" :options="filteredJobOptions" />
        </div>
        <div class="table-header sm">
          Amt
        </div>
        <div class="table-header xs flex flex-col">
          <div class="flex items-center space-x-0.5">
            <span>Curr</span> <DeleteButton small @click="currencyFilterValue = ''" />
          </div>
          <HeaderSelectOption v-model="currencyFilterValue" :options="filteredCurrencyOptions" />
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
          <HeaderSelectOption v-model="descriptionFilterValue" :options="filteredDescriptionOptions" />
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
        :class="{'disabled': !fbar.include}"
      >
        <div :id="`${idx}-include`" class="table-col xs" @click="toggleEditable(`${idx}-include`, fbar.id)">
          <EditableCheckBoxCell v-model="fbar.include" :is-editable="isEditable(`${idx}-include`)" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-years`" class="table-col-primary xs" @click="toggleEditable(`${idx}-years`, fbar.id)">
          <EditableSelectCell v-model="fbar.years" :is-editable="isEditable(`${idx}-years`)" :options="yearNameOptions" @blur="onBlur" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-category`" class="table-col xs" @click="toggleEditable(`${idx}-category`, fbar.id)">
          <EditableSelectCell v-model="fbar.category" :is-editable="isEditable(`${idx}-category`)" :options="categoryOptions" @blur="onBlur" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-taxGroup`" class="table-col sm" @click="toggleEditable(`${idx}-taxGroup`, fbar.id)">
          <EditableSelectCell v-model="fbar.taxGroup" :is-editable="isEditable(`${idx}-taxGroup`)" :options="taxGroupOptions" @blur="onBlur" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-taxType`" class="table-col sm" @click="toggleEditable(`${idx}-taxType`, fbar.id)">
          <EditableSelectCell v-model="fbar.taxType" :is-editable="isEditable(`${idx}-taxType`)" :options="taxTypeOptions" @blur="onBlur" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-job`" class="table-col xs" @click="toggleEditable(`${idx}-job`, fbar.id)">
          <EditableSelectCell v-model="fbar.job" :is-editable="isEditable(`${idx}-job`)" :options="jobOptions" @blur="onBlur" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-amount`" class="sm table-col" @click="toggleEditable(`${idx}-amount`, fbar.id)">
          <EditableInputCell v-model="fbar.amount" :is-editable="isEditable(`${idx}-amount`)" currency @blur="onBlur" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-currency`" class="table-col xs" @click="toggleEditable(`${idx}-currency`, fbar.id)">
          <EditableSelectCell v-model="fbar.currency" :is-editable="isEditable(`${idx}-currency`)" :options="currencyOptions" @blur="onBlur" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-frequency`" class="table-col xs" @click="toggleEditable(`${idx}-frequency`, fbar.id)">
          <EditableInputCell v-model="fbar.frequency" :is-editable="isEditable(`${idx}-frequency`)" @blur="onBlur" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-$`" class="table-col sm" @click="toggleEditable(`${idx}-$`, fbar.id)">
          <EditableInputCell
            v-model="fbar.amountUSD"
            readonly
            :is-editable="isEditable(`${idx}-$`)"
            rounded
            currency
            @blur="onBlur"
            @input="debounceUpdate"
          />
        </div>
        <div :id="`${idx}-documents`" class="table-col xs" @click="toggleEditable(`${idx}-documents`, fbar.id)">
          <EditableSelectCell v-model="fbar.documents" :is-editable="isEditable(`${idx}-documents`)" :options="docOptions" @blur="onBlur" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-description`" class="table-col lg" @click="toggleEditable(`${idx}-description`, fbar.id)">
          <EditableInputCell v-model="fbar.description" :is-editable="isEditable(`${idx}-description`)" @blur="onBlur" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-depend`" class="table-col sm" @click="toggleEditable(`${idx}-depend`, fbar.id)">
          <EditableInputCell v-model="fbar.depend" :is-editable="isEditable(`${idx}-depend`)" @blur="onBlur" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-delete`" class="table-col xs">
          <DeleteButton small @click="onDeleteClick(fbar.id)" />
        </div>
      </TableRow>
      <TableRow class="sticky bottom-0 bg-gray-300 shadow">
        <div class="table-col xs" />
        <div class="table-col-primary xs" />
        <div class="table-col xs" />
        <div class="table-col sm" />
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
  'include', 'years', 'category', 'taxGroup', 'taxType', 'job', 'amount', 'currency', 'frequency', '$', 'documents', 'description', 'depend', 'delete'
]

const docOptions = [
  { value: 'HAS' },
  { value: 'NEEDS' }
]

const includeOptions = [
  { value: '', name: '' },
  { value: 'select', name: 'Select All' },
  { value: 'deselect', name: 'Deselect All' }
]

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
      newFbarId: NaN,
      editableId: '',
      editableFbarId: '',
      yearFilterValue: '',
      categoryFilterValue: '',
      groupFilterValue: '',
      typeFilterValue: '',
      jobFilterValue: '',
      currencyFilterValue: '',
      descriptionFilterValue: '',
      includeAll: ''
    }
  },
  computed: {
    ...mapState([models.selectedClient, models.valueTypes, models.valueTaxGroups, models.search]),
    displayedFbars () {
      const fbars = this.shownFbars
        .filter(fbar => this.filterFbars(fbar))
      const newFbarIdx = fbars?.findIndex(fbar => fbar.id === this.newFbarId)
      if (newFbarIdx > -1) {
        const tempFbar = fbars[newFbarIdx]
        fbars.splice(newFbarIdx, 1)
        fbars.unshift(tempFbar)
      }
      return searchArrOfObjs(fbars, this.searchInput)
    },
    shownFbars () {
      if (this.fbarBreakdowns) {
        return this.fbarBreakdowns
          .filter(fbar => this.showArchived === fbar.archived)
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
      return this.valueTypes.tax_type.filter(taxType => taxType.show && taxType.parentId === this.editableFbarTaxGroupId)
    },
    editableFbarTaxGroupId () {
      const fbar = this.displayedFbars.find(fbar => fbar.id === this.editableFbarId)
      const taxGroup = this.taxGroupOptions.find(taxGroup => taxGroup.value === fbar?.taxGroup)
      return taxGroup?.id
    },
    jobOptions () {
      return this.valueTypes.part.filter(job => job.show)
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
    fbarBreakdowns () {
      if (this.selectedClient.fbarBreakdowns) {
        return JSON.parse(JSON.stringify(this.selectedClient.fbarBreakdowns))
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
      return formatAsNumber(this.displayedFbars
        .filter(fbar => fbar.include)
        .reduce((acc, fbar) => fbar.frequency ? (acc + fbar.amount * fbar.frequency) : (acc + fbar.amount), 0))
    },
    amountUSDTotal () {
      return `$${formatAsNumber(Math.round(this.displayedFbars
        .filter(fbar => fbar.include)
        .reduce((acc, fbar) => {
          if (!fbar.amountUSD) {
            return acc
          }
          return fbar.frequency ? (acc + fbar.amountUSD * fbar.frequency) : (acc + fbar.amountUSD)
        }, 0)
      ))}`
    },
    filteredYearOptions () {
      const options = this.yearNameOptions
        .filter(yearName => this.shownFbars.find(fbar => fbar.years === yearName.value))
      return options
    },
    filteredCategoryOptions () {
      const options = this.categoryOptions
        .filter(category => this.shownFbars.find(fbar => fbar.category === category.value))
      return options
    },
    filteredGroupOptions () {
      const options = this.taxGroupOptions
        .filter(taxGroup => this.shownFbars.find(fbar => fbar.taxGroup === taxGroup.value))
      return options
    },
    filteredTypeOptions () {
      const options = this.valueTypes.tax_type
        .filter(taxType => taxType.show && this.shownFbars.find((fbar) => {
          return fbar.taxType === taxType.value
        }))
      return options
    },
    filteredJobOptions () {
      const options = this.jobOptions
        .filter(job => this.shownFbars.find(fbar => fbar.job === job.value))

      return options
    },
    filteredCurrencyOptions () {
      const options = this.currencyOptions
        .filter(currency => this.shownFbars.find(fbar => fbar.currency === currency.value))

      return options
    },
    filteredDescriptionOptions () {
      const options = this.shownFbars
        .filter(fbar => fbar.description)
        .map(fbar => fbar.description)
        .filter((value, index, self) => self.indexOf(value) === index)
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
    },
    includeOptions () {
      return includeOptions
    }
  },
  watch: {
    selectedClient: {
      handler () {
        Object.assign(this.$data, this.$options.data.apply(this))
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
    handleUpdateIncludeAll () {
      this.displayedFbars.forEach((fbar) => {
        if (this.includeAll === 'select') {
          fbar.include = true
        } else if (this.includeAll === 'deselect') {
          fbar.include = false
        }
      })
      this.$api.updateFbar(this.headers, { clientId: this.clientId }, this.displayedFbars)
    },
    onDeleteClick (fbarId) {
      if (this.showArchived) {
        const fbar = this.displayedFbars.find(fbar => fbar.id === fbarId)
        fbar.archived = false
        this.$api.updateFbar(this.headers, { clientId: this.clientId, fbarId }, fbar)
      } else {
        this.$store.commit(
          mutations.setModelResponse,
          { model: models.modals, data: { delete: { showing: true, data: { id: fbarId, type: tabs.fbar } } } }
        )
      }
    },
    onAddRowClick () {
      if (!this.selectedClient) {
        return
      }
      const headers = this.$api.getHeaders()
      const clientId = this.selectedClient.id
      const defaultValues = {
        clientId
      }
      const fbar = Object.assign({}, defaultValues)
      this.$api.createFbar(headers, { fbar })
        .then(async (data) => {
          await this.$api.getClientData(this.headers, this.selectedClient.id)
          this.newFbarId = data.id
          this.toggleEditable(`0-${columns[0]}`, data.id)
        })
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
    },
    filterFbars (fbar) {
      let returnValue = true
      returnValue = this.filterByYear ? fbar.years === this.yearFilterValue && returnValue : returnValue
      returnValue = this.filterByCategory ? fbar.category === this.categoryFilterValue && returnValue : returnValue
      returnValue = this.filterByGroup ? fbar.taxGroup === this.groupFilterValue && returnValue : returnValue
      returnValue = this.filterByType ? fbar.taxType === this.typeFilterValue && returnValue : returnValue
      returnValue = this.filterByJob ? fbar.job === this.jobFilterValue && returnValue : returnValue
      returnValue = this.filterByCurrency ? fbar.currency === this.currencyFilterValue && returnValue : returnValue
      returnValue = this.filterByDescription ? fbar.description === this.descriptionFilterValue && returnValue : returnValue
      return returnValue
    }
  }
}
</script>

<style scoped>

</style>
