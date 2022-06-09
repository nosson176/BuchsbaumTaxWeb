<template>
  <div class="flex-grow flex">
    <div class="bg-white shadow w-64 flex flex-col overflow-hidden">
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
      <div class="flex overflow-auto">
        <div class="extension-column">
          <div>
            <HeaderSelectOption
              ref="filingTypeMenu"
              v-model="selectedFileType"
              class="mt-2"
              title="Add filing"
              menu
              :options="filingOptions"
              @input="addFilingType" />
          </div>
          <ClientTaxYearExtension v-for="(extension, idx) in extensions" :key="idx" :extension="extension" />
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
      return this.yearData.filings
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
      return this.filings.filter((filing) => filing.filingType === filingTypes.ext)
    },
    filingOptions(){
      const types = [{value: '', name: ''}]
      for(const type in filingTypes){
        types.push({ value: type, name: type.toUpperCase() })
      }
      return types
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
</style>
