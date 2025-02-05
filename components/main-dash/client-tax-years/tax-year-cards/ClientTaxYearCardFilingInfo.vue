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
      <div v-if="filingType === 'state'" class="mb-1" @click="setEditable('statusDetail')">
        <EditableSelectCell v-model="statusDetail" :options="statusDetailOptions"
          :is-editable="isEditable('statusDetail')" placeholder="Detail" @blur="onBlur('statusDetail')"
          @keyup.enter.native="onBlur('statusDetail')" />
      </div>
      <div v-else :id="`statusDetail`" class="mb-1" :class="!isEditable('statusDetail') ? 'w-min ml-auto mr-auto' : ''"
        @click="setEditable('statusDetail')">
        <Tooltip :disabled="!isMult(statusDetail) || isEditable('statusDetail')" trigger="hover" :delay="500"
          class="w-full" style="width: 100%;" :placement="isEditable('statusDetail') ? 'left' : 'right'"
          :interactive="true" :html="true">
          <EditableMultiSelect class=" overflow-ellipsis" v-model="statusDetail"
            :shownValue="!isEditable('statusDetail') && isMult(statusDetail) ? 'MULTI' : statusDetail"
            :is-editable="isEditable('statusDetail')" :options="statusDetailOptions" @blur="onBlur('statusDetail')"
            @keyup.enter.native="onBlur('statusDetail', $event)" filingType="true" placeholder="Detail" />
          <template #popper>
            <ul>
              <li v-for="(status, index) in splitYears(statusDetail)" :key="index">
                <span v-if="isMult(statusDetail) && index">{{ status }}</span>
              </li>
            </ul>
          </template>
        </Tooltip>
      </div>
      <div class="mb-1" @click="setEditable('statusDate')">
        <EditableDate v-model="statusDate" placeholder="Date" type="date" :is-editable="isEditable('statusDate')"
          @blur="onBlur('statusDate')" />
      </div>
      <div class="col-span-2 cursor-pointer mb-1 overflow-auto"
        style="min-height: 5rem; max-height: 5rem; word-break: break-word;" @click="setEditable('memo')">
        <EditableTextAreaCell v-model="memo" :prevent-enter="false" show-overflow placeholder="Memo"
          :is-editable="isEditable('memo')" @blur="onMemoBlur($event)" @keyup.tab.native="onMemoBlur"
          @keyup.esc.native="onMemoBlur($event)" class="h-max" />
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
                @blur="onBlur('owes')" @click="onBlur('owes')" @keyup.enter.native="onBlur('owes')"
                @keyup.esc.native="onBlur('owes', $event)" />
            </div>
            <div class="flex items-center" @click="setEditable('paid')">
              <HeaderSelectOption v-if="paid" v-model="currency" :options="currencyOptions" currency
                @input="onBlur('currency')" />
              <EditableInput v-model="paid" placeholder="Paid" currency :is-editable="isEditable('paid')"
                @blur="onBlur('paid')" @click="onBlur('paid')" @keyup.enter.native="onBlur('paid')"
                @keyup.esc.native="onBlur('paid', $event)" />
            </div>
          </div>
        </div>
        <div class="flex flex-col items-center ml-3">
          <div @click="setEditable('maam')">
            <EditableSelectCell v-model="maam" :options="maamOptions" :is-editable="isEditable('maam')"
              placeholder="Maam" @blur="onBlur('maam')" @keyup.enter.native="onBlur('maam')" />
          </div>
          <div @click="setEditable('basicPlusPro')">
            <EditableSelectCell v-model="basicPlusPro" :options="basicPlusProOptions"
              :is-editable="isEditable('basicPlusPro')" placeholder="BasicPlusPro" @blur="onBlur('basicPlusPro')"
              @keyup.enter.native="onBlur('basicPlusPro')" />
          </div>
        </div>
        <!-- <div @click="setEditable('includeFee')">
            <EditableCheckBoxCell v-model="includeFee" :is-editable="isEditable('includeFee')"
              @click="onBlur('includeFee')" />
          </div>
          <div class="flex flex-col">
            <div @click="setEditable('owesFee')">
              <EditableInput v-model="owesFee" placeholder="FC" currency :is-editable="isEditable('owesFee')"
                @blur="onBlur('owesFee')" @keyup.enter.native="onBlur('owesFee')"
                @keyup.esc.native="onBlur('owesFee', $event)" />
            </div>
            <div @click="setEditable('paidFee')">
              <EditableInput v-model="paidFee" placeholder="Insur" currency :is-editable="isEditable('paidFee')"
                @blur="onBlur('paidFee')" @keyup.enter.native="onBlur('paidFee')"
                @keyup.esc.native="onBlur('paidFee', $event)" />
            </div>
          </div> -->
        <!-- </div> -->
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
            @blur="onBlur('refund')" @click="onBlur('refund')" @keyup.enter.native="onBlur('refund', $event)"
            @keyup.esc.native="onBlur('refund', $event)" />
        </div>
        <div class="ml-3 flex items-center" @click="setEditable('rebate')">
          <span v-if="rebate">$</span>
          <EditableInput v-model="rebate" placeholder="Rebate" currency :is-editable="isEditable('rebate')"
            @blur="onBlur('rebate')" @click="onBlur('rebate')" @keyup.enter.native="onBlur('rebate', $event)"
            @keyup.esc.native="onBlur('rebate', $event)" />
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
  // 'includeInRefund',
  'currency',
  'owes',
  'paid',
  // 'includeFee',
  // 'owesFee',
  // 'paidFee',
  'maam',
  'basicPlusPro',
  'fileType',
  'refund',
  'rebate',
  // 'completed',
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
      dateFieldsInProgress: new Set(), // Track date fields currently being processed
      basicPlusProEdit: false,
      maamEdit: false
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
        // Create a new status object to avoid direct mutation
        const newStatus = {
          value: newVal,
          date: Date.now()
        };

        // Create a new formModel object with the updated status
        this.formModel = {
          ...this.formModel,
          status: newStatus
        };
      }
    },

    statusDetail: {
      get() {
        return this.formModel?.statusDetail?.value;
      },
      set(newVal) {
        let res = newVal;

        if (Array.isArray(newVal)) {
          res = newVal.join('\n');
        }

        if (!res.startsWith('\n')) {
          res = '\n' + res;
        }

        // Create a new statusDetail object
        const newStatusDetail = {
          value: res,
          date: Date.now()
        };

        // Create a new formModel object with the updated statusDetail
        this.formModel = {
          ...this.formModel,
          statusDetail: newStatusDetail
        };
      }
    },
    // statusDetail: {
    //   get() {
    //     return this.formModel?.statusDetail?.value;
    //   },
    //   set(newVal) {
    //     let res = newVal;

    //     if (Array.isArray(newVal)) {
    //       res = newVal.join('\n'); // מחבר את המערך עם ירידת שורה
    //     }

    //     // מוסיף ירידת שורה בהתחלה אם לא קיימת אחת
    //     if (!res.startsWith('\n')) {
    //       res = '\n' + res;
    //     }

    //     // Check if the statusDetail object is empty or undefined
    //     if (!this.formModel.statusDetail || Object.keys(this.formModel.statusDetail).length === 0) {
    //       // Initialize the statusDetail object with the given value and current timestamp if empty
    //       this.formModel.statusDetail = {
    //         value: res,
    //         date: Date.now(),
    //       };
    //     } else {
    //       // Otherwise, just update the existing properties
    //       this.formModel.statusDetail.value = res;
    //       this.formModel.statusDetail.date = Date.now();
    //     }
    //   },
    // },

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
    // includeFee: {
    //   get() {
    //     return this.formModel?.includeFee
    //   },
    //   set(newVal) {
    //     this.formModel.includeFee = newVal
    //   },
    // },
    maam: {
      get() {
        return this.formModel?.maam
      },
      set(newVal) {
        this.formModel.maam = newVal
      },
    },
    basicPlusPro: {
      get() {
        return this.formModel?.basicPlusPro
      },
      set(newVal) {
        this.formModel.basicPlusPro = newVal
      },
    },
    // owesFee: {
    //   get() {
    //     return this.formModel?.owesFee
    //   },
    //   set(newVal) {
    //     this.formModel.owesFee = setAsValidNumber(newVal)
    //   },
    // },
    // paidFee: {
    //   get() {
    //     return this.formModel?.paidFee
    //   },
    //   set(newVal) {
    //     this.formModel.paidFee = setAsValidNumber(newVal)
    //   },
    // },
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
        return this.formModel.currency || 'NIS'
      },
      set(newVal) {
        console.log(newVal)
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
      // const parentId = this.statusOptions.find(
      //   (statusOption) => statusOption.value === this.formModel?.status
      // )?.id;


      const sortOptions = (options) => {
        return options.sort((a, b) => (a.value === "" ? -1 : b.value === "" ? 1 : 0));
      };

      if (this.filingType === filingTypes.fbar) {
        return sortOptions(
          this.valueTypes.fbar_status_detail.filter((status) => {
            if (this.formModel?.status) {
              return status.show
              // && status.parentId === parentId;
            } else {
              return status.show;
            }
          })
        );
      } else if (this.filingType === filingTypes.state) {
        return sortOptions(
          this.valueTypes.state_status_detail.filter((status) => {
            if (this.formModel?.status) {
              return status.show
              // && status.parentId === parentId;
            } else {
              return status.show;
            }
          })
        );
      } else {
        return sortOptions(
          this.valueTypes.tax_year_status_detail.filter((status) => {
            if (this.formModel?.status) {
              return status.show
              //  && status.parentId === parentId;
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
    maamOptions() {
      return this.valueTypes.maam.filter((maam) => maam.show)
    },
    basicPlusProOptions() {
      return this.valueTypes.basic_plus_pro.filter((basicPlusPro) => basicPlusPro.show)
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
          // Create a new object instead of mutating state
          const newModel = JSON.parse(JSON.stringify(newFiling))

          // Check for pending updates
          const pendingUpdate = this.filingsUpdate.find(f => f.id === newFiling.id)
          if (pendingUpdate) {
            Object.assign(newModel, pendingUpdate)
          } else {
            if (newFiling.filingType === 'federal' && newFiling.taxForm === null) {
              this.$nextTick(() => this.setEditable('taxForm'))
            }
            if (newFiling.filingType === 'state' && newFiling.state === null) {
              this.$nextTick(() => this.setEditable('state'))
            }
          }

          // Assign to formModel after all modifications
          this.formModel = newModel
        } else {
          this.formModel = {}
        }
      },
      immediate: true,
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

      if (editable === 'maam') this.maamEdit = true
      if (editable === 'basicPlusPro') this.basicPlusProEdit = true

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

    onBlur(field, event) {
      if (field === 'taxForm' || field === 'state') {
        const val = JSON.parse(JSON.stringify(this.formModel))
        this.$store.commit('updateFilingTab', { filing: val, taxYearId: this.filing.taxYearId })
      }
      if (field === 'maam') this.maamEdit = false
      if (field === 'basicPlusPro') this.basicPlusProEdit = false

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


      const oldValueStr = JSON.stringify(this.oldValue) || ''; // Fallback to empty string
      const newValueStr = field === 'status' || field === 'statusDetail'
        ? JSON.stringify(this.formModel[field]?.value) || ''
        : JSON.stringify(this.formModel[field]) || '';
      // Updated condition to ensure proper type handling
      if (
        oldValueStr === newValueStr ||
        (oldValueStr === "" && newValueStr === "") ||
        (oldValueStr === "null" && newValueStr === "undefined" || newValueStr === "") ||
        (oldValueStr === "undefined" && newValueStr === "null" || newValueStr === "")
      ) {
        if (event?.key === 'Enter') {
          this.goToNextItem();
          return
        }
        this.editable = '';
        return;
      }
      if (['owes', 'paid', 'includeInRefund', 'currency'].includes(field)) {
        const filing = {
          currency: this.currency || 'NIS',
          owes: Number(this.owes) || 0,
          paid: Number(this.paid) || 0,
          includeInRefund: this.includeInRefund,
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
              owes: Number(this.owes) || 0,
              paid: Number(this.paid) || 0,
            }
          });
        }
      }

      // Continue to handle local update if values differ
      this.handleLocalUpdate(event);
    },
    onMemoBlur(event = null) {
      if (event && event.shiftKey && event.key === "Tab") return;
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
      this.onBlur('memo', event);
    },

    handleLocalUpdate(event = null) {
      try {
        const updatedModel = JSON.parse(JSON.stringify(this.formModel));
        const existingIndex = this.filingsUpdate.findIndex(change => change.id === updatedModel.id);

        if (existingIndex > -1) {
          this.$store.dispatch('updateFilingAction', { filing: updatedModel });
        } else {
          this.$store.commit('pushFilingUpdate', updatedModel);
        }
        if (event?.key === 'Escape') {
          this.editable = ''
          return
        };
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
    splitYears(years) {
      if (!years) return []; // Handle null or undefined safely
      if (Array.isArray(years)) return years; // If it's already an array, return as-is

      return String(years).split(/\r?\n/); // Ensure it's a string before splitting
    },
    /* eslint-disable no-control-regex */
    isMult(year) {
      if (Array.isArray(year)) return year.length > 1; // If it's an array, check if it has multiple items

      if (!year) return false; // Handle null or undefined

      return /\r|\n|\u000B/.test(String(year)); // Ensure it's a string before testing
    }
    ,
    /* eslint-enable no-control-regex */
  },
}
</script>

<!-- <style scoped>
.delete-btn {
  @apply absolute;

  top: -5px;
}
</style> -->
