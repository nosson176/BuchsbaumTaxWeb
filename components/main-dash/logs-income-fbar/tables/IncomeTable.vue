<template>
  <Table v-if="isClientSelected" @keydown.tab.prevent @keyup.tab.exact="goToNextColumn"
    @keyup.shift.tab.exact="goToPrevColumn" style="height: inherit;">
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
        <div class="table-header xs mt-1">
          <DeleteButton small v-if="hasActiveFilters" @click="clearAllFilters" tooltip="Clear All Filters" />
        </div>
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
            @input="handleUpdate('include')" />
        </div>
        <div :id="`${idx}-years`" class="table-col-primary xs"
          @click="toggleEditable(`${idx}-years`, income.id, income.years)">
          <EditableSelectCell v-model="income.years" :is-editable="isEditable(`${idx}-years`)"
            :options="yearNameOptions" @blur="onBlur(income.years, 'years')" />
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
          <EditableInputCell v-model.number="income.amount" :selectAll="true"
            @keyup.enter.native="onBlur(income.amount, 'amount')"
            @keyup.esc.native="onBlur(income.amount, 'amount', $event)" :is-editable="isEditable(`${idx}-amount`)"
            currency @blur="onBlur(income.amount, 'amount')" />
        </div>
        <div :id="`${idx}-currency`" class="table-col xs"
          @click="toggleEditable(`${idx}-currency`, income.id, income.currency)">
          <EditableSelectCell v-model="income.currency" :is-editable="isEditable(`${idx}-currency`)"
            :options="currencyOptions" @blur="onBlur(income.currency, 'currency')" />
        </div>
        <div :id="`${idx}-frequency`" class="table-col xs" tabindex="-1"
          @click="toggleEditable(`${idx}-frequency`, income.id, income.frequency)">
          <EditableInputCell v-model="income.frequency" @keyup.enter.native="onBlur(income.frequency)"
            @keyup.esc.native="onBlur(income.frequency, 'frequency', $event)"
            :is-editable="isEditable(`${idx}-frequency`)" @blur="onBlur(income.frequency)" />
        </div>
        <div :id="`${idx}-amount`" class="table-col sm"
          @click="toggleEditable(`${idx}-$`, income.id, income.amountUSD)">
          <EditableInputCell v-model="income.amountUSD" :selectAll="true" @keyup.enter.native="onBlur(income.amountUSD)"
            readonly :is-editable="isEditable(`${idx}-amount`)" currency rounded @blur="onBlur(income.amountUSD)" />
        </div>
        <div :id="`${idx}-documents`" class="table-col xs" tabindex="-1"
          @click="toggleEditable(`${idx}-documents`, income.id, income.documents)">
          <EditableSelectCell v-model="income.documents" :is-editable="isEditable(`${idx}-documents`)"
            :options="docOptions" @blur="onBlur(income.documents)" />
        </div>
        <div :id="`${idx}-description`" tabindex="-1" class="table-col xl"
          @click="toggleEditable(`${idx}-description`, income.id, income.description)">
          <EditableInputCell v-model="income.description"
            @keyup.enter.native="onBlur(income.description, 'description', $event)"
            @keyup.esc.native="onBlur(income.description, 'description', $event)"
            :is-editable="isEditable(`${idx}-description`)" @blur="onBlur(income.description, 'description', $event)" />
        </div>
        <div :id="`${idx}-depend`" tabindex="-1" class="table-col sm"
          @click="toggleEditable(`${idx}-depend`, income.id, income.depend)">
          <EditableInputCell v-model="income.depend" @keyup.enter.native="onBlur(income.depend)"
            @keyup.esc.native="onBlur(income.depend, 'depend', $event)" :is-editable="isEditable(`${idx}-depend`)"
            @blur="onBlur(income.depend)" />
        </div>
        <div :id="`${idx}-delete`" class="table-col xs">
          <Tooltip :delay="500" placement="right" :interactive="true" :html="true">
            <DeleteButton small @click="onDeleteClick(income.id)" />
            <template #popper>
              <div class="tooltip-content p-2 max-w-md">
                <ul v-if="income.createdBy" class="list-disc pl-4">
                  <span class="font-semibold mb-2 block"><strong>Created by</strong> {{ income.createdBy }} => {{
                    formatDateLog(income.createdTime)
                  }}</span>
                  <div class="div"></div>
                </ul>
                <p v-else class="text-gray-500">No changes recorded</p>
              </div>
            </template>
          </Tooltip>
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
      <div>
        <Modal :showing="showDeleteModal" @hide="closeDeleteModal">
          <DeleteType :label="deleteTypeLabel" @hide="closeDeleteModal" @delete="deleteIncome" />
        </Modal>
        <YearSelectionModal :showing="showYearSelectionModal"
          :selected-items="selectedIncomeIds.map(id => displayedIncomes.find(i => i.id === Number(id)))"
          :year-options="yearNameOptions" :type="type" :title="`Select Years for ${type.toUpperCase()} Copies`"
          :year-field="'years'" @hide="showYearSelectionModal = false" @confirm="handleYearSelections" />
      </div>
    </template>
  </Table>
</template>

<script>
import { mapState } from 'vuex'
import { models, tableGroups } from '~/shared/constants'
import { formatAsNumber, formatDateLog, generateRandomId, searchArrOfObjs, setAsValidNumber } from '~/shared/utility'

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

const docOptions = [{ value: '' }, { value: 'HAS' }, { value: 'NEEDS' }]

const includeOptions = [
  { value: '', name: '' },
  { value: 'select', name: 'Select All' },
  { value: 'deselect', name: 'Deselect All' },
]
const notifiedErrors = new Set();
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
      updateIncomes: [],
      trackedIncomeId: null,
      showDeleteModal: false,
      deleteIncomeId: null,
      deleteTypeLabel: 'Income',
      showClearAll: false,
      showYearSelectionModal: false,
      type: 'income'

    }
  },
  computed: {
    ...mapState([models.selectedClient, models.valueTypes, models.currentUser, models.valueTaxGroups, models.search, models.cmdPressed, models.exchangeRate]),
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
        (taxType) => {
          if (taxType.value === '') return true
          return taxType.show && taxType.parentId === this.editableIncomeTaxGroupId
        }
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
      return Object.values(this.valueTaxGroups)
        .filter((taxGroup) => taxGroup.show)
        .sort((a, b) => (a.value === "" ? -1 : b.value === "" ? 1 : 0));
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
              if (!income.amount || !income.years || !income.currency) {
                return acc;
              }

              const rate = this.getCurrencyRate(income.years, income.currency);
              return rate ? acc + (income.amount * rate) : acc;
            }, 0)
        )
      )}`;
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
      return this.isCmdPressed || this.selectedIncomeIds.length > 0
    },
    hasActiveFilters() {
      return this.yearFilterValue !== '' ||
        this.categoryFilterValue !== '' ||
        this.groupFilterValue !== '' ||
        this.typeFilterValue !== '' ||
        this.jobFilterValue !== '' ||
        this.currencyFilterValue !== '' ||
        this.descriptionFilterValue !== '';
    }
  },
  mounted() {
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  },
  beforeDestroy() {
    if (this.updateIncomes.length > 0) this.sendIncomesToServer()
  },
  created() {
    this.sortIncomes()
  },
  methods: {
    clearAllFilters() {
      this.yearFilterValue = '';
      this.categoryFilterValue = '';
      this.groupFilterValue = '';
      this.typeFilterValue = '';
      this.jobFilterValue = '';
      this.currencyFilterValue = '';
      this.descriptionFilterValue = '';
      this.includeAll = '';
    },
    getCurrencyRate(year, currency) {
      if (!year || !currency) return null;

      // Extract numeric year from the input
      const numericYear = String(year).match(/\d{4}/)?.[0];
      if (!numericYear) {
        console.warn("Could not extract valid year from:", year);
        return null;
      }

      const exchange = Object.values(this.exchangeRate);
      const match = exchange.find(ex => ex.year?.includes(numericYear) && ex.currency === currency);

      if (!match) {
        const errorKey = `${numericYear}-${currency}`;
        if (!notifiedErrors.has(errorKey)) {
          notifiedErrors.add(errorKey);
          console.warn("No matching exchange rate found for:", { year: numericYear, currency });
          this.$nextTick(() => {
            this.$toast.error(`No exchange rate found for ${currency} in ${numericYear}`);
          });
        }
        return null;
      }

      return match.rate;
    },
    handleBeforeUnload(event) {
      if (this.updateIncomes.length > 0) {
        this.sendIncomesToServer();
        // Optionally, to show a confirmation dialog
        event.preventDefault();
        event.returnValue = '';
      }
    },
    toggleEditable(id, incomeId, value, selectAll) {
      if (!value) {
        const val = id.split("-")[1]
        const income = this.displayedIncomes.find((income) => income.id === incomeId)
        this.oldValue = income[val]
      } else this.oldValue = value
      this.editableIncomeId = incomeId
      this.trackedIncomeId = incomeId
      if (this.editableId !== id) {
        this.editableId = id
      }
    },
    isEditable(id) {
      return this.editableId === id
    },
    // handleUpdate(field) {
    //   if (!this.editableIncomeId) return
    //   const income = this.displayedIncomes.find((income) => income.id === this.editableIncomeId)
    //   if (field === 'amount') {
    //     income.amount = setAsValidNumber(income.amount)
    //     income.amountUSD = income.amount
    //   }
    //   const index = this.updateIncomes.findIndex(inc => inc.id === income.id)
    //   if (index !== -1) {
    //     this.updateIncomes[index] = income
    //   } else {
    //     this.updateIncomes.push(income)
    //   }
    //   if (field === 'include' || field === "amount") this.$store.dispatch('updateIncomeAction', { income });
    //   if (field === 'years') this.sortIncomes()
    // },
    handleUpdate(field) {
      if (!this.editableIncomeId) return;
      const income = this.displayedIncomes.find((income) => income.id === this.editableIncomeId);

      // Handle amount changes
      if (field === 'amount') {
        income.amount = setAsValidNumber(income.amount);
        // Recalculate amountUSD based on the new amount and current exchange rate
        const rate = this.getCurrencyRate(income.years, income.currency);
        income.amountUSD = rate ? income.amount * rate : income.amount;
      }

      // Update store for specific fields that should trigger recalculation
      if (field === 'years' || field === 'currency' || field === 'amount' || field === 'include') {
        // If currency or year changes, we need to recalculate amountUSD
        if (field === 'years' || field === 'currency') {
          const rate = this.getCurrencyRate(income.years, income.currency);
          income.amountUSD = rate ? income.amount * rate : income.amount;
        }

        // Dispatch update to store
        this.$store.dispatch('updateIncomeAction', { income });
      }

      // Handle updates array for API
      const index = this.updateIncomes.findIndex(inc => inc.id === income.id);
      if (index !== -1) {
        this.updateIncomes[index] = income;
      } else {
        this.updateIncomes.push(income);
      }

      // Sort if year changes
      if (field === 'years') this.sortIncomes();
    },
    sortIncomes() {
      this.displayedIncomes.sort((a, b) => {
        const yearRegex = /^\d{4}/; // Match the first 4 digits (year)

        // Check if 'years' is null or undefined and place those items first
        if (a.years == null && b.years == null) return 0; // Both are null/undefined, no change
        if (a.years == null) return -1; // a has null/undefined, place it at the top
        if (b.years == null) return 1;  // b has null/undefined, place it at the top

        const aYearMatch = a.years.match(yearRegex);
        const bYearMatch = b.years.match(yearRegex);

        if (aYearMatch && bYearMatch) {
          const aYear = parseInt(aYearMatch[0]);
          const bYear = parseInt(bYearMatch[0]);

          // Sort by year in descending order
          if (aYear !== bYear) {
            return bYear - aYear;
          }

          // Sort by remaining string after the year (e.g., X, X2)
          return a.years.localeCompare(b.years);
        }

        // If one has a year and the other doesn't, place the one with the year first
        if (aYearMatch) return -1;
        if (bYearMatch) return 1;

        // If neither has a year, sort alphabetically
        return a.years.localeCompare(b.years);
      });

      if (this.trackedIncomeId) {
        const newIndex = this.displayedIncomes.findIndex(p => p.id === this.trackedIncomeId);
        if (newIndex !== -1) {
          // Update editable cell ID to match the new position
          this.$nextTick(() => {
            const currentColumn = this.editableId.split('-')[1];
            this.editableId = `${newIndex}-${currentColumn}`;
          });
        }
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
      this.deleteIncomeId = incomeId
      this.showDeleteModal = true
      // const income = this.displayedIncomes.find((income) => income.id === incomeId)
      // if (this.showArchived) {
      //   income.archived = false
      // } else {
      //   income.archived = true
      // }
      // const index = this.updateIncomes.findIndex(inc => inc.id === income.id)
      // if (index !== -1) {
      //   this.updateIncomes[index] = income
      // } else {
      //   this.updateIncomes.push(income)
      // }

      // this.$store.dispatch('updateIncomeAction', { income });
    },

    deleteIncome() {
      this.$api.deleteIncome(this.headers, { incomeId: this.deleteIncomeId }).then(res => {
        this.closeDeleteModal()
        this.$store.commit('deleteIncome', this.deleteIncomeId)
        const index = this.updateIncomes.findIndex(income => income.id === this.deleteIncomeId)
        this.updateIncomes.splice(index, 1)

      })
    },

    closeDeleteModal() {
      this.showDeleteModal = false
    },

    onAddRowClick() {
      if (!this.selectedClient) {
        return
      }
      const defaultValues = {
        clientId: this.selectedClient.id,
        include: true,
        archived: false,
        id: generateRandomId(),
        createdBy: this.currentUser.username,
        userId: this.currentUser.id,
        years: '',
        category: '',
        taxGroup: '',
        exclusion: false,
        taxType: '',
        job: '',
        amount: null,
        currency: '',
        frequency: null,
        documents: '',
        description: '',
        depend: '',
        delete: null,


      }
      if (this.isCopyingIncomes) {
        this.showYearSelectionModal = true
        // this.selectedIncomeIds.forEach((incomeId, idx) => {
        //   const incomeIndex = this.displayedIncomes.findIndex((income) => income.id === Number(incomeId))
        //   const income = this.displayedIncomes[incomeIndex]
        //   const newIncome = Object.assign({}, income)
        //   newIncome.amount = 0
        //   newIncome.amountUSD = 0
        //   newIncome.documents = 'NEED'
        //   newIncome.id = generateRandomId()
        //   newIncome.createdBy = this.currentUser.username
        //   newIncome.userId = this.currentUser.id
        //   this.updateIncomes.push(newIncome)
        //   this.$store.commit('pushNewIncome', {
        //     state: this.selectedClient,
        //     income: newIncome
        //   });

        //   this.selectedItems = {}
        //   this.toggleEditable(`${incomeIndex}-${columns[1]}`, newIncome.id)
        //   //   }
        //   // })
        // })
      } else {
        const income = Object.assign({}, defaultValues)
        this.updateIncomes.push(income)
        this.$store.commit('pushNewIncome', {
          state: this.selectedClient,
          income
        });
        this.$nextTick(() => {
          // Set the editable state after the new row is rendered
          this.editableId = `0-years`
          this.editableLogId = this.isCopyingLogs ? this.displayedIncomes[0].id : defaultValues.id
        })
        this.toggleEditable(`0-${columns[0]}`, income.id)
        // })
      }
      this.sortIncomes()
    },
    handleYearSelections({ yearSelections }) {
      // Create copies with selected years
      this.selectedIncomeIds.forEach((incomeId) => {
        const incomeIndex = this.displayedIncomes.findIndex((income) => income.id === Number(incomeId))
        const income = this.displayedIncomes[incomeIndex]
        const newIncome = Object.assign({}, income, {
          amount: 0,
          amountUSD: 0,
          documents: 'NEED',
          id: generateRandomId(),
          createdBy: this.currentUser.username,
          userId: this.currentUser.id,
          years: yearSelections[incomeId],
        })
        this.updateIncomes.push(newIncome)
        this.$store.commit('pushNewIncome', {
          state: this.selectedClient,
          income: newIncome
        })
        this.selectedItems = {}
        const copyIncomeIndex = this.displayedIncomes.findIndex((income) => income.id === Number(newIncome.id))
        this.toggleEditable(`${copyIncomeIndex}-${columns[1]}`, newIncome.id)
        this.showYearSelectionModal = false
      })
      this.sortIncomes()
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
    onBlur(val, field, event = null) {
      console.log("Event:", event); // Check if the event exists
      if (this.oldValue !== val && this.oldValue !== undefined && !(this.oldValue === '' && val === '')) {
        this.handleUpdate(field)
        if (event?.key !== 'Escape') {
          this.goToNextColumn()
          return
        }
        this.editableId = ""
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
    formatDateLog,

  },
}
</script>

<style scoped>
.disabled {
  opacity: 0.5;
  background-color: #f3f4f6;
}
</style>