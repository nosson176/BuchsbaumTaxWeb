<template>
  <div class="text-xs flex gap-2 transform rotate-90" @keydown.tab.prevent @keyup.tab.exact="goToNextItem"
    @keyup.shift.tab.exact="goToPrevItem">
    <DeleteButton class="mx-1" small @click="emitDelete" />

    <div @click.stop="setEditable('taxForm')" class="relative">
      <EditableSelectCell v-model="formModel.taxForm" type="taxForm" class="font-bold ml-2 whitespace-nowrap transform"
        :class="rotationClass('taxForm')" :options="taxFormOptions" :is-editable="isEditable('taxForm')"
        placeholder="Tax Form" ref="taxFormInput" @blur="onBlur(formModel.taxForm, 'taxForm')" />
    </div>

    <div @click.stop="setEditable('status')" class="relative">
      <EditableSelectCell v-model="formModel.status.value" class="font-bold ml-2 whitespace-nowrap transform"
        :options="statusOptions" :is-editable="isEditable('status')" placeholder="Status"
        @blur="onBlur(formModel.status.value, 'status')" :class="rotationClass('status')" />
    </div>

    <div @click.stop="setEditable('includeTax')">
      <EditableCheckBoxCell class="transform" v-model="formModel.includeTax" :is-editable="isEditable('includeTax')"
        @click="handleUpdate('includeTax')" :class="rotationClass('includeTax')" />
    </div>

    <div @click.stop="setEditable('tax')" class="relative">
      <EditableInput class="transform" style="min-width: 35px;" v-model="formModel.taxEstimated" placeholder="tax"
        :is-editable="isEditable('tax')" @blur="onBlur(formModel.taxEstimated, 'tax')"
        @keyup.enter.native="onBlur('tax')" @keyup.esc.native="onBlur(formModel.taxEstimated, 'tax', $event)"
        :class="rotationClass('tax')" />
    </div>

    <div class="col-span-2 flex gap-2 px-2 items-center mb-1 transform" style="min-width: 80px;"
      :class="[sumClassObj, rotationClass('sum')]">
      <div @click.stop="setEditable('refund')">
        <EditableInput v-model="formModel.refund" placeholder="Refund" currency :is-editable="isEditable('refund')"
          @blur="onBlur(formModel.refund, 'refund')" @keyup.enter.native="onBlur(formModel.refund, 'refund', $event)"
          @keyup.esc.native="onBlur(formModel.refund, 'refund', $event)" />
      </div>
      <div @click="setEditable('completed')">
        <EditableCheckBoxCell class="transform" v-model="formModel.completed" :is-editable="isEditable('completed')"
          @click="handleUpdate('completed')" :class="rotationClass('completed')" />
      </div>
    </div>

    <div @click.stop="setEditable('statusDate')" class="relative mx-2">
      <EditableDate class="transform" v-model="formModel.statusDate" ref="statusDateInput" placeholder="Date"
        type="date" :is-editable="isEditable('statusDate')" @blur="onBlur(formModel.statusDate, 'statusDate')"
        :class="rotationClass('statusDate')" />
    </div>
  </div>
</template>


<script>
import { mapState } from 'vuex'
import ClickOutside from 'vue-click-outside'
import { events, models } from '~/shared/constants'
import { formatAsNumber } from '~/shared/utility';

const items = ['taxForm', 'status', 'tax', 'refund', 'statusDate']

export default {
  name: 'ClientTaxYearExtension',
  directives: {
    ClickOutside,
  },
  props: {
    extension: {
      type: Object,
      default: () => { },
    },
  },
  data() {
    return {
      editable: '',
      formModel: null,
      newFlag: false,
      oldValue: null
    }
  },
  computed: {
    ...mapState([models.valueTypes, models.selectedClient, models.filingsUpdate]),
    headers() {
      return this.$api.getHeaders()
    },
    taxFormOptions() {
      return this.valueTypes.tax_form.filter((taxForm) => taxForm.show)
    },
    statusOptions() {
      return this.valueTypes.tax_year_status.filter((status) => status.show)
    },
    sum() {
      return this.formModel.taxEstimated || 0
    },
    refund() {
      return this.formModel.refund || 0
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
        'bg-gray-400': this.refund === 0,
        'bg-yellow-400': this.refund > 0 && !this.formModel.completed,
        'bg-green-400': this.refund > 0 && this.formModel.completed,
        'bg-blue-400': this.refund < 0 && !this.formModel.completed,
        'bg-red-400': this.refund < 0 && this.formModel.completed,
      }
    },
    rotationClass() {
      return (field) => {
        // Base rotation when not editing
        const baseRotation = '-rotate-180';

        // If not being edited, return base rotation
        if (!this.isEditable(field)) {
          return baseRotation;
        }

        // Special rotation for editable state
        switch (field) {
          case 'taxForm':
          case 'status':
          case 'completed':
          case 'sum':
          case 'tax':
          case 'includeTax':
            return '-rotate-90'; // For dropdowns, rotate to make them appear correctly
          case 'statusDate':
            return 'rotate-0'; // For date picker, no rotation when active
          default:
            return baseRotation;
        }
      };
    }
  },
  created() {
    this.formModel = JSON.parse(JSON.stringify(this.extension))
    this.$nextTick(async () => {
      const num = await this.countFilledFields()
      this.$emit('checkSpace', num);
    })
  },
  // updated() {
  //   if (this.isEditable) {
  //     this.$nextTick(() => {
  //       // Open the date picker automatically
  //       this.showPicker = true;

  //       // Focus on the input if it exists
  //       if (this.$refs.input) {
  //         this.$refs.input.focus();
  //       }
  //     });
  //   }
  // },

  watch: {
    extension: {
      handler(newFiling) {
        if (newFiling) {
          // Deep clone the filing to avoid reference issues
          this.formModel = JSON.parse(JSON.stringify(newFiling));

          // Check if there are pending updates for this filing in Vuex
          const pendingUpdate = this.filingsUpdate.find(f => f.id === newFiling.id);
          if (pendingUpdate) {
            // Apply pending updates to the form model
            Object.assign(this.formModel, pendingUpdate);
          } else if (newFiling.filingType === 'ext' && newFiling.taxForm === null) {
            this.setEditable('taxForm', true);
            this.newFlag = true
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
  methods: {
    getStatusDateRef() {
      return this.$refs.statusDateInput;
    },
    setEditable(editable) {
      this.editable = editable;

      if (editable === "status") {
        this.oldValue = this.formModel[editable]?.value || null;
      } else {
        this.oldValue = typeof this.formModel[editable] === 'object'
          ? JSON.stringify(this.formModel[editable])
          : this.formModel[editable];
      }
      // if (editable === 'taxForm' && openDropdown) {
      //   this.$nextTick(() => {
      //     const taxFormInput = this.$refs.taxFormInput;
      //     if (taxFormInput && typeof taxFormInput.open === 'function') {
      //       taxFormInput.open(); // Programmatically open the dropdown if supported
      //     }
      //   });
      // }
    },
    isEditable(value) {
      return this.editable === value
    },
    onBlur(val) {
      if (this.newFlag) {
        this.newFlag = false
        return
      }
      if (typeof (val) === 'object') return this.setEditable('')
      if (this.oldValue !== val && val !== undefined && val !== null) {
        this.handleUpdate()
        return
      }

      this.setEditable('')
    },
    async handleUpdate(field) {
      try {
        const updatedModel = JSON.parse(JSON.stringify(this.formModel));
        const existingIndex = this.filingsUpdate.findIndex(change => change.id === updatedModel.id);

        if (existingIndex > -1) {
          this.$store.dispatch('updateFilingAction', { filing: updatedModel });
        } else {
          this.$store.commit('pushFilingUpdate', updatedModel);
        }
        if (!this.newFlag && field !== 'includeTax' && field !== 'completed') {
          let num = await this.countFilledFields()
          if (!num) { num = 0 }
          this.$emit('checkSpace', num);
          this.goToNextItem(); // Only go to the next item if `newFlag` is false
        }
      } catch (error) {
        console.error('Error in handleLocalUpdate:', error);
      }
    },
    countFilledFields() {
      const fields = ['taxForm', 'status', 'statusDate'];
      return fields.reduce((count, field) => {
        const value = this.formModel[field];
        if (field === 'status' && value?.value !== undefined) {
          return count + 1;
        }
        if (field === 'status') return count
        if (field === 'statusDate' && value === 0) return count
        return value ? count + 1 : count;
      }, 0);
    },

    emitDelete() {
      this.$emit(events.delete, this.extension.id)
    },
    goToNextItem() {
      const currentCell = this.editable;
      const itemIndex = items.findIndex((col) => col === currentCell);

      if (itemIndex < items.length - 1) {
        const nextCell = items[itemIndex + 1];
        this.setEditable(nextCell);
      } else {
        this.setEditable('');
      }
    },
    goToPrevItem() {
      const currentCell = this.editable
      const itemIndex = items.findIndex((col) => col === currentCell)
      if (itemIndex > 0) {
        const prevCell = items[itemIndex - 1]
        this.setEditable(prevCell)
      }
    },
    callParent() {
      this.$emit('checkSpace');
    }
  },
}
</script>

<!-- <style scoped>
.ext-i {
  position: relative;
  transform: rotate(90deg);
}


.select-cell-ext {
  transform: rotate(90deg);
  min-width: 40px;

}
</style> -->
