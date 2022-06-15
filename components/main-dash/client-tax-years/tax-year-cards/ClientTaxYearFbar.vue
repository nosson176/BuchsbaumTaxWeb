<template>
  <div class="fbar" @click="setEditable('')">
    <div v-if="!isEditable('taxForm')" @click.stop="setEditable('taxForm')">
      <EditableSelectCell
        v-model="formModel.taxForm"
        class="font-bold ml-2 whitespace-nowrap"
        :options="taxFormOptions"
        :is-editable="isEditable('taxForm')"
        placeholder="Tax Form"
        @blur="onBlur"
        @input="handleUpdate"
      />
    </div>
    <div v-else class="absolute top-0 h-48 w-48">
      <EditableSelectCell
        v-model="formModel.taxForm"
        class="font-bold ml-2 whitespace-nowrap select-cell"
        :options="taxFormOptions"
        is-editable
        placeholder="Tax Form"
        @blur="onBlur"
        @input="handleUpdate"
      />
    </div>
    <div v-if="!isEditable('status')" class="mx-2" @click.stop="setEditable('status')">
      <EditableSelectCell
        v-model="formModel.status"
        :options="statusOptions"
        class="whitespace-nowrap"
        :is-editable="isEditable('status')"
        placeholder="Status"
        @blur="onBlur"
        @input="handleUpdate"
      />
    </div>
    <div v-else class="absolute top-0 left-12 h-48 w-48">
      <EditableSelectCell
        v-model="formModel.status"
        :options="statusOptions"
        class="whitespace-nowrap select-cell"
        is-editable
        placeholder="Status"
        @blur="onBlur"
        @input="handleUpdate"
      />
    </div>
    <div @click.stop="setEditable('statusDate')">
      <EditableDate
        v-model="formModel.statusDate"
        placeholder="Date"
        type="date"
        :is-editable="isEditable('statusDate')"
        @blur="onBlur"
        @input="handleUpdate"
      />
    </div>
    <div class="mx-2" @click.stop="setEditable('owesFee')">
      <EditableInput
        v-model="formModel.owesFee"
        :is-editable="isEditable('owesFee')"
        :class="{'select-cell': isEditable('owesFee')}"
        placeholder="Owes"
        currency
        @blur="onBlur"
        @input="debounceUpdate"
      />
    </div>
    <div @click.stop="setEditable('paidFee')">
      <EditableInput
        v-model="formModel.paidFee"
        placeholder="Paid"
        :class="{'select-cell': isEditable('paidFee')}"
        currency
        :is-editable="isEditable('paidFee')"
        @blur="onBlur"
        @input="debounceUpdate"
      />
    </div>
    <div class="ml-2" @click.stop="setEditable('dateFiled')">
      <EditableDate
        v-model="formModel.dateFiled"
        placeholder="Date"
        type="date"
        :is-editable="isEditable('dateFiled')"
        @blur="onBlur"
        @input="handleUpdate"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { debounce } from 'lodash'
import { models } from '~/shared/constants'

export default {
  name: 'ClientTaxYearFbar',
  props: {
    fbar: {
      type: Object,
      default: ()=>{}
    }
  },
  data() {
    return {
      editable: '',
      formModel: null
    }
  },
  computed: {
    ...mapState([models.valueTypes, models.selectedClient]),
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
    this.formModel = JSON.parse(JSON.stringify(this.fbar))
  },
  methods:{
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
      this.$api.updateFiling(
        this.headers,
        { clientId: this.selectedClient.id, filingId: this.fbar.id },
        this.formModel
      )
    },
    debounceUpdate() {
      return debounce(this.handleUpdate, 500)
    },
  }
}
</script>

<style scoped>
.fbar {
  @apply text-xs flex relative;

  transform: rotate(90deg);
}

.select-cell {
  transform: rotate(270deg);
  min-width: 40px;
}

</style>
