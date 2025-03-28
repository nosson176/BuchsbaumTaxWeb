<template>
  <div>
    <div
      class="px-3 py-1 text-xs tracking-tighter my-auto h-32 border border-gray-300 border-opacity-0 hover:border-opacity-100"
      :class="classObj" @keydown.tab.prevent @keyup.shift.tab.exact="goToPrevItem">
      <div class="flex h-full flex-col space-y-1.5 justify-center">
        <div class="flex justify-end pt-1">
          <DeleteButton small @click="onDeleteClick(fee.id)" />
        </div>
        <div class="flex justify-between">
          <div class="flex flex-col w-1/3">
            <div @click="setEditable('feeType')">
              <EditableSelectCell v-model="feeType" placeholder="Type" :is-editable="isEditable('feeType')"
                :options="feeTypeOptions" @blur="onBlur('feeType')" @keyup.tab.native="onBlur('feeType', $event)"
                initiallyOpen=true />
            </div>
            <div @click="setEditable('year')">
              <EditableSelectCell v-model="year" :class="isRedBG ? 'text-red-500' : ''" placeholder="Year"
                :is-editable="isEditable('year')" :options="yearOptions" @blur="onBlur('year', $event)"
                @keyup.tab.native="onBlur('year', $event)" initiallyOpen=true />
            </div>
          </div>
          <div class="flex flex-col w-1/3">
            <div @click="setEditable('status')">
              <EditableSelectCell v-model="status" placeholder="Status" :is-editable="isEditable('status')"
                :options="feeStatusOptions" @blur="onBlur('status')" @keyup.tab.native="onBlur('status', $event)"
                initiallyOpen=true />
            </div>
            <div @click="setEditable('statusDetail')">
              <EditableSelectCell v-model="statusDetail" placeholder="Detail" :is-editable="isEditable('statusDetail')"
                :options="feeStatusDetailOptions" @blur="onBlur('statusDetail', $event)"
                @keyup.tab.native="onBlur('statusDetail', $event)" initiallyOpen=true />
            </div>
          </div>
          <div class="flex items-center w-1/3 space-x-1">
            <div @click="setEditable('sum')">
              <EditableCheckBoxCell v-model="sum" placeholder="Sum" :is-editable="isEditable('sum')"
                @click="onBlur('sum')" />
            </div>
            <div class="flex flex-col">
              <div class="flex items-center" @click="setEditable('manualAmount')">
                <HeaderSelectOption v-if="manualAmount" v-model="currency" :options="currencyOptions" currency
                  @input="onBlur" />
                <EditableInput v-model.number="manualAmount" placeholder="Amount" currency
                  :is-editable="isEditable('manualAmount')" @blur="onBlur('manualAmount')"
                  @keyup.enter.native="onBlur('manualAmount')" @keyup.esc.native="onBlur('manualAmount', $event)"
                  @keyup.tab.native="onBlur('manualAmount', $event)" />
                <div v-if="isEditable('manualAmount')" />
              </div>
              <div class="flex items-center" @click="setEditable('paidAmount')">
                <HeaderSelectOption v-if="paidAmount" v-model="currency" :options="currencyOptions" currency
                  @input="onBlur" />
                <EditableInput v-model.number="paidAmount" placeholder="Paid" currency
                  :is-editable="isEditable('paidAmount')" @blur="onBlur('paidAmount')"
                  @keyup.enter.native="onBlur('paidAmount', $event)" @keyup.tab.native="onBlur('paidAmount', $event)"
                  @keyup.esc.native="onBlur('paidAmount', $event)" />
                <div v-if="isEditable('paidAmount')" />
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-between">
          <!-- <div @click="setEditable('include')">
            <EditableCheckBoxCell v-model="include" :is-editable="isEditable('include')" @click="onBlur('include')" />
          </div> -->
          <div class="flex space-x-2">
            <span class="missing">Time</span>
            <div @click="setEditable('dateFee')">
              <EditableDate v-model="dateFee" placeholder="Date" type="date" :is-editable="isEditable('dateFee')"
                @blur="onBlur('dateFee', $event)" @keyup.tab.native="onBlur('dateFee', $event)" />
            </div>
          </div>
          <div class="w-1/3">
            <div @click="setEditable('rate')">
              <EditableInput v-model="rate" class="text-center" :is-editable="isEditable('rate')" placeholder="Rate/hr"
                @blur="onBlur('rate')" @keyup.enter.native="onBlur('rate')" @keyup.esc.native="onBlur('rate', $event)"
                @keyup.tab.native="onBlur('rate', $event)" />
            </div>
          </div>
        </div>
        <div @click="setEditable('notes')">
          <EditableInput v-model="notes" placeholder="Notes" :is-editable="isEditable('notes')" @blur="onBlur('notes')"
            @keyup.enter.native="onBlur('notes')" @keyup.esc.native="onBlur('notes', $event)"
            @keyup.tab.native="onBlur('notes', $event)" />
        </div>
      </div>
    </div>
    <div>
      <Modal :showing="showDeleteModal" @hide="closeDeleteModal">
        <DeleteType :label="deleteTypeLabel" @hide="closeDeleteModal" @delete="deleteFee" />
      </Modal>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { events, models, currencies } from '~/shared/constants'

const items = [
  'feeType',
  'year',
  'status',
  'statusDetail',
  // 'sum',
  'manualAmount',
  'paidAmount',
  'dateFee',
  'rate',
  'notes',
]

export default {
  name: 'FeesItem',
  props: {
    fee: {
      type: Object,
      required: true,
    },
    idx: {
      type: Number,
      default: NaN,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    headers: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      editable: '',
      oldValue: '',
      showDeleteModal: false,
      deleteFeeId: null,
      deleteTypeLabel: 'Fee',
      dateFieldsInProgress: new Set(), // Track date fields currently being processed
    }
  },
  computed: {
    ...mapState([models.valueTypes, models.selectedClient]),
    classObj() {
      const even = this.idx % 2 === 0
      return { even }
    },
    formModel() {
      return {
        ...this.fee,
      }
    },
    count() {
      return this.idx + 1
    },
    feeType: {
      get() {
        return this.formModel.feeType
      },
      set(newValue) {
        this.formModel.feeType = newValue
      },
    },
    year: {
      get() {
        return this.formModel.year
      },
      set(newVal) {
        this.formModel.year = newVal
      },
    },
    status: {
      get() {
        return this.formModel.status
      },
      set(newVal) {
        this.formModel.status = newVal
      },
    },
    statusDetail: {
      get() {
        return this.formModel.statusDetail
      },
      set(newVal) {
        this.formModel.statusDetail = newVal
      },
    },
    manualAmount: {
      get() {
        return this.formModel.manualAmount
      },
      set(newVal) {
        this.formModel.manualAmount = Number(newVal)
      },
    },
    paidAmount: {
      get() {
        return this.formModel.paidAmount
      },
      set(newVal) {
        this.formModel.paidAmount = Number(newVal)
      },
    },
    dateFee: {
      get() {
        return this.formModel.dateFee
      },
      set(newVal) {
        this.formModel.dateFee = newVal
      },
    },
    rate: {
      get() {
        return this.formModel.rate
      },
      set(newVal) {
        this.formModel.rate = newVal
      },
    },
    notes: {
      get() {
        return this.formModel.notes
      },
      set(newVal) {
        this.formModel.notes = newVal
      },
    },
    include: {
      get() {
        return this.formModel.include
      },
      set(newVal) {
        this.formModel.include = newVal
      },
    },
    sum: {
      get() {
        return this.formModel.sum
      },
      set(newVal) {
        this.formModel.sum = newVal
      },
    },
    currency: {
      get() {
        return this.formModel.currency || 'NIS'
      },
      set(newVal) {
        this.formModel.currency = newVal
      },
    },
    yearOptions() {
      return this.valueTypes.year_name.filter((year) => year.show)
    },
    feeTypeOptions() {
      return this.valueTypes.fee_type.filter((feeType) => feeType.show)
    },
    feeStatusOptions() {
      return this.valueTypes.fee_status.filter((feeStatus) => feeStatus.show)
    },
    feeStatusDetailOptions() {
      return this.valueTypes.fee_status_detail
        .filter((feeStatusDetail) => {
          // const parentId = this.feeStatusOptions.find(
          //   (statusOption) => statusOption.value === this.formModel.status
          // )?.id;

          if (this.formModel.status) {
            return feeStatusDetail.show;
            // return feeStatusDetail.parentId === parentId;
          } else {
            return feeStatusDetail.show;
          }
        })
        .sort((a, b) => {
          // Place blank options first
          if (!a.value) return -1;
          if (!b.value) return 1;
          return 0;
        });
    },
    currencySymbol() {
      if (this.currency === currencies.NIS.type) {
        return currencies.NIS.symbol
      } else {
        return currencies.USD.symbol
      }
    },
    currencyOptions() {
      return [{ value: currencies.USD.type }, { value: currencies.NIS.type }]
    },
    isRedBG() {
      return this.year === 'ITIN'
    },
  },
  watch: {
    fee: {
      handler() {
        if (this.isNew) {
          this.editable = 'feeType'
        }
      },
      deep: true,
    },
  },
  methods: {
    setEditable(field) {
      this.editable = field
      this.oldValue = this.formModel[field]
    },
    isEditable(field) {
      return this.editable === field
    },
    onBlur(e, event = null) {
      if (event && event.shiftKey && event.key === "Tab") return;
      if (this.editable === 'sum' || this.editable === 'include') {
        this.handleUpdate()
        return
      }
      // if (this.oldValue === this.formModel[e]) {
      //   this.editable = ''
      //   return
      // }
      if (e === 'dateFee') {
        // If this field is already being processed, skip
        if (this.dateFieldsInProgress.has(e)) {
          return;
        }


        // Mark this field as being processed
        this.dateFieldsInProgress.add(e);

        // Use setTimeout to allow the date picker to complete its update
        setTimeout(() => {
          const oldValueStr = JSON.stringify(this.oldValue);

          // Only proceed with update if values are different
          if (oldValueStr !== this.formModel[e]) {
            this.handleUpdate(e, event);
            // this.goToNextItem();
          } else {
            // If no changes, still move to next item
            this.goToNextItem();
          }

          // Remove field from processing set
          this.dateFieldsInProgress.delete(e);
        }, 100);

        return;
      }
      if (this.oldValue !== this.formModel[e]) {
        this.handleUpdate(event)
        return
      }
      if (event?.key === 'Tab' || event?.key === 'Enter') {
        this.goToNextItem()
        return

      }
      this.editable = ""
    },
    handleUpdate(event = null) {
      if (event?.key !== 'Escape') {
        this.goToNextItem()
      } else {
        this.editable = ''
      }
      this.$emit(events.input, this.formModel)
      // this.editable = ''
    },
    onDeleteClick(feeId) {
      this.deleteFeeId = feeId
      this.showDeleteModal = true
      // this.$emit(events.delete, this.fee.id)
    },

    closeDeleteModal() {
      this.showDeleteModal = false
    },

    deleteFee() {
      this.$api.deleteFee(this.headers, { feeId: this.deleteFeeId }).then(() => {
        this.closeDeleteModal()
        this.$store.commit('deleteFee', this.deleteFeeId)
      })
    },
    goToNextItem() {
      const currentCell = this.editable
      const itemIndex = items.findIndex((col) => {
        return col === currentCell
      })
      if (itemIndex < items.length - 1) {
        const nextCell = items[itemIndex + 1]
        this.setEditable(nextCell)
      } else {
        this.editable = ''

      }
    },
    goToPrevItem() {
      const currentCell = this.editable
      const itemIndex = items.findIndex((col) => col === currentCell)
      if (itemIndex > 0) {
        const prevCell = items[itemIndex - 1]
        this.setEditable(prevCell)
      } else this.editable = ''
    },
  },
}
</script>

<style scoped>
.missing {
  @apply italic text-gray-400;
}
</style>