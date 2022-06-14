<template>
  <div class="flex-grow flex">
    <div class="bg-white shadow w-60 flex flex-col overflow-hidden">
      <div class="p-2 flex justify-between z-10 w-full">
        <h3 class="text-3xl leading-6 font-bold text-gray-500 w-full flex justify-center relative">
          <div
            class="absolute top-2 left-1 h-3 w-3 rounded-full cursor-pointer"
            title="IRS History"
            :class="yearData.irsHistory ? 'bg-blue-600' : 'border border-blue-200'"
            @click="updateIrsHistory"
          />
            <EditableSelectCell
              v-model="year"
              class="tracking-widest"
              :options="yearOptions"
              :is-editable="isEditable('year')"
              @click.native="toggleEditable('year', yearData.id)"
              @blur="onBlur"
              @input="debounceUpdate"
            />
        </h3>
      </div>
      <div class="flex flex-grow h-3/4 w-full overflow-auto">
        <div
          class="extension-column"
          :class="extensions.length > 1 ? 'justify-between' : 'justify-start'"
          :style="extensionColumnHeight">
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
          <div v-for="(extension, idx) in extensions"  :key="idx">
            <ClientTaxYearExtension :class="{'mt-56': extensions.length < 2}" :extension="extension" />
          </div>
        </div>
        <div class="flex flex-col overflow-auto h-full w-full">
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
        <div class="fbar-container">
          <ClientTaxYearFbar v-if="fbar" :fbar="fbar" class="fbar-column" />
        </div>
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
      let style = ''
      if(this.extensions.length > 1){
        style = 'min-height:' + 250 * this.extensions.length + 'px'
      }
      return style
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
    },
    updateIrsHistory(){
      this.yearCopy.irsHistory = !this.yearCopy.irsHistory
      this.handleUpdate()
    }
  },
}
</script>

<style scoped>
.extension-column {
  @apply flex flex-col border;

  width: 30px;
}

.fbar-container {
  @apply border pt-5;

  width: 30px;
}

.fbar-column {
  @apply flex mt-2;

}

.bottom-tab {
  @apply border bg-gray-300 w-1/4 text-lg font-bold;
}
</style>
