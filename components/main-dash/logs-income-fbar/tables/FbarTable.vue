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
          <HeaderSelectOption v-model="yearFilterValue" :options="filteredYearOptions" />
        </div>
        <div class="table-header xs flex flex-col">
          <div class="flex items-center space-x-0.5">
            <span>Cat</span>
            <DeleteButton small @click="categoryFilterValue = ''" />
          </div>
          <HeaderSelectOption v-model="categoryFilterValue" :options="filteredCategoryOptions" />
        </div>
        <div class="table-header sm flex flex-col">
          <div class="flex items-center space-x-0.5">
            <span>Group</span>
            <DeleteButton small @click="groupFilterValue = ''" />
          </div>
          <HeaderSelectOption v-model="groupFilterValue" :options="filteredGroupOptions" />
        </div>
        <div class="table-header sm flex flex-col">
          <div class="flex items-center space-x-0.5">
            <span>Type</span>
            <DeleteButton small @click="typeFilterValue = ''" />
          </div>
          <HeaderSelectOption v-model="typeFilterValue" :options="filteredTypeOptions" />
        </div>
        <div class="table-header sm flex flex-col">
          <div class="flex items-center space-x-0.5">
            <span>Job</span>
            <DeleteButton small @click="jobFilterValue = ''" />
          </div>
          <HeaderSelectOption v-model="jobFilterValue" :options="filteredJobOptions" />
        </div>
        <div class="table-header sm">Amt</div>
        <div class="table-header xs flex flex-col">
          <div class="flex items-center space-x-0.5">
            <span>Curr</span>
            <DeleteButton small @click="currencyFilterValue = ''" />
          </div>
          <HeaderSelectOption v-model="currencyFilterValue" :options="filteredCurrencyOptions" />
        </div>
        <div class="table-header xs text-center">X</div>
        <div class="table-header sm">$</div>
        <div class="table-header xs">Doc</div>
        <div class="table-header xl flex flex-col">
          <div class="flex items-center space-x-0.5">
            <span>Description</span>
            <DeleteButton small @click="descriptionFilterValue = ''" />
          </div>
          <HeaderSelectOption v-model="descriptionFilterValue" :options="filteredDescriptionOptions" />
        </div>
        <div class="table-header sm">Depend</div>
        <div class="table-header xs">
          <DeleteButton small v-if="hasActiveFilters" @click="clearAllFilters"
            class="px-2 py-1 text-xs rounded flex justify-center" />
        </div>
      </TableHeader>
    </template>
    <template #body>
      <TableRow v-for="(fbar, idx) in displayedFbars" :key="fbar.id" :idx="idx" :selected="isSelected(fbar.id)"
        :class="{ disabled: !fbar.include }">
        <div class="table-col w-6 bg-gray-200">
          <ClickCell @click="toggleSelected(fbar)">{{ idx + 1 }}</ClickCell>
        </div>
        <div :id="`${idx}-include`" class="table-col w-6 p-1" @click="toggleEditable(`${idx}-include`, fbar.id)">
          <EditableCheckBoxCell v-model="fbar.include" :is-editable="isEditable(`${idx}-include`)"
            @input="handleUpdate('include')" />
        </div>
        <div :id="`${idx}-years`" class="table-col-primary xs"
          @click="toggleEditable(`${idx}-years`, fbar.id, fbar.years)">
          <EditableSelectCell v-model="fbar.years" :is-editable="isEditable(`${idx}-years`)" :options="yearNameOptions"
            @blur="onBlur(fbar.years, 'years')" />
        </div>
        <div :id="`${idx}-category`" class="table-col xs"
          @click="toggleEditable(`${idx}-category`, fbar.id, fbar.category)">
          <EditableSelectCell v-model="fbar.category" :is-editable="isEditable(`${idx}-category`)"
            :options="categoryOptions" @blur="onBlur(fbar.category)" />
        </div>
        <div :id="`${idx}-taxGroup`" class="table-col sm"
          @click="toggleEditable(`${idx}-taxGroup`, fbar.id, fbar.taxGroup)">
          <EditableSelectCell v-model="fbar.taxGroup" :is-editable="isEditable(`${idx}-taxGroup`)"
            :options="taxGroupOptions" @blur="onBlur(fbar.taxGroup)" />
        </div>
        <div :id="`${idx}-taxType`" class="table-col sm"
          @click="toggleEditable(`${idx}-taxType`, fbar.id, fbar.taxType)">
          <EditableSelectCell v-model="fbar.taxType" :is-editable="isEditable(`${idx}-taxType`)"
            :options="taxTypeOptions" @blur="onBlur(fbar.taxType)" />
        </div>
        <div :id="`${idx}-job`" class="table-col sm" @click="toggleEditable(`${idx}-job`, fbar.id, fbar.part)">
          <EditableSelectCell v-model="fbar.part" :is-editable="isEditable(`${idx}-job`)" :options="jobOptions"
            @blur="onBlur(fbar.part, 'job')" />
        </div>
        <div :id="`${idx}-amount`" class="sm table-col" @click="toggleEditable(`${idx}-amount`, fbar.id, fbar.amount)">
          <EditableInputCell v-model.number="fbar.amount" :selectAll="selectAll"
            @keyup.enter.native="onBlur(fbar.amount, 'amount')"
            @keyup.esc.native="onBlur(fbar.amount, 'amount', $event)" :is-editable="isEditable(`${idx}-amount`)"
            currency @blur="onBlur(fbar.amount, 'amount')" />
        </div>
        <div :id="`${idx}-currency`" class="table-col xs"
          @click="toggleEditable(`${idx}-currency`, fbar.id, fbar.currency)">
          <EditableSelectCell v-model="fbar.currency" :is-editable="isEditable(`${idx}-currency`)"
            :options="currencyOptions" @blur="onBlur(fbar.currency, 'currency')" />
        </div>
        <div :id="`${idx}-frequency`" class="table-col xs"
          @click="toggleEditable(`${idx}-frequency`, fbar.id, fbar.frequency)">
          <EditableInputCell v-model="fbar.frequency" @keyup.enter.native="onBlur(fbar.frequency)"
            @keyup.esc.native="onBlur(fbar.frequency, 'frequency', $event)"
            :is-editable="isEditable(`${idx}-frequency`)" @blur="onBlur(fbar.frequency)" />
        </div>
        <div :id="`${idx}-$`" class="table-col sm" @click="toggleEditable(`${idx}-$`, fbar.id, fbar.amountUSD)">
          <EditableInputCell v-model="fbar.amountUSD" :selectAll="true" @keyup.enter.native="onBlur(fbar.amountUSD)"
            readonly :is-editable="isEditable(`${idx}-$`)" rounded currency @blur="onBlur(fbar.amountUSD)" />
        </div>
        <div :id="`${idx}-documents`" class="table-col xs"
          @click="toggleEditable(`${idx}-documents`, fbar.id, fbar.documents)">
          <EditableSelectCell v-model="fbar.documents" :is-editable="isEditable(`${idx}-documents`)"
            :options="docOptions" @blur="onBlur(fbar.documents)" />
        </div>
        <div :id="`${idx}-description`" class="table-col xl"
          @click="toggleEditable(`${idx}-description`, fbar.id, fbar.description)">
          <EditableInputCell v-model="fbar.description" @keyup.enter.native="onBlur(fbar.description)"
            @keyup.esc.native="onBlur(fbar.description, 'description', $event)"
            :is-editable="isEditable(`${idx}-description`)" @blur="onBlur(fbar.description)" />
        </div>
        <div :id="`${idx}-depend`" class="table-col sm" @click="toggleEditable(`${idx}-depend`, fbar.id, fbar.depend)">
          <EditableInputCell v-model="fbar.depend" @keyup.enter.native="onBlur(fbar.depend)"
            @keyup.esc.native="onBlur(fbar.depend, 'depend', $event)" :is-editable="isEditable(`${idx}-depend`)"
            @blur="onBlur(fbar.depend)" />
        </div>
        <div :id="`${idx}-delete`" class="table-col xs">
          <Tooltip :delay="500" placement="right" :interactive="true" :html="true">
            <DeleteButton small @click="onDeleteClick(fbar.id)" />
            <template #popper>
              <div class="tooltip-content p-2 max-w-md">
                <ul v-if="fbar.createdBy" class="list-disc pl-4">
                  <span class="font-semibold mb-2 block"><strong>Created by</strong> {{ fbar.createdBy }} => {{
                    formatDateLog(fbar.createdTime)
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
        <div class="table-col sm" />
        <div class="table-col sm" />
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
          <DeleteType :label="deleteTypeLabel" @hide="closeDeleteModal" @delete="deleteFbar" />
        </Modal>
        <YearSelectionModal :showing="showYearSelectionModal"
          :selected-items="selectedFbarIds.map(id => displayedFbars.find(f => f.id === Number(id)))"
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
  'taxType',
  'job',
  'amount',
  'currency',
  'frequency',
  // '$',
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
  name: 'FbarTable',
  props: {
    showArchived: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      editableId: '',
      editableFbarId: '',
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
      updateFbars: [],
      selectAll: true,
      trackedFbarId: null,
      showDeleteModal: false,
      deleteFbarId: null,
      deleteTypeLabel: 'Fbar',
      showClearAll: false,
      showYearSelectionModal: false,
      type: 'fbar'
    }
  },
  computed: {
    ...mapState([models.selectedClient, models.currentUser, models.valueTypes, models.valueTaxGroups, models.search, models.cmdPressed, models.exchangeRate]),
    displayedFbars() {
      const fbars = this.shownFbars.filter((fbar) => this.filterFbars(fbar));
      return searchArrOfObjs(fbars, this.searchInput);
    },
    shownFbars() {
      if (this.fbarBreakdowns) {
        return this.fbarBreakdowns.filter((fbar) => this.showArchived === fbar.archived)
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
      return this.valueTypes.tax_type.filter((taxType) => taxType.show)
    },
    // taxTypeOptions() {
    //   return this.valueTypes.tax_type.filter(
    //     (taxType) => taxType.show && taxType.parentId === this.editableFbarTaxGroupId
    //   )
    // },
    editableFbarTaxGroupId() {
      const fbar = this.displayedFbars.find((fbar) => fbar.id === this.editableFbarId)
      const taxGroup = this.taxGroupOptions.find((taxGroup) => taxGroup.value === fbar?.taxGroup)
      return taxGroup?.id
    },
    jobOptions() {
      return this.valueTypes.part.filter((job) => {
        return job.show
      })
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
    fbarBreakdowns() {
      if (this.selectedClient.fbarBreakdowns) {
        return JSON.parse(JSON.stringify(this.selectedClient.fbarBreakdowns))
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
        this.displayedFbars
          .filter((fbar) => fbar.include)
          .reduce((acc, fbar) => (fbar.frequency ? acc + Number(fbar.amount) * fbar.frequency : acc + Number(fbar.amount)), 0)
      )
    },
    amountUSDTotal() {
      return `$${formatAsNumber(
        Math.round(
          this.displayedFbars
            .filter((fbar) => fbar.include)
            .reduce((acc, fbar) => {
              if (!fbar.amount || !fbar.years || !fbar.currency) {
                return acc
              }
              const rate = this.getCurrencyRate(fbar.years, fbar.currency);
              return rate ? acc + (fbar.amount / rate) : acc;
            }, 0)
        )
      )}`
    },
    filteredYearOptions() {
      const options = this.yearNameOptions.filter((yearName) =>
        this.shownFbars.find((fbar) => fbar.years === yearName.value)
      )
      return options
    },
    filteredCategoryOptions() {
      const options = this.categoryOptions.filter((category) =>
        this.shownFbars.find((fbar) => fbar.category === category.value)
      )
      return options
    },
    filteredGroupOptions() {
      const options = this.taxGroupOptions.filter((taxGroup) =>
        this.shownFbars.find((fbar) => fbar.taxGroup === taxGroup.value)
      )
      return options
    },
    filteredTypeOptions() {
      const options = this.valueTypes.tax_type.filter(
        (taxType) =>
          taxType.show &&
          this.shownFbars.find((fbar) => {
            return fbar.taxType === taxType.value
          })
      )
      return options
    },
    filteredJobOptions() {
      const options = this.jobOptions.filter((job) => this.shownFbars.find((fbar) => {
        return fbar.job === job.value
      }))
      return options
    },
    filteredCurrencyOptions() {
      const options = this.currencyOptions.filter((currency) =>
        this.shownFbars.find((fbar) => fbar.currency === currency.value)
      )

      return options
    },
    filteredDescriptionOptions() {
      const options = this.shownFbars
        .filter((fbar) => fbar.description)
        .map((fbar) => fbar.description)
        .filter((value, index, self) => self.indexOf(value) === index)
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
    selectedFbarIds() {
      return Object.keys(this.selectedItems).filter((id) => this.selectedItems[id])
    },
    isCopyingFbars() {
      return this.isCmdPressed || this.selectedFbarIds.length > 0
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
    if (this.updateFbars.length > 0) this.sendFbarsToServer()
  },
  created() {
    this.sortFbars()
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
      if (this.updateFbars.length > 0) {
        this.sendFbarsToServer();
        // Optionally, to show a confirmation dialog
        event.preventDefault();
        event.returnValue = '';
      }
    },
    toggleEditable(id, fbarId, value) {
      if (!value) {
        const val = id.split("-")[1]
        const fbar = this.displayedFbars.find((fbar) => fbar.id === fbarId)
        this.oldValue = fbar[val]
      } else this.oldValue = value
      this.editableFbarId = fbarId
      this.trackedFbarId = fbarId
      if (!(this.editableId === id)) {
        this.editableId = id
      }
    },
    isEditable(id) {
      return this.editableId === id
    },

    handleUpdate(field) {
      if (!this.editableFbarId) return;
      const fbar = this.displayedFbars.find((fbar) => fbar.id === this.editableFbarId);

      // Handle amount changes
      if (field === 'amount') {
        fbar.amount = setAsValidNumber(fbar.amount);
        // Recalculate amountUSD based on the new amount and current exchange rate
        const rate = this.getCurrencyRate(fbar.years, fbar.currency);
        fbar.amountUSD = rate ? fbar.amount / rate : fbar.amount;
      }

      // Update store for specific fields that should trigger recalculation
      if (field === 'years' || field === 'currency' || field === 'amount' || field === 'include') {
        // If currency or year changes, we need to recalculate amountUSD
        if (field === 'years' || field === 'currency') {
          const rate = this.getCurrencyRate(fbar.years, fbar.currency);
          fbar.amountUSD = rate ? fbar.amount / rate : fbar.amount;
        }

        // Dispatch update to store
      }
      this.$store.dispatch('updateFbarAction', { fbar });

      // Handle updates array for API
      const index = this.updateFbars.findIndex(fb => fb.id === fbar.id);
      if (index !== -1) {
        this.updateFbars[index] = fbar;
      } else {
        this.updateFbars.push(fbar);
      }

      // Sort if year changes
      if (field === 'years' || field === 'job' || field === 'category' || field === 'currency' || field === 'amount') this.sortFbars();
    },

    sortFbars() {
      const partOrder = this.valueTypes.part
        .filter((job) => job.show)  // Filter to keep only the jobs where 'show' is true
        .map((job) => job.value);   // Extract just the 'value' of each job

      this.displayedFbars.sort((a, b) => {
        // Check if 'years' is null or undefined and place those items first
        if (a.years == null && b.years == null) return 0;
        if (a.years == null) return -1;
        if (b.years == null) return 1;

        const yearRegex = /^\d{4}/; // Match the first 4 digits (year)
        const aYearMatch = a.years?.match(yearRegex);
        const bYearMatch = b.years?.match(yearRegex);

        if (aYearMatch && bYearMatch) {
          const aYear = parseInt(aYearMatch[0]);
          const bYear = parseInt(bYearMatch[0]);

          // Sort by year in descending order
          if (aYear !== bYear) {
            return bYear - aYear;
          }

          // Sort by part (PART I > PART II > ... > PART V)

          //  const partOrder = ['PART I', 'PART II', 'PART III', 'PART IV', 'PART V']; // Order of parts
          // const partOrder = ["PART II",
          //   "PART II .2",
          //   "PART II .3",
          //   "PART II .4",
          //   "PART II .5",
          //   "PART II .6",
          //   "PART II .7",
          //   "PART II .8",
          //   "PART II .9",
          //   "PART II .10",
          //   "PART III ",
          //   "PART III .2",
          //   "PART III .3",
          //   "PART III .4",
          //   "PART III .5",
          //   "PART III .6",
          //   "PART III .7",
          //   "PART III .8",
          //   "PART III .9",
          //   "PART IV",
          //   "PART IV .2",
          //   "PART IV .3",
          //   "PART IV .4",
          //   "PART IV .5",
          //   "PART IV .6",
          //   "PART IV .7",
          //   "PART IV .8",
          //   "PART V"]; // Order of parts
          const aPartIndex = partOrder.indexOf(a.part);
          const bPartIndex = partOrder.indexOf(b.part);

          if (aPartIndex !== bPartIndex) {
            return aPartIndex - bPartIndex;
          }
        }

        // If one has a year and the other doesn't, place the one with the year first
        if (aYearMatch) return -1;
        if (bYearMatch) return 1;

        // If neither has a year, sort alphabetically by years
        return a.years.localeCompare(b.years);
      });

      // Handling the trackedFbarId
      if (this.trackedFbarId) {
        const newIndex = this.displayedFbars.findIndex(p => p.id === this.trackedFbarId);
        if (newIndex !== -1) {
          this.$nextTick(() => {
            const currentColumn = this.editableId.split('-')[1];
            this.editableId = `${newIndex}-${currentColumn}`;
          });
        }
      }
    },

    sendFbarsToServer() {
      this.$api.updateFbars(this.headers, this.updateFbars)
    },
    handleUpdateIncludeAll() {
      this.displayedFbars.forEach((fbar) => {
        if (this.includeAll === 'select') {
          fbar.include = true
        } else if (this.includeAll === 'deselect') {
          fbar.include = false
        }
      })
      if (this.includeAll !== '') {
        this.$api.updateFbar(this.headers, { clientId: this.clientId }, this.displayedFbars)
      }
    },
    onDeleteClick(fbarId) {
      this.deleteFbarId = fbarId
      this.showDeleteModal = true
    },

    closeDeleteModal() {
      this.showDeleteModal = false
    },

    deleteFbar() {
      this.$api.deleteFbar(this.headers, { fbarId: this.deleteFbarId }).then(() => {
        this.closeDeleteModal()
        this.$store.commit('deleteFbar', this.deleteFbarId)
        const index = this.updateFbars.findIndex(fbar => fbar.id === this.deleteFbarId)
        this.updateFbars.splice(index, 1)
      })
      this.sortFbars();
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
        taxGroup: 'FBAR YITROT',
        created_time: Date.now()

      }
      if (this.isCopyingFbars) {
        if (this.selectedFbarIds.length > 1) {
          this.showYearSelectionModal = true
        } else {
          this.selectedFbarIds.forEach((fbarId, idx) => {
            const fbarIndex = this.displayedFbars.findIndex((fbar) => fbar.id === Number(fbarId))
            const fbar = this.displayedFbars[fbarIndex]
            const newFbar = Object.assign({}, fbar)
            newFbar.amount = 0
            newFbar.amountUSD = 0
            newFbar.documents = 'NEED'
            newFbar.taxGroup = 'FBAR YITROT'
            newFbar.id = generateRandomId()
            newFbar.createdBy = this.currentUser.username
            newFbar.userId = this.currentUser.id
            this.updateFbars.push(newFbar)
            this.$store.commit('pushNewFbar', {
              state: this.selectedClient,
              fbar: newFbar
            });
            this.selectedItems = {}
            const copyFbarIndex = this.displayedFbars.findIndex((fbar) => fbar.id === Number(newFbar.id))
            this.$nextTick(() => {

              this.toggleEditable(`${copyFbarIndex}-${columns[1]}`, newFbar.id)
            })
            // this.toggleEditable(`${fbarIndex}-${columns[0]}`, newFbar.id)
          })
        }
      }
      else {
        const fbar = Object.assign({}, defaultValues)
        this.updateFbars.push(fbar)
        this.$store.commit('pushNewFbar', {
          state: this.selectedClient,
          fbar
        });
        this.$nextTick(() => {
          // Set the editable state after the new row is rendered
          this.editableId = `0-years`
          this.editableLogId = this.isCopyingLogs ? this.displayedFbars[0].id : defaultValues.id
        })
        this.toggleEditable(`0-${columns[0]}`, fbar.id)
      }
      this.sortFbars()
    },
    handleYearSelections({ yearSelections }) {
      // Create copies with selected years
      this.selectedFbarIds.forEach((fbarId) => {
        const fbarIndex = this.displayedFbars.findIndex((fbar) => fbar.id === Number(fbarId))
        const fbar = this.displayedFbars[fbarIndex]
        const newFbar = Object.assign({}, fbar, {
          amount: 0,
          amountUSD: 0,
          documents: 'NEED',
          taxGroup: 'FBAR YITROT',
          created_time: Date.now(),
          id: generateRandomId(),
          createdBy: this.currentUser.username,
          userId: this.currentUser.id,
          years: yearSelections[fbarId] // Use the selected year for this specific copy
        })

        this.updateFbars.push(newFbar)
        this.$store.commit('pushNewFbar', {
          state: this.selectedClient,
          fbar: newFbar
        })

        const copyFbarIndex = this.displayedFbars.findIndex((fbar) => fbar.id === Number(newFbar.id))
        this.toggleEditable(`${copyFbarIndex}-${columns[1]}`, newFbar.id)
      })

      this.selectedItems = {}
      this.showYearSelectionModal = false
      this.sortFbars()
    },
    goToNextColumn() {
      const currentCell = this.editableId
      const idArr = currentCell.split('-')
      const columnIndex = columns.findIndex((col) => col === idArr[1])
      const currentRow = Number(idArr[0])
      if (columnIndex < columns.length - 1) {
        const nextCell = `${currentRow}-${columns[columnIndex + 1]}`
        this.toggleEditable(nextCell, this.editableFbarId)
      } else if (columnIndex === columns.length - 1 && currentRow < this.displayedFbars.length - 1) {
        const nextRow = currentRow + 1
        const nextCell = `${nextRow}-${columns[0]}`
        this.toggleEditable(nextCell, this.editableFbarId)
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
        this.toggleEditable(prevCell, this.editableFbarId)
      } else if (columnIndex > 0) {
        const prevCell = `${idArr[0]}-${columns[columnIndex - 1]}`
        this.toggleEditable(prevCell, this.editableFbarId)
      }
    },
    onBlur(val, field, event = null) {
      if (this.oldValue !== val && !(this.oldValue === '' && val === '')) {
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
    filterFbars(fbar) {
      let returnValue = true
      returnValue = this.filterByYear ? fbar.years === this.yearFilterValue && returnValue : returnValue
      returnValue = this.filterByCategory ? fbar.category === this.categoryFilterValue && returnValue : returnValue
      returnValue = this.filterByGroup ? fbar.taxGroup === this.groupFilterValue && returnValue : returnValue
      returnValue = this.filterByType ? fbar.taxType === this.typeFilterValue && returnValue : returnValue
      returnValue = this.filterByJob ? fbar.part === this.jobFilterValue && returnValue : returnValue
      returnValue = this.filterByCurrency ? fbar.currency === this.currencyFilterValue && returnValue : returnValue
      returnValue = this.filterByDescription
        ? fbar.description === this.descriptionFilterValue && returnValue
        : returnValue
      return returnValue
    },
    toggleSelected(fbar) {
      this.selectedItems[fbar.id] = !this.selectedItems[fbar.id]
      this.selectedItems = Object.assign({}, this.selectedItems)
    },
    isSelected(fbarId) {
      return this.selectedItems[fbarId]
    },
    formatDateLog,

  },
}
</script>

<style scoped></style>
