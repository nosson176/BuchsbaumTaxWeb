<template>
  <div class="flex-grow flex">
    <div class="bg-white shadow w-72 flex flex-col overflow-hidden">
      <div class="p-2 flex justify-between z-10 w-full">
        <h3 class="text-3xl leading-6 font-bold text-gray-500 w-full">
          <div class="w-full flex justify-center" @click="toggleEditable('year', yearData.id)">
            <EditableSelectCell
              v-model="year"
              :options="yearOptions"
              :is-editable="isEditable('year')"
              @blur="onBlur"
              @input="debounceUpdate"
            />
          </div>
        </h3>
      </div>
      <div class="flex overflow-auto flex-grow">
        <div class="extension-column" :style="extensionColumnHeight">
          <div class="mx-auto">
            <HeaderSelectOption
              ref="filingTypeMenu"
              v-model="selectedFileType"
              class="mt-2"
              title="Add filing"
              add-icon
              :options="filingOptions"
              @input="addFilingType" />
          </div>
          <div v-for="(extension, idx) in extensions" :key="idx">
            <ClientTaxYearExtension :extension="extension" />
          </div>
        </div>
        <div>
          <ClientTaxYearCardTabs
            :filings="filings"
            :active-filing-idx="activeFilingType"
            :tax-year="yearData"
            @change="updateOnClient"
            @click="setActiveFilingType"
          />
          <div class="mt-2" />
          <ClientTaxYearCardFilingInfo :filing="displayedFilingInfo" @input="updateOnClient" />
          <div class="mt-2" />
        </div>
        <ClientTaxYearFbar v-if="fbar" :fbar="fbar" class="fbar-column" />
      </div>
      <div class="flex">
        <div class="bottom-tab">
          $
        </div>
        <div class="bottom-tab">
          Tab
        </div>
        <div class="bottom-tab">
          Win
        </div>
        <div class="bottom-tab">
          Sub
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { debounce } from 'lodash'
import { filingTypes, models } from '~/shared/constants'

export default {
  name: 'ClientTaxYearCard',
  props: {
    yearData: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      activeFilingType: 0,
      editableId: '',
      editableYearId: '',
      selectedFileType: ''
    }
  },
  computed: {
    ...mapState([models.selectedClient]),
    year: {
      get() {
        return this.yearData.year
      },
      set(newVal) {
        this.yearCopy.year = newVal
      },
    },
    yearCopy() {
      return Object.assign({}, this.yearData)
    },
    filings() {
      const clonedData = JSON.parse(JSON.stringify(this.yearData))
      return clonedData.filings
        .filter(filing => filing.filingType !== filingTypes.ext)
        .sort((a,b) => a.filingType > b.filingType ? 1 : -1)
    },
    displayedFilingInfo() {
      return this.filings[this.activeFilingType]
    },
    yearOptions() {
      return this.$store.state.valueTypes.year_name.filter((year) => year.show)
    },
    debounceUpdate() {
      return debounce(this.handleUpdate, 500)
    },
    extensions(){
      return this.yearData.filings.filter((filing) => filing.filingType === filingTypes.ext)
    },
    fbar(){
      return this.filings.find(filing => filing.filingType === filingTypes.fbar)
    },
    filingOptions(){
      const types = [{value: '', name: ''}]
      for(const type in filingTypes){
        const hideExtension = type === filingTypes.ext && this.extensions.length > 2
        const hideFbar = type === filingTypes.fbar && this.fbar
        if(hideExtension || hideFbar) {
          continue
        }
        types.push({ value: type, name: type.toUpperCase() })
      }
      return types
    },
    extensionColumnHeight(){
      const colHeight = this.extensions.length > 0 ? 240 * this.extensions.length : 240
      return 'height:' + colHeight + 'px'
    }
  },
  created(){
    this.setActiveFilingToFederal()
  },
  methods: {
    setActiveFilingType(filingType) {
      this.activeFilingType = filingType
    },
    updateOnClient() {
      const headers = this.$api.getHeaders()
      this.$api.getClientData(headers, this.selectedClient.id)
    },
    toggleEditable(field, id) {
      this.editableYearId = id
      if (!(this.editableId === field)) {
        this.editableId = field
      }
    },
    isEditable(id) {
      return this.editableId === id
    },
    onBlur() {
      this.editableId = ''
    },
    handleUpdate() {
      const headers = this.$api.getHeaders()
      const yearData = Object.assign({}, this.yearData, this.yearCopy)
      const taxYearId = yearData.id
      const clientId = this.selectedClient.id
      this.$api.updateTaxYear(headers, { taxYearId, clientId }, yearData)
    },
    addFilingType(filingType) {
      if(!filingType){
        return
      }
      const headers = this.$api.getHeaders()
      const defaultValues = {
        filingType,
        taxYearId: this.yearData.id,
      }
      const filing = Object.assign({}, defaultValues)
      this.$api.createFiling(headers, { filing }).then((data) => {
        this.updateOnClient()
      })
    },
    setActiveFilingToFederal(){
      const federalIndex = this.filings.findIndex(filing => filing.filingType === filingTypes.federal)
      this.activeFilingType = federalIndex > -1 ? federalIndex : 0
    }
  },
}
</script>

<style scoped>
.extension-column {
  @apply flex flex-col justify-between;

  width: 15%;
}

.fbar-column {
  @apply flex mt-2;

  height: 15%;
  width: 15%;
}

.bottom-tab {
  @apply border bg-gray-300 w-1/4 text-lg font-bold;
}
</style>
