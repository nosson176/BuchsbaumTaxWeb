<template>
  <div class="fbar max-w-xs" @keydown.tab.prevent @keyup.shift.tab.exact="goToPrevItem">
    <DeleteButton class="mx-1" small @click="emitDelete" />
    <div class="fbar-i">
      <div v-if="!isEditable('fileType')" @click.stop="setEditable('fileType')">
        <EditableSelectCell v-model="formModel.fileType" class="font-bold ml-2 " :options="fileTypeOptions"
          :is-editable="false" placeholder="Type" initiallyOpen=true />
      </div>
      <div v-else>
        <EditableSelectCell v-model="formModel.fileType" class="font-bold ml-2 whitespace-nowrap "
          :options="fileTypeOptions" :is-editable="true" placeholder="Type"
          @blur="onBlur(formModel.fileType, 'fileType', $event)"
          @keyup.tab.native="onBlur(formModel.fileType, 'fileType', $event)" initiallyOpen=true />
      </div>
    </div>
    <div class="fbar-i max-w-full">
      <div v-if="!isEditable('status')" @click.stop="setEditable('status')">
        <EditableSelectCell v-model="formModel.status.value" :options="statusOptions" class="whitespace-nowrap"
          :is-editable="false" placeholder="Status" initiallyOpen=true />
      </div>
      <div v-else>
        <EditableSelectCell v-model="formModel.status.value" :options="statusOptions" class="whitespace-nowrap "
          :is-editable="true" placeholder="Status" @blur="onBlur(formModel.status.value, 'status', $event)"
          @keyup.tab.native="onBlur(formModel.status.value, 'status', $event)" initiallyOpen=true />
      </div>
    </div>
    <div class="fbar-i max-w-full">
      <div v-if="!isEditable('statusDetail')" @click.stop="setEditable('statusDetail')">
        <EditableSelectCell v-model="formModel.statusDetail.value" :options="statusDetailOptions"
          class="whitespace-nowrap" :is-editable="false" placeholder="Detail" initiallyOpen=true />
      </div>
      <div v-else>
        <EditableSelectCell v-model="formModel.statusDetail.value" class="whitespace-nowrap "
          :options="statusDetailOptions" :is-editable="true" placeholder="Detail"
          @blur="onBlur(formModel.statusDetail.value, 'statusDetail')"
          @keyup.tab.native="onBlur(formModel.statusDetail.value, 'statusDetail', $event)" initiallyOpen=true />
      </div>
    </div>
    <div class="fbar-i" @click.stop="setEditable('statusDate')">
      <EditableDate v-model="formModel.statusDate" placeholder="Date" type="date"
        :is-editable="isEditable('statusDate')" @blur="onBlur(formModel.statusDate, 'statusDate', $event)" />
    </div>

    <div v-if="isEditable('memo')">
      <EditableTextAreaCell v-model="formModel.memo" ref="memoInput" :position="false" :is-editable="true"
        placeholder="memo" @blur="onBlur(formModel.memo, 'memo')"
        @keyup.esc.native="onBlur(formModel.memo, 'memo', $event)"
        @keyup.tab.native="onBlur(formModel.memo, 'memo', $event)" class="w-full" style="min-height: 5rem;" />
    </div>
    <div v-else class="cursor-pointer mb-1 relative h-20" :class="isOverflow ? 'overflow-visible' : 'overflow-auto'"
      @mouseenter="!isEditable('memo') && showTooltip(idx)" @mouseleave="hideTooltip"
      style="max-height: 5rem; max-width: 5rem; " @click="setEditable('memo')">
      <EditableTextAreaCell v-model="formModel.memo" :prevent-enter="false" show-overflow placeholder="Memo"
        :is-editable="false" :over="false" class="h-full" />
      <!-- Custom Tooltip -->
      <div v-show="activeTooltipIndex === idx && !isEditable(`${idx}-memo`)"
        class="absolute z-50 bg-gray-800 text-white p-2 rounded-md shadow-lg max-w-md whitespace-normal break-words overflow-visible"
        style="top: calc(50% + 25%); right: 0; max-width: inherit;">
        <div class="absolute -top-2 left-4 border-8 border-transparent border-b-gray-800"></div>
        {{ formModel.memo }}
      </div>
    </div>
    <div class="flex items-center gap-2">
      <div @click="setEditable('includeInRefund')">
        <EditableCheckBoxCell v-model="formModel.includeInRefund" :is-editable="isEditable('includeInRefund')"
          @click="onBlur(formModel.includeInRefund, 'includeInRefund')"
          @keyup.tab.native="onBlur(formModel.includeInRefund, 'includeInRefund', $event)" />
      </div>
      <div class="flex flex-col">
        <div class="flex items-baseline" @click="setEditable('owes')">
          <HeaderSelectOption v-if="formModel.owes" v-model="formModel.currency" :options="currencyOptions" currency
            @input="onBlur(formModel.currency, 'currency', $event)" style="margin: -5px;" />
          <EditableInput v-model="formModel.owes" placeholder="Owes" currency :is-editable="isEditable('owes')"
            @blur="onBlur(formModel.owes, 'owes', $event)" @click="onBlur(formModel.owes, 'owes', $event)"
            @keyup.enter.native="onBlur(formModel.owes, 'owes', $event)"
            @keyup.esc.native="onBlur(formModel.owes, 'owes', $event)"
            @keyup.tab.native="onBlur(formModel.owes, 'owes', $event)" />
        </div>
        <div class="flex items-baseline " @click="setEditable('paid')">
          <HeaderSelectOption style="margin: -5px; margin-top: 0;" v-if="formModel.paid" v-model="formModel.currency"
            :options="currencyOptions" currency @input="onBlur(formModel.currency, 'currency', $event)" />
          <EditableInput v-model="formModel.paid" placeholder="Paid" currency :is-editable="isEditable('paid')"
            @blur="onBlur(formModel, 'paid', $event)" @click="onBlur(formModel, 'paid', $event)"
            @keyup.enter.native="onBlur(formModel, 'paid', $event)"
            @keyup.esc.native="onBlur(formModel, 'paid', $event)"
            @keyup.tab.native="onBlur(formModel, 'paid', $event)" />
        </div>
      </div>
    </div>
    <!-- <div class="mt-85"> -->
    <div class="fbar-i mt-16" @click.stop="setEditable('dateFiled')">
      <EditableDate v-model="formModel.dateFiled" placeholder="Date Filed" type="date"
        :is-editable="isEditable('dateFiled')" @blur="onBlur(formModel.dateFiled, 'dateFiled')"
        @keyup.tab.native="onBlur(formModel.dateFiled, 'dateFiled', $event)" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ClickOutside from 'vue-click-outside'
import { currencies, events, models } from '~/shared/constants'

const items = ['fileType', 'status', 'statusDetail', 'statusDate', 'memo', 'owes', 'paid', 'dateFiled']

export default {
  name: 'ClientTaxYearFbar',
  directives: {
    ClickOutside,
  },
  props: {
    fbar: {
      type: Object,
      default: () => ({}),
    },
    idx: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      editable: '',
      formModel: null,
      activeTooltipIndex: null,
      tooltipTimer: null, // Timer to control tooltip delay
      isOverflow: false,
      oldValue: '',
      newFlag: true,
      dateFieldsInProgress: new Set(), // Track date fields currently being processed
    }
  },

  computed: {
    ...mapState([models.valueTypes, models.selectedClient, models.filingsUpdate]),
    headers() {
      return this.$api.getHeaders()
    },
    statusOptions() {
      return this.valueTypes.fbar_status.filter((status) => status.show)
    },
    statusDetailOptions() {
      // const parentId = this.valueTypes.fbar_status.find((status) => status.value === this.formModel.status.value)?.id
      // const parentId = this.valueTypes.fbar_status.find((status) => status.value === this.formModel.status)?.id
      return this.valueTypes.fbar_status_detail.filter((status) =>
        // status.parentId === parentId &&
        status.show
      )
    },
    fileTypeOptions() {
      return this.valueTypes.fbar_filing.filter((fileType) => fileType.show)
    },
    currencyOptions() {
      return [{ value: currencies.USD.type }, { value: currencies.NIS.type }]
    },
  },
  watch: {
    fbar: {
      handler(newFiling) {
        if (newFiling) {
          // Deep clone the filing to avoid reference issues
          this.formModel = JSON.parse(JSON.stringify(newFiling));

          // Check if there are pending updates for this filing in Vuex
          const pendingUpdate = this.filingsUpdate.find(f => f.id === newFiling.id);
          if (pendingUpdate) {
            // Apply pending updates to the form model
            Object.assign(this.formModel, pendingUpdate);
          } else if (newFiling.filingType === 'fbar' && !newFiling.taxForm) {
            if (!newFiling.newFbar) {
              return
            }
            this.setEditable('fileType');
            this.isEditable('fileType');
            delete newFiling.newFbar
          }
        } else {
          // Initialize with an empty object if no filing provided
          this.formModel = {};
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.formModel = JSON.parse(JSON.stringify(this.fbar))
  },
  methods: {
    showTooltip(idx) {
      if (this.formModel.memo?.length < 1 || this.formModel.memo === null) return
      if (this.tooltipTimer) {
        clearTimeout(this.tooltipTimer);
      }
      this.isOverflow = true
      this.tooltipTimer = setTimeout(() => {
        this.activeTooltipIndex = idx;
      }, 500);
    },

    hideTooltip() {
      if (this.tooltipTimer) {
        clearTimeout(this.tooltipTimer);
      }
      this.activeTooltipIndex = null;
      this.isOverflow = false
    },
    setEditable(editable) {
      if (!this.formModel) {
        console.warn('Attempting to edit before form model is initialized');
        return;
      }

      this.editable = editable;

      this.$nextTick(() => {
        if (editable === 'memo' && this.$refs.memoInput) {
          this.$refs.memoInput.focus();  // Assuming EditableTextAreaCell has a focus method.
        }
      });


      if (editable === "status" || editable === "statusDetail") {
        this.oldValue = this.formModel[editable]?.value || null;
      } else {
        this.oldValue = typeof this.formModel[editable] === 'object'
          ? JSON.stringify(this.formModel[editable])
          : this.formModel[editable];
      }
      if (editable === 'memo') this.activeTooltipIndex = null;
    },
    isEditable(value) {
      return this.editable === value
    },

    async onBlur(val, field, event = null) {
      // console.log('onBlur', val, field, event)
      if (field === 'memo') this.activeTooltipIndex = null;

      if (field === 'statusDate') {
        // If this field is already being processed, skip
        if (this.dateFieldsInProgress.has(field)) {
          return;
        }


        // Mark this field as being processed
        this.dateFieldsInProgress.add(field);

        // Use setTimeout to allow the date picker to complete its update
        setTimeout(() => {
          const oldValueStr = JSON.stringify(this.oldValue);

          // Only proceed with update if values are different
          if (oldValueStr !== val) {
            this.handleUpdate(field, event);
            this.goToNextItem();
          } else {
            // If no changes, still move to next item
            this.goToNextItem();
          }

          // Remove field from processing set
          this.dateFieldsInProgress.delete(field);
        }, 100);

        return;
      }

      if (this.oldValue !== val && event !== false) {
        console.log('onBlur111')
        this.handleUpdate(field, event)
        this.goToNextItem()
        return
      }

      if (event?.key === 'Tab') {
        console.log('Tab', val)
        event.stopPropagation();
        await this.handleUpdate(field, event)
        this.goToNextItem()
        return
      }
      console.log(field)
      this.setEditable('')
    },


    handleUpdate(field, event = null) {
      if (['owes', 'paid', 'includeInRefund', 'currency'].includes(field)) {
        const filing = {
          currency: this.formModel.currency || 'NIS',
          owes: Number(this.formModel.owes) || 0,
          paid: Number(this.formModel.paid) || 0,
          includeInRefund: this.formModel.includeInRefund,
        };

        this.$store.commit('updateFiling', {
          filingId: this.formModel.id,
          taxYearId: this.fbar.taxYearId,
          data: filing
        });
      }

      if (field === 'currency') {
        // Handle currency change
        const oldCurrency = this.oldValue;
        const newCurrency = this.formModel.currency;

        if (oldCurrency !== newCurrency) {
          this.$store.commit('updateFilingCurrency', {
            filingId: this.formModel.id,
            oldCurrency,
            newCurrency,
            amount: {
              owes: Number(this.formModel.owes) || 0,
              paid: Number(this.formModel.paid) || 0,
            }
          });
        }
      }
      try {
        const updatedModel = JSON.parse(JSON.stringify(this.formModel));
        const existingIndex = this.filingsUpdate.findIndex(change => change.id === updatedModel.id);
        if (field === 'statusDetail') updatedModel.statusDetail.date = Date.now()

        if (existingIndex > -1) {
          this.$store.dispatch('updateFilingAction', { filing: updatedModel });
        } else {
          this.$store.commit('pushFilingUpdate', updatedModel);
        }
        if (event?.key === 'Escape') {
          this.setEditable('')
          return
        }
        if (field === 'includeInRefund') return this.setEditable('')
        // this.goToNextItem();
      } catch (error) {
        console.error('Error in handleLocalUpdate:', error);
      }
    },
    emitDelete() {
      this.$emit(events.delete, this.fbar.id)
    },
    goToNextItem() {
      const currentCell = this.editable
      const itemIndex = items.findIndex((col) => col === currentCell)
      if (itemIndex < items.length - 1) {
        const nextCell = items[itemIndex + 1]
        console.log(nextCell)
        this.setEditable(nextCell)
      } else this.setEditable('')
    },
    goToPrevItem() {
      const currentCell = this.editable
      const itemIndex = items.findIndex((col) => col === currentCell)
      if (itemIndex > 0) {
        const prevCell = items[itemIndex - 1]
        this.setEditable(prevCell)
      }
    },
  },
}
</script>

<style scoped>
.fbar {
  @apply text-xs flex flex-col items-center p-2;

  /* justify-content: space-between; */

  gap: 0.5rem;
  min-height: 280px;
  width: 100%;
  margin-bottom: 10px;
  overflow: visible;
}




.select-cell {
  min-width: 40px;
  margin-top: 55px;

  /* transform: rotate(270deg); */
}
</style>