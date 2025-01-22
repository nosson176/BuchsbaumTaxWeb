<template>
  <div v-if="filing" class="p-2 flex flex-grow">
    <div class="w-full text-center text-xs relative" @keydown.tab.prevent @keyup.tab.exact="goToNextItem"
      @keyup.shift.tab.exact="goToPrevItem">
      <DeleteButton class="delete-btn" small @click="emitDelete(filing.id)" />
      <div v-if="filingType === 'state'" class="mb-1" @click="setEditable('state')">
        <EditableSelectCell v-model="state" :options="stateOptions" :is-editable="isEditable('state')"
          placeholder="State" @blur="onBlur('state')" />
      </div>
      <div v-else class="mb-1" @click="setEditable('taxForm')">
        <EditableSelectCell v-model="taxForm" :options="taxFormOptions" :is-editable="isEditable('taxForm')"
          placeholder="Tax Form" @blur="onBlur('taxForm')" />
      </div>
      <div class="mb-1" @click="setEditable('status')">
        <EditableSelectCell v-model="status" :options="statusOptions" :is-editable="isEditable('status')"
          placeholder="Status" @blur="onBlur('status')" />
      </div>
      <div class="mb-1" @click="setEditable('statusDetail')">
        <EditableSelectCell v-model="statusDetail" :options="statusDetailOptions"
          :is-editable="isEditable('statusDetail')" placeholder="Detail" @blur="onBlur('statusDetail')"
          @keyup.enter.native="onBlur('statusDetail')" />
      </div>
      <div class="mb-1" @click="setEditable('statusDate')">
        <EditableDate v-model="statusDate" placeholder="Date" type="date" :is-editable="isEditable('statusDate')"
          @blur="onBlur('statusDate')" />
      </div>
      <div class="col-span-2 cursor-pointer mb-1" @click="setEditable('memo')">
        <EditableTextAreaCell v-model="memo" :prevent-enter="false" show-overflow placeholder="Memo"
          :is-editable="isEditable('memo')" @blur="onMemoBlur" @keyup.tab.native="onMemoBlur" class="h-max" />
      </div>
      <div class="flex justify-center mb-1">
        <div class="flex items-center mr-3">
          <div @click="setEditable('includeInRefund')">
            <EditableCheckBoxCell v-model="includeInRefund" :is-editable="isEditable('includeInRefund')"
              @click="onBlur('includeInRefund')" />
          </div>
          <div class="flex flex-col">
            <div class="flex items-center" @click="setEditable('owes')">
              <HeaderSelectOption v-if="owes" v-model="currency" :options="currencyOptions" currency
                @input="onBlur('currency')" />
              <EditableInput v-model="owes" placeholder="Owes" currency :is-editable="isEditable('owes')"
                @blur="onBlur('owes')" @click="onBlur('owes')" @keyup.enter.native="onBlur('owes')" />
            </div>
            <div class="flex items-center" @click="setEditable('paid')">
              <HeaderSelectOption v-if="paid" v-model="currency" :options="currencyOptions" currency
                @input="onBlur('currency')" />
              <EditableInput v-model="paid" placeholder="Paid" currency :is-editable="isEditable('paid')"
                @blur="onBlur('paid')" @click="onBlur('paid')" @keyup.enter.native="onBlur('paid')" />
            </div>
          </div>
        </div>
        <div class="flex items-center ml-3">
          <div @click="setEditable('includeFee')">
            <EditableCheckBoxCell v-model="includeFee" :is-editable="isEditable('includeFee')"
              @click="onBlur('includeFee')" />
          </div>
          <div class="flex flex-col">
            <div @click="setEditable('owesFee')">
              <EditableInput v-model="owesFee" placeholder="FC" currency :is-editable="isEditable('owesFee')"
                @blur="onBlur('owesFee')" @keyup.enter.native="onBlur('owesFee')" />
            </div>
            <div @click="setEditable('paidFee')">
              <EditableInput v-model="paidFee" placeholder="Insur" currency :is-editable="isEditable('paidFee')"
                @blur="onBlur('paidFee')" @keyup.enter.native="onBlur('paidFee')" />
            </div>
          </div>
        </div>
      </div>
      <div class="mb-1" @click="setEditable('fileType')">
        <EditableSelectCell v-model="fileType" :options="fileTypeOptions" :is-editable="isEditable('fileType')"
          placeholder="File Type" @blur="onBlur('fileType')" />
      </div>
      <!-- spacing -->
      <div />
      <!-- end of spacing -->
      <div class="flex justify-center mb-1">
        <div class="mr-3 flex items-center" @click="setEditable('refund')">
          <span v-if="refund">$</span>
          <EditableInput v-model="refund" placeholder="Refund" currency :is-editable="isEditable('refund')"
            @blur="onBlur('refund')" @click="onBlur('refund')" />
        </div>
        <div class="ml-3 flex items-center" @click="setEditable('rebate')">
          <span v-if="rebate">$</span>
          <EditableInput v-model="rebate" placeholder="Rebate" currency :is-editable="isEditable('rebate')"
            @blur="onBlur('rebate')" @click="onBlur('rebate')" />
        </div>
      </div>
      <div class="col-span-2 flex justify-evenly py-1 items-center mb-1" :class="sumClassObj">
        <div>
          <span class="text-white font-semibold text-sm"> <span>$</span>{{ formattedSum }} </span>
        </div>
        <div @click="setEditable('completed')">
          <EditableCheckBoxCell v-model="completed" :is-editable="isEditable('completed')"
            @click="onBlur('completed')" />
        </div>
      </div>
      <div @click="setEditable('deliveryContact')">
        <EditableSelectCell v-model="deliveryContact" :options="contactTypeOptions"
          :is-editable="isEditable('deliveryContact')" placeholder="Delivery1" @blur="onBlur('deliveryContact')" />
      </div>
      <div class="flex space-x-6 justify-center">
        <div @click="setEditable('secondDeliveryContact')">
          <EditableSelectCell v-model="secondDeliveryContact" :options="contactTypeOptions"
            :is-editable="isEditable('secondDeliveryContact')" placeholder="Delivery2"
            @blur="onBlur('secondDeliveryContact')" />
        </div>
        <button @click="setSecondDeliveryContact('CHECK')">
          <font-awesome-icon icon="fa-light fa-money-check" />
        </button>
      </div>
      <div @click="setEditable('dateFiled')">
        <EditableDate v-model="dateFiled" placeholder="Date Filed" type="date" :is-editable="isEditable('dateFiled')"
          @blur="onBlur('dateFiled')" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { events, filingTypes, models, currencies } from '~/shared/constants'
import { formatAsNumber, setAsValidNumber } from '~/shared/utility'
// import { state } from '~/store';

const items = [
  'taxForm',
  'status',
  'statusDetail',
  'statusDate',
  'memo',
  'includeInRefund',
  'paid',
  'owes',
  'includeFee',
  'currency',
  'paidFee',
  'owesFee',
  'fileType',
  'refund',
  'rebate',
  'completed',
  'deliveryContact',
  'secondDeliveryContact',
  'dateFiled',
]

export default {
  name: 'ClientTaxYearCardFilingInfo',
  props: {
    filing: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      editable: '',
      oldValue: '',
      oldCurrencyType: null,
      formModel: null,
      localChanges: [],
      times: 0,
      tiems2: 0,
      isProcessingDate: false,
      dateFieldsInProgress: new Set() // Track date fields currently being processed
    }
  },
  computed: {
    ...mapState([models.valueTypes, models.selectedClient, models.filingsUpdate]),
    headers() {
      return this.$api.getHeaders()
    },
    taxForm: {
      get() {
        return this.formModel?.taxForm
      },
      set(newValue) {
        this.formModel.taxForm = newValue
      },
    },
    state: {
      get() {
        return this.formModel?.state
      },
      set(newValue) {
        this.formModel.state = newValue
      },
    },
    status: {
      get() {
        return this.formModel?.status?.value;
      },
      set(newVal) {
        // Check if the status object is empty or undefined
        if (!this.formModel?.status || Object.keys(this.formModel?.status).length === 0) {
          // Initialize the status object with the given value and current timestamp if empty
          this.formModel.status = {
            value: newVal,
            date: Date.now(),
          };
        } else {
          // Otherwise, just update the existing properties
          this.formModel.status.value = newVal;
          this.formModel.status.date = Date.now();
        }
      },
    },

    statusDetail: {
      get() {
        return this.formModel?.statusDetail?.value;
      },
      set(newVal) {
        // Check if the statusDetail object is empty or undefined
        if (!this.formModel.statusDetail || Object.keys(this.formModel.statusDetail).length === 0) {
          // Initialize the statusDetail object with the given value and current timestamp if empty
          this.formModel.statusDetail = {
            value: newVal,
            date: Date.now(),
          };
        } else {
          // Otherwise, just update the existing properties
          this.formModel.statusDetail.value = newVal;
          this.formModel.statusDetail.date = Date.now();
        }
      },
    },

    statusDate: {
      get() {
        return this.formModel?.statusDate
      },
      set(newVal) {
        this.formModel.statusDate = newVal
      },
    },
    memo: {
      get() {
        return this.formModel?.memo
      },
      set(newVal) {
        this.formModel.memo = newVal
      },
    },
    includeInRefund: {
      get() {
        return this.formModel?.includeInRefund
      },
      set(newVal) {
        this.formModel.includeInRefund = newVal
      },
    },
    owes: {
      get() {
        return this.formModel?.owes
      },
      set(newVal) {
        this.formModel.owes = setAsValidNumber(newVal)
      },
    },
    paid: {
      get() {
        return this.formModel?.paid
      },
      set(newVal) {
        this.formModel.paid = setAsValidNumber(newVal)
      },
    },
    includeFee: {
      get() {
        return this.formModel?.includeFee
      },
      set(newVal) {
        this.formModel.includeFee = newVal
      },
    },
    owesFee: {
      get() {
        return this.formModel?.owesFee
      },
      set(newVal) {
        this.formModel.owesFee = setAsValidNumber(newVal)
      },
    },
    paidFee: {
      get() {
        return this.formModel?.paidFee
      },
      set(newVal) {
        this.formModel.paidFee = setAsValidNumber(newVal)
      },
    },
    fileType: {
      get() {
        return this.formModel?.fileType
      },
      set(newVal) {
        this.formModel.fileType = newVal
      },
    },
    refund: {
      get() {
        return this.formModel?.refund
      },
      set(newVal) {
        this.formModel.refund = setAsValidNumber(newVal)
      },
    },
    rebate: {
      get() {
        return this.formModel?.rebate
      },
      set(newVal) {
        this.formModel.rebate = setAsValidNumber(newVal)
      },
    },
    completed: {
      get() {
        return this.formModel?.completed
      },
      set(newVal) {
        this.formModel.completed = newVal
      },
    },
    sum() {
      return Number(this.refund) + Number(this.rebate)
    },
    formattedSum() {
      if (this.sum) {
        return formatAsNumber(this.sum)
      } else {
        return 0
      }
    },
    sumClassObj() {
      return {
        'bg-gray-400': this.sum === 0,
        'bg-yellow-400': this.sum > 0 && !this.completed,
        'bg-green-400': this.sum > 0 && this.completed,
        'bg-blue-400': this.sum < 0 && !this.completed,
        'bg-red-400': this.sum < 0 && this.completed,
      }
    },
    deliveryContact: {
      get() {
        return this.formModel?.deliveryContact
      },
      set(newVal) {
        this.formModel.deliveryContact = newVal
      },
    },
    secondDeliveryContact: {
      get() {
        return this.formModel?.secondDeliveryContact
      },
      set(newVal) {
        this.formModel.secondDeliveryContact = newVal
      },
    },
    dateFiled: {
      get() {
        return this.formModel?.dateFiled
      },
      set(newVal) {
        this.formModel.dateFiled = newVal
      },
    },
    currency: {

      get() {
        return this.formModel?.currency
      },
      set(newVal) {
        this.oldCurrencyType = this.formModel.currency
        this.formModel.currency = newVal
      },
    },
    filingType() {
      return this.filing?.filingType
    },
    taxFormOptions() {
      return this.valueTypes.tax_form.filter((taxForm) => taxForm.show)
    },
    stateOptions() {
      return this.valueTypes.state
    },
    statusOptions() {
      if (this.filingType === filingTypes.fbar) {
        return this.valueTypes.fbar_status.filter((status) => status.show)
      } else if (this.filingType === filingTypes.state) {
        return this.valueTypes.state_status.filter((status) => status.show)
      } else {
        return this.valueTypes.tax_year_status.filter((status) => status.show)
      }
    },
    statusDetailOptions() {
      const parentId = this.statusOptions.find(
        (statusOption) => statusOption.value === this.formModel?.status
      )?.id;

      const sortOptions = (options) => {
        return options.sort((a, b) => (a.value === "" ? -1 : b.value === "" ? 1 : 0));
      };

      if (this.filingType === filingTypes.fbar) {
        return sortOptions(
          this.valueTypes.fbar_status_detail.filter((status) => {
            if (this.formModel?.status) {
              return status.show && status.parentId === parentId;
            } else {
              return status.show;
            }
          })
        );
      } else if (this.filingType === filingTypes.state) {
        return sortOptions(
          this.valueTypes.state_status_detail.filter((status) => {
            if (this.formModel?.status) {
              return status.show && status.parentId === parentId;
            } else {
              return status.show;
            }
          })
        );
      } else {
        return sortOptions(
          this.valueTypes.tax_year_status_detail.filter((status) => {
            if (this.formModel?.status) {
              return status.show && status.parentId === parentId;
            } else {
              return status.show;
            }
          })
        );
      }
    },
    fileTypeOptions() {
      return this.valueTypes.file_type.filter((fileType) => fileType.show)
    },
    contactTypeOptions() {
      const options = this.valueTypes.contact_type.filter((contactType) => {
        return contactType.show && this.selectedClientContactTypes[contactType.value];
      });

      // Add a blank option at the beginning
      return [{ value: "", label: "Select an option" }, ...options];
    },

    selectedClientContactTypes() {
      const contactTypes = {};
      this.selectedClient.contacts.forEach((contact) => {
        contactTypes[contact.contactType] = true;
      });
      return contactTypes;
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
  },
  watch: {
    //   filing: {
    //     handler(newFiling) {
    //       this.formModel = JSON.parse(JSON.stringify(newFiling))
    //     },
    //     deep: true,
    //   },
    // },

    // created() {
    //   console.log("created")
    //   this.formModel = JSON.parse(JSON.stringify(this.filing));
    //   // Initialize localChanges if needed
    //   if (!this.localChanges.length) {
    //     this.localChanges = [this.formModel];
    //   }
    filing: {
      handler(newFiling) {
        if (newFiling) {
          // Deep clone the filing to avoid reference issues
          this.formModel = JSON.parse(JSON.stringify(newFiling));

          // Check if there are pending updates for this filing in Vuex
          const pendingUpdate = this.filingsUpdate.find(f => f.id === newFiling.id);
          if (pendingUpdate) {
            // Apply pending updates to the form model
            Object.assign(this.formModel, pendingUpdate);
          }
        } else {
          // Initialize with empty object if no filing provided
          this.formModel = {};
        }
      },
      immediate: true, // This ensures the watcher runs immediately when component is created
      deep: true
    }
  },

  created() {
    // Remove the direct formModel initialization here since it's handled by the watcher
    this.localChanges = [];
  },

  updated() {
    // if its state or not for the tabbing
    if (this.filingType === 'state') {
      items[0] = 'state'
    }
  },

  mounted() {
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  },



  methods: {
    handleBeforeUnload(event) {
      if (this.filingsUpdate.length > 0) {
        this.$api.updateFilings(
          this.headers,
          this.filingsUpdate
        )
        this.$store.commit('clearFilingUpdate');
        event.preventDefault();
        event.returnValue = '';
      }
    },
    setEditable(editable) {
      // Early return if formModel isn't initialized
      if (!this.formModel) {
        console.warn('Attempting to edit before form model is initialized');
        return;
      }

      this.dateFieldsInProgress.clear();
      this.editable = editable;

      if (editable === "status" || editable === "statusDetail") {
        this.oldValue = this.formModel[editable]?.value || null;
      } else {
        this.oldValue = typeof this.formModel[editable] === 'object'
          ? JSON.stringify(this.formModel[editable])
          : this.formModel[editable];
      }
    },

    isEditable(value) {
      return this.editable === value
    },

    onBlur(field) {
      // Special handling for date fields
      if (field === 'statusDate' || field === 'dateFiled') {
        // If this field is already being processed, skip
        if (this.dateFieldsInProgress.has(field)) {
          return;
        }

        // Mark this field as being processed
        this.dateFieldsInProgress.add(field);

        // Use setTimeout to allow the date picker to complete its update
        setTimeout(() => {
          const oldValueStr = JSON.stringify(this.oldValue);
          const newValueStr = JSON.stringify(this.formModel[field]);

          // Only proceed with update if values are different
          if (oldValueStr !== newValueStr) {
            this.handleLocalUpdate();
          } else {
            // If no changes, still move to next item
            this.goToNextItem();
          }

          // Remove field from processing set
          this.dateFieldsInProgress.delete(field);
        }, 100);

        return;
      }


      const oldValueStr = JSON.stringify(this.oldValue);
      const newValueStr = field === 'status' || field === 'statusDetail'
        ? JSON.stringify(this.formModel[field]?.value)
        : JSON.stringify(this.formModel[field]);

      // Check if the values are equal and update editability if they are
      if (oldValueStr === newValueStr) {
        this.editable = '';
        return;
      }
      if (['owes', 'paid', 'owesFee', 'paidFee', 'includeInRefund', 'includeFee', 'currency'].includes(field)) {
        const filing = {
          currency: this.currency || 'USD',
          owes: this.owes || 0,
          paid: this.paid || 0,
          owesFee: this.owesFee || 0,
          paidFee: this.paidFee || 0,
          includeInRefund: this.includeInRefund,
          includeFee: this.includeFee
        };

        this.$store.commit('updateFiling', {
          filingId: this.filing.id,
          taxYearId: this.filing.taxYearId,
          data: filing
        });
      }

      if (field === 'currency') {
        if (this.currency === this.oldCurrencyType) return
        // Handle currency change
        const oldCurrency = this.oldValue;
        const newCurrency = this.currency;

        if (oldCurrency !== newCurrency) {
          this.$store.commit('updateFilingCurrency', {
            filingId: this.filing.id,
            oldCurrency,
            newCurrency,
            amount: {
              owes: this.owes || 0,
              paid: this.paid || 0,
              owesFee: this.owesFee || 0,
              paidFee: this.paidFee || 0
            }
          });
        }
      }

      // Continue to handle local update if values differ
      this.handleLocalUpdate();
    },
    onMemoBlur() {
      const oldValueStr = JSON.stringify(this.oldValue);
      const newValueStr = JSON.stringify(this.formModel.memo);

      // If values are equal, just move to next item
      if (oldValueStr === newValueStr) {
        const currentCell = 'memo';
        const itemIndex = items.findIndex((col) => col === currentCell);
        if (itemIndex < items.length - 1) {
          const nextCell = items[itemIndex + 1];
          this.setEditable(nextCell);
        } else {
          this.editable = '';
        }
        return;
      }

      // If values are different, handle the update
      this.onBlur('memo');
    },

    handleLocalUpdate() {

      try {
        const updatedModel = JSON.parse(JSON.stringify(this.formModel));
        const existingIndex = this.filingsUpdate.findIndex(change => change.id === updatedModel.id);

        if (existingIndex > -1) {
          this.$store.dispatch('updateFilingAction', { filing: updatedModel });
        } else {
          this.$store.commit('pushFilingUpdate', updatedModel);
        }
        this.goToNextItem();
      } catch (error) {
        console.error('Error in handleLocalUpdate:', error);
      }
    },

    emitDelete(id) {
      this.$emit(events.delete, id, this.filingType === 'state' ? this.formModel.state : this.formModel.taxForm)

    },

    setSecondDeliveryContact(value) {
      this.secondDeliveryContact = value
      this.handleLocalUpdate()
    },

    goToNextItem() {
      // Store current cell before any editable changes
      const currentCell = this.editable

      // Find index of current cell
      const itemIndex = items.findIndex((col) => col === currentCell)

      // If we have a valid index
      if (itemIndex > -1 && itemIndex < items.length - 1) {
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
      } else {
        this.editable = ''

      }
    },
  },
}
</script>

<style scoped>
.delete-btn {
  @apply absolute;

  top: -5px;
}
</style>
