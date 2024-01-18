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
            :class="{ 'tracking-widest': !isEditable('year') }"
            :options="yearOptions"
            placeholder="Year"
            :is-editable="isEditable('year')"
            @click.native="toggleEditable('year', yearData.id)"
            @blur="onBlur"
          />
        </h3>
      </div>
      <div class="flex flex-grow h-3/4 w-full overflow-auto">
        <div
          class="flex flex-col border w-8 z-10"
          :class="extensions.length > 1 ? 'space-y-48' : 'justify-start'"
          :style="extensionColumnHeight"
        >
          <div class="mx-auto">
            <HeaderSelectOption
              ref="filingTypeMenu"
              v-model="selectedFileType"
              class="mt-2"
              title="Add filing"
              add-icon
              :options="filingOptions"
              @input="addFilingType"
            />
          </div>
          <div v-for="extension in extensions" :key="extension.id">
            <ClientTaxYearExtension
              :class="{ 'mt-44': extensions.length < 2 }"
              :extension="extension"
              @delete="startDelete($event, 'filing')"
            />
          </div>
        </div>
        <div class="flex flex-col overflow-auto h-full w-full">
          <ClientTaxYearCardTabs
            :filings="filings"
            :active-filing-idx="activeFilingIndex"
            :tax-year="yearData"
            @change="updateOnClient"
            @click="setActiveFilingIndex"
          />
          <div class="mt-2" />
          <ClientTaxYearCardFilingInfo :filing="displayedFilingInfo" @input="updateOnClient" @delete="startDelete" />
          <div class="mt-2" />
        </div>
        <div class="flex flex-col border pt-5 w-8 z-10" :style="fbarColumnHeight">
          <div v-for="fbar in fbars" :key="fbar.id" class="min-h-[250px] h-full">
            <ClientTaxYearFbar :fbar="fbar" class="flex mt-2" @delete="startDelete($event, 'filing')" />
          </div>
        </div>
      </div>
      <div class="flex">
        <nuxt-link :to="shekelatorRoute" class="border bg-blue-200 w-1/4 text-sm font-bold capitalize text-center"
          >$</nuxt-link
        >
        <div class="border bg-blue-200 w-1/4 text-sm font-bold capitalize text-center">Tab</div>
        <div class="border bg-blue-200 w-1/4 text-sm font-bold capitalize text-center">Win</div>
        <div class="border bg-blue-200 w-1/4 text-sm font-bold capitalize text-center">Sub</div>
      </div>
    </div>
    <Modal :showing="showDeleteModal" @hide="closeDeleteModal">
      <DeleteType :label="deleteTypeLabel" @hide="closeDeleteModal" @delete="deleteItem" />
    </Modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { filingTypes, models, routes } from '~/shared/constants'

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
      activeFilingIndex: 0,
      editableId: '',
      editableYearId: '',
      selectedFileType: '',
      deleteId: '',
      showDeleteModal: false,
      deleteTypeLabel: '',
    }
  },
  computed: {
    ...mapState([models.selectedClient, models.selectedTaxYearId]),
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
      return clonedData.filings.filter(
        (filing) => filing.filingType !== filingTypes.ext && filing.filingType !== filingTypes.fbar
      )
    },
    displayedFilingInfo() {
      return this.filings[this.activeFilingIndex]
    },
    yearOptions() {
      return this.$store.state.valueTypes.year_name.filter((year) => year.show)
    },
    extensions() {
      return this.yearData.filings.filter((filing) => filing.filingType === filingTypes.ext)
    },
    fbars() {
      return this.yearData.filings.filter((filing) => filing.filingType === filingTypes.fbar)
    },
    filingOptions() {
      const types = [{ value: '', name: '' }]
      for (const type in filingTypes) {
        const hideExtension = type === filingTypes.ext && this.extensions.length > 2
        const hideFbar = type === filingTypes.fbar && this.fbars.length > 1
        if (hideExtension || hideFbar) {
          continue
        }
        types.push({ value: type, name: type.toUpperCase() })
      }
      return types
    },
    extensionColumnHeight() {
      let style = ''
      if (this.extensions.length > 1) {
        style = 'min-height:' + 215 * this.extensions.length + 'px'
      }
      return style
    },
    headers() {
      return this.$api.getHeaders()
    },
    fbarColumnHeight() {
      const longestItemLength = this.extensions.length >= this.fbars.length ? this.extensions.length : this.fbars.length
      return 'min-height:' + 165 * longestItemLength + 'px'
    },
    shekelatorRoute() {
      return { name: routes.shekelator }
    },
  },
  watch: {
    selectedTaxYearId(id) {
      if (id === this.yearData.id) {
        this.$el.scrollIntoView({ behavior: 'smooth', inline: 'start' })
      }
    },
  },
  methods: {
    setActiveFilingIndex(filingIndex) {
      this.activeFilingIndex = filingIndex
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
      this.handleUpdate()
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
      if (!filingType) {
        return
      }
      const headers = this.$api.getHeaders()
      let sortOrder = this.yearData.filings.length + 1
      // always keep new federal filings in front of state
      if (filingType === filingTypes.federal) {
        const firstOccurenceOfStateFiling = this.yearData.filings.find(
          (filing) => filing.filingType === filingTypes.state
        )
        sortOrder = firstOccurenceOfStateFiling.sortOrder
      }
      const defaultValues = {
        filingType,
        taxYearId: this.yearData.id,
        sortOrder,
      }
      const filing = Object.assign({}, defaultValues)
      this.$api.createFiling(headers, { filing }).then((data) => {
        this.updateOnClient()
      })
    },
    updateIrsHistory() {
      this.yearCopy.irsHistory = !this.yearCopy.irsHistory
      this.handleUpdate()
    },
    startDelete(id, deleteLabel) {
      this.deleteId = id
      this.deleteTypeLabel = deleteLabel
      this.showDeleteModal = true
    },
    deleteItem() {
      this.$api.deleteFiling(this.headers, { filingId: this.deleteId, clientId: this.selectedClient.id }).then(() => {
        this.showDeleteModal = false
        this.deleteId = ''
        this.activeFilingIndex = 0
      })
    },
    closeDeleteModal() {
      this.showDeleteModal = false
      this.deleteId = ''
    },
  },
}
</script>

<style scoped></style>
