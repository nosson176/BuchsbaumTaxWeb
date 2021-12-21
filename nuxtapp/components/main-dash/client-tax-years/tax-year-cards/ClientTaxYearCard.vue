<template>
  <div class="flex-grow flex">
    <div class="bg-white shadow w-80 flex flex-col overflow-hidden">
      <div class="p-2 flex justify-between z-10 w-full">
        <h3 class="text-lg leading-6 font-medium text-gray-900 w-full">
          <div class="w-full" @click="toggleEditable('year', yearData.id)">
            <EditableSelectCell v-model="year" :options="yearOptions" :is-editable="isEditable('year')" @blur="onBlur" @input="debounceUpdate" />
          </div>
        </h3>
      </div>
      <ClientTaxYearCardTabs
        :filings="filings"
        :active-filing-type="activeFilingType"
        :tax-year="yearData"
        @change="updateOnClient"
        @click="setActiveFilingType"
      />
      <div class="mt-2" />
      <ClientTaxYearCardFilingInfo :filing="displayedFilingInfo" @input="updateOnClient" />
      <div class="mt-2" />
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
      default: () => null
    }
  },
  data () {
    return {
      activeFilingType: filingTypes.federal,
      editableId: '',
      editableYearId: ''
    }
  },
  computed: {
    ...mapState([models.selectedClient]),
    year: {
      get () {
        return this.yearCopy.year
      },
      set (newVal) {
        this.yearCopy.year = newVal
      }
    },
    yearCopy () {
      return Object.assign({}, this.yearData)
    },
    filings () {
      return this.yearData.filings
    },
    displayedFilingInfo () {
      return this.filings.filter(filing => filing.filingType === this.activeFilingType)[0]
    },
    yearOptions () {
      return this.$store.state.valueTypes.year_name.filter(year => year.show)
    },
    debounceUpdate () {
      return debounce(this.handleUpdate, 500)
    }
  },
  methods: {
    setActiveFilingType (filingType) {
      this.activeFilingType = filingType
    },
    updateOnClient () {
      const headers = this.$api.getHeaders()
      this.$api.getClientData(headers, this.selectedClient.id)
    },
    toggleEditable (field, id) {
      this.editableYearId = id
      if (!(this.editableId === field)) {
        this.editableId = field
      }
    },
    isEditable (id) {
      return this.editableId === id
    },
    onBlur () {
      this.editableId = ''
    },
    handleUpdate () {
      // const contact = this.displayedContacts.find(contact => contact.id === this.editableContactId)
      // this.$api.updateContact(this.headers, { clientId: this.clientId, contactId: this.editableContactId }, contact)
    }
  }
}
</script>

<style scoped>

</style>
