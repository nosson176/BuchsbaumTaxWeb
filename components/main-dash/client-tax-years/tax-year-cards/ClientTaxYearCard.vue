<template>
  <div class="flex-grow flex">
    <div class="bg-white shadow w-72 flex flex-col overflow-hidden">
      <div class="p-2 flex justify-between z-10 w-full">
        <h3 class="text-3xl leading-6 font-bold text-gray-500 w-full flex justify-center relative">
          <div class="absolute top-2 left-1 h-3 w-3 rounded-full cursor-pointer" title="IRS History"
            :class="yearData.irsHistory ? 'bg-blue-600' : 'border border-blue-200'" @click="updateIrsHistory" />
          <EditableSelectCell v-model="year" :class="{ 'tracking-widest': !isEditable('year') }" :options="yearOptions"
            placeholder="Year" :is-editable="isEditable('year')" @click.native="toggleEditable('year', yearData.id)"
            @blur="onBlur" />
        </h3>
      </div>
      <div class="flex flex-grow h-3/4 w-full border overflow-auto">
        <div class="flex flex-col border border-b-0  w-8 z-10"
          :class="extensions.length > 1 ? 'space-y-96' : 'space-y-96'" :style="extensionColumnHeight">
          <div class="mx-auto">
            <HeaderSelectOption ref="filingTypeMenu" v-model="selectedFileType" class="relative mt-2" title="Add filing"
              add-icon :options="filingOptions" @input="addFilingType" />
          </div>
          <div class="flex flex-col  w-8 z-10" ref="extensionColumn" :style="{ height: extensionColumnHeight }">
            <draggable v-model="extensions" v-bind="dragOptions" class="extension-draggable" @start="startDrag"
              @end="onDropExtension">
              <transition-group name="extension-list h-full" tag="div" class="extension-list"
                :class="extensions.length > 1 ? 'gap-28' : ''">
                <div v-for="(extension, idx) in extensions" :key="extension.id" class="extension-item mb-4"
                  :style="idx !== 0 ? { 'border-left': '1px solid rgba(229, 231, 235, var(--tw-border-opacity))' } : {}">
                  <ClientTaxYearExtension :extension="extension" @delete="startDelete($event, 'extension')" />
                </div>
              </transition-group>
            </draggable>
          </div>
        </div>
        <div class="flex flex-col overflow-auto h-full w-full">
          <ClientTaxYearCardTabs :filings="filings" :active-filing-idx="activeFilingIndex" :tax-year="yearData"
            @change="updateOnClient" @click="setActiveFilingIndex" />
          <div class="mt-2" />
          <ClientTaxYearCardFilingInfo :filing="displayedFilingInfo" @input="updateOnClient" @delete="startDelete" />
          <div class="mt-2" :tax-year="yearData" />
        </div>
        <div class="flex flex-col border border-b-0  flex-grow z-10 " ref="fbarColumn" :style="{
          height: fbarColumnHeight,
          minWidth: fbars.length < 1 ? '3rem' : '5rem',
        }">
          <div class="text-center p-1 px-2 text-sm font-medium text-gray-600 border-b border-gray-200">
            Fbar
          </div>
          <draggable v-model="fbars" v-bind="dragOptions" class="fbar-draggable" @start="startDrag" @end="onDrop">
            <transition-group name="fbar-list border" tag="div" class="fbar-list">
              <div v-for="(fbar, idx) in fbars" :key="fbar.id" class="fbar-item mb-4"
                :style="idx !== 0 ? { 'border-left': '1px solid rgba(229, 231, 235, var(--tw-border-opacity))' } : {}">
                <ClientTaxYearFbar :fbar="fbar" :idx="idx" :tax-year="yearData" @delete="startDelete($event, 'fbar')" />
              </div>
            </transition-group>
          </draggable>
        </div>
      </div>

      <!-- <div class="flex">
        <nuxt-link :to="shekelatorRoute"
          class="border bg-blue-200 w-1/4 text-sm font-bold capitalize text-center">$</nuxt-link>
        <div class="border bg-blue-200 w-1/4 text-sm font-bold capitalize text-center">Tab</div>
        <div class="border bg-blue-200 w-1/4 text-sm font-bold capitalize text-center">Win</div>
        <div class="border bg-blue-200 w-1/4 text-sm font-bold capitalize text-center">Sub</div>
      </div> -->
    </div>
    <Modal :showing="showDeleteModal" @hide="closeDeleteModal">
      <DeleteType :label="deleteTypeLabel" @hide="closeDeleteModal" @delete="deleteItem" />
    </Modal>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapState } from 'vuex'
import { filingTypes, models, routes, TRANSITION_NAME } from '~/shared/constants'
import { generateRandomId } from '~/shared/utility'

export default {
  name: 'ClientTaxYearCard',
  components: { draggable },
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
      dragActive: false,
      dragOptions: {
        animation: 200,
        ghostClass: 'ghost',
        direction: 'vertical',
      },
      fbarColumnHeight: '100%',
      extensionColumnHeight: '100%',
      fbars: [], // Initialize as an empty array
      extensions: [], // Initialize as an empty array
    }
  },
  computed: {
    ...mapState([models.selectedClient, models.selectedTaxYearId, models.filingsUpdate]),
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
    transitionName() {
      if (!this.dragActive) {
        return TRANSITION_NAME
      }
      return null
    },
    filings() {
      const clonedData = this.yearData
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
    headers() {
      return this.$api.getHeaders()
    },
    shekelatorRoute() {
      return { name: routes.shekelator }
    },
    filingOptions() {
      const types = [{ value: '', name: '' }]
      for (const type in filingTypes) {
        const hideExtension = type === filingTypes.ext && this.extensions.length > 2
        const hideFbar = type === filingTypes.fbar && this.fbars.length === 1
        if (hideExtension || hideFbar) {
          continue
        }
        types.push({ value: type, name: type.toUpperCase() })
      }
      return types

    },
  },
  watch: {
    selectedTaxYearId(id) {
      if (id === this.yearData.id) {
        this.$el.scrollIntoView({ behavior: 'smooth', inline: 'start' })
      }
    },
    yearData: {
      handler(newYearData) {
        // Sync fbars when yearData changes
        this.fbars = newYearData.filings.filter((filing) => filing.filingType === filingTypes.fbar)
        this.extensions = newYearData.filings.filter((filing) => filing.filingType === filingTypes.ext)
      },
      deep: true,
    },
  },
  mounted() {
    this.fbars = this.yearData.filings.filter((filing) => filing.filingType === filingTypes.fbar)
    this.extensions = this.yearData.filings.filter((filing) => filing.filingType === filingTypes.ext)
    this.updateFbarColumnHeight()
    this.updateExtansionColumnHeight()
    window.addEventListener('resize', this.updateFbarColumnHeight)
    window.addEventListener('resize', this.updateExtansionColumnHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateFbarColumnHeight)
    window.removeEventListener('resize', this.updateExtansionColumnHeight)
  },
  methods: {
    startDrag() {
      this.dragActive = true
    },

    onDrop(evt) {
      // Create a deep copy of the fbars array to ensure reactivity
      const updatedFbars = this.fbars.map(fbar => ({ ...fbar }));

      // Update the sort order for all fbars and log the changes
      updatedFbars.forEach((fbar, index) => {
        fbar.sortOrder = index + 1;             // Update sortOrder
      });

      // Reassign the fbars array to trigger Vue reactivity
      this.fbars = updatedFbars;

      // Perform API update in a separate method for clarity
      this.updateFbarsOnServer();

      this.dragActive = false;
      this.$nextTick(this.updateFbarColumnHeight);
    },
    onDropExtension(evt) {
      // Create a deep copy of the fbars array to ensure reactivity
      const updatedExtensions = this.extensions.map(extension => ({ ...extension }));

      // Update the sort order for all fbars and log the changes
      updatedExtensions.forEach((extension, index) => {
        extension.sortOrder = index + 1;             // Update sortOrder
      });

      // Reassign the fbars array to trigger Vue reactivity
      this.extensions = updatedExtensions;

      // Perform API update in a separate method for clarity
      this.updateExtensionsOnServer();

      this.dragActive = false;
      this.$nextTick(this.updateExtansionColumnHeight);
    },
    updateFbarsOnServer() {
      this.fbars.forEach(fbar => {
        this.$api.updateFiling(this.headers, { clientId: this.selectedClient.id, filingId: fbar.id }, fbar)
          .catch(error => console.error(`Failed to update fbar ${fbar.id}:`, error));
      });
    },
    updateExtensionsOnServer() {
      this.extensions.forEach(extension => {
        this.$api.updateFiling(this.headers, { clientId: this.selectedClient.id, filingId: extension.id }, extension)
          .catch(error => console.error(`Failed to update extension ${extension.id}:`, error));
      });
    },
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
      this.$store.commit('updateTaxYearState', { taxYearId, updatedData: yearData });
    },

    addFilingType(filingType) {
      if (!filingType) {
        return;
      }

      let sortOrder = this.yearData.filings.length + 1;
      if (filingType === filingTypes.federal) {
        const firstOccurenceOfStateFiling = this.yearData.filings.find(
          (filing) => filing.filingType === filingTypes.state
        );
        if (firstOccurenceOfStateFiling !== undefined) {
          sortOrder = firstOccurenceOfStateFiling.sortOrder;
        }
      }

      // Create the new filing with all required fields initialized
      const defaultValues = {
        filingType,
        taxYearId: this.yearData.id,
        sortOrder,
        status: { date: null, value: null },
        statusDetail: { date: null, value: null },
        clientId: this.selectedClient.id,
        completed: false,
        currency: 'NIS', // Set a default currency
        dateFiled: null,
        deliveryContact: null,
        fileType: null,
        id: generateRandomId(),
        includeFee: false,
        includeInRefund: false,
        memo: null,
        owes: 0,
        owesFee: 0,
        paid: 0,
        paidFee: 0,
        rebate: 0,
        refund: 0,
        secondDeliveryContact: null,
        state: null,
        statusDate: null,
        taxForm: null,
      };

      const filing = Object.assign({}, defaultValues);
      this.$api.createFiling(this.headers, { filing }).then(res => {
        console.log(res)
        this.$store.commit('pushNewFiling', res);

        // Ensure the new filing is immediately selected
        this.$nextTick(() => {
          const index = this.filings.findIndex(f => f.id === res.id);
          if (index !== -1) {
            this.setActiveFilingIndex(index);
          }
        });

      })
      // Add the filing to Vuex store
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
      this.$api.deleteFiling(this.headers, { filingId: this.deleteId, clientId: this.selectedClient.id }).then((res) => {
        if (res.success === 'Success') {
          this.$store.commit('deleteFiling', {
            filingId: this.deleteId,
            taxYearId: this.yearData.id,
          })
          this.$store.commit('deleteFromFilingUpdate', this.deleteId)
        }
        this.showDeleteModal = false
        this.deleteId = ''
        this.activeFilingIndex = 0
      })
    },
    closeDeleteModal() {
      this.showDeleteModal = false
      this.deleteId = ''
    },

    updateFbarColumnHeight() {
      this.$nextTick(() => {
        const column = this.$refs.fbarColumn;
        if (column && column.parentElement) {
          const parentHeight = column.parentElement.clientHeight;
          this.fbarColumnHeight = `${parentHeight}px`;
        }
      });
    },

    updateExtansionColumnHeight() {
      this.$nextTick(() => {
        const column = this.$refs.extensionColumn;
        if (column && column.parentElement) {
          const parentHeight = column.parentElement.clientHeight;
          this.extensionColumnHeight = `${parentHeight}px`;
        }
      });
    },
  },
}
</script>

<style scoped>
.fbar-draggable {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 0;

}

.fbar-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 10px;

  /* border: 1px solid inherit; */
  justify-content: space-between;
  gap: 10px;

}

.fbar-item {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.fbar-list-move {
  transition: transform 0.5s;
}

.fbar-list-enter-active,
.fbar-list-leave-active {
  transition: all 0.5s;
}

.fbar-list-enter,
.fbar-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.extension-draggable {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 0;

}

.extension-list {
  display: flex;
  flex-direction: column;
  width: 100%;

}

.extension-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  flex-shrink: 0;
  height: 150%;
  padding-top: 15px;
}

.extension-list-move {
  transition: transform 0.5s;
}

.extension-list-enter-active,
.extension-list-leave-active {
  transition: all 0.5s;
}

.extension-list-enter,
.extension-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>