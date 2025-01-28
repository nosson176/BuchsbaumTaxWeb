<template>
  <div class="text-xs flex transform -rotate-90" @keydown.tab.prevent @keyup.tab.exact="goToNextItem"
    @keyup.shift.tab.exact="goToPrevItem">
    <DeleteButton class="mx-1" small @click="emitDelete" />
    <div v-if="!isEditable('taxForm')" @click.stop="setEditable('taxForm')">
      <EditableSelectCell v-model="formModel.taxForm" type="taxForm" class="font-bold ml-2 whitespace-nowrap"
        :options="taxFormOptions" :is-editable="isEditable('taxForm')" placeholder="Tax Form" />
    </div>
    <div v-else v-click-outside="onBlur" class="absolute top-0 h-48 w-40">
      <EditableSelectCell v-model="formModel.taxForm" ref="taxFormInput"
        class="font-bold ml-2 whitespace-nowrap transform rotate-90" :options="taxFormOptions" is-editable
        placeholder="Tax Form" @blur="onBlur(formModel.taxForm, 'taxForm')" :initially-open="newFlag" />
    </div>
    <div v-if="!isEditable('status')" @click.stop="setEditable('status')">
      <EditableSelectCell v-model="formModel.status.value" class="font-bold ml-2 whitespace-nowrap "
        :options="statusOptions" :is-editable="isEditable('status')" placeholder="Status" />
    </div>
    <div v-else v-click-outside="onBlur" class="absolute top-0 h-48 w-40">
      <EditableSelectCell v-model="formModel.status.value" class="font-bold ml-2 whitespace-nowrap transform rotate-90"
        :options="statusOptions" is-editable placeholder="Status" @blur="onBlur(formModel.status.value, 'status')" />
    </div>
    <div class="mx-2" @click="setEditable('statusDate')">
      <EditableDate v-model="formModel.statusDate" placeholder="Date" type="date"
        :is-editable="isEditable('statusDate')" @blur="onBlur(formModel.statusDate, 'statusDate')" />
    </div>
  </div>
</template>


<script>
import { mapState } from 'vuex'
import ClickOutside from 'vue-click-outside'
import { events, models } from '~/shared/constants'

const items = ['taxForm', 'status', 'statusDate']

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
  },
  created() {
    this.formModel = JSON.parse(JSON.stringify(this.extension))
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
    handleUpdate() {
      try {
        const updatedModel = JSON.parse(JSON.stringify(this.formModel));
        const existingIndex = this.filingsUpdate.findIndex(change => change.id === updatedModel.id);

        if (existingIndex > -1) {
          this.$store.dispatch('updateFilingAction', { filing: updatedModel });
        } else {
          this.$store.commit('pushFilingUpdate', updatedModel);
        }

        if (!this.newFlag) {
          this.goToNextItem(); // Only go to the next item if `newFlag` is false
        }
      } catch (error) {
        console.error('Error in handleLocalUpdate:', error);
      }
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
