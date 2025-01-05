<template>
  <div class="text-xs flex transform -rotate-90" @keydown.tab.prevent @keyup.tab.exact="goToNextItem"
    @keyup.shift.tab.exact="goToPrevItem">
    <DeleteButton class="mx-1" small @click="emitDelete" />
    <div class="mx-2" @click="setEditable('statusDate')">
      <EditableDate v-model="formModel.statusDate" placeholder="Date" type="date"
        :is-editable="isEditable('statusDate')" @blur="onBlur" @input="handleUpdate" />
    </div>
    <div v-if="!isEditable('status')" @click.stop="setEditable('status')">
      <EditableSelectCell v-model="formModel.status.value" class="font-bold ml-2 whitespace-nowrap "
        :options="statusOptions" :is-editable="isEditable('status')" placeholder="Status" @blur="onBlur"
        @input="handleUpdate" />
    </div>
    <div v-else v-click-outside="onBlur" class="absolute top-0 h-48 w-40">
      <EditableSelectCell v-model="formModel.status.value" class="font-bold ml-2 whitespace-nowrap transform rotate-90"
        :options="statusOptions" is-editable placeholder="Status" @blur="onBlur" @input="handleUpdate" />
    </div>
    <div v-if="!isEditable('taxForm')" @click.stop="setEditable('taxForm')">
      <EditableSelectCell v-model="formModel.taxForm" class="font-bold ml-2 whitespace-nowrap" :options="taxFormOptions"
        :is-editable="isEditable('taxForm')" placeholder="Tax Form" @blur="onBlur" @input="handleUpdate" />
    </div>
    <div v-else v-click-outside="onBlur" class="absolute top-0 h-48 w-40">
      <EditableSelectCell v-model="formModel.taxForm" class="font-bold ml-2 whitespace-nowrap transform rotate-90"
        :options="taxFormOptions" is-editable placeholder="Tax Form" @blur="onBlur" @input="handleUpdate" />
    </div>
  </div>
</template>


<script>
import { mapState } from 'vuex'
import ClickOutside from 'vue-click-outside'
import { events, models } from '~/shared/constants'

const items = ['statusDate', 'status', 'taxForm']

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
  methods: {
    setEditable(editable) {
      this.editable = editable
    },
    isEditable(value) {
      return this.editable === value
    },
    onBlur() {
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

        this.goToNextItem();
      } catch (error) {
        console.error('Error in handleLocalUpdate:', error);
      }
    },
    emitDelete() {
      this.$emit(events.delete, this.extension.id)
    },
    goToNextItem() {
      const currentCell = this.editable
      const itemIndex = items.findIndex((col) => {
        return col === currentCell
      })
      if (itemIndex < items.length - 1) {
        const nextCell = items[itemIndex + 1]
        this.setEditable(nextCell)
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

<style scoped>
.ext-i {
  position: relative;
  transform: rotate(90deg);
}


.select-cell-ext {
  transform: rotate(90deg);
  min-width: 40px;

}
</style>
