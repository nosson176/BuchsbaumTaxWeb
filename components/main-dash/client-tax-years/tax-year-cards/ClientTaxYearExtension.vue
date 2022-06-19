<template>
  <div class="extension">
    <div @click="setEditable('dateFiled')">
      <EditableDate
        v-model="formModel.dateFiled"
        placeholder="Filed"
        type="date"
        :is-editable="isEditable('dateFiled')"
        @blur="onBlur"
        @input="handleUpdate"
      />
    </div>
    <div class="mx-2" @click="setEditable('statusDate')">
      <EditableDate
        v-model="formModel.statusDate"
        placeholder="Date"
        type="date"
        :is-editable="isEditable('statusDate')"
        @blur="onBlur"
        @input="handleUpdate"
      />
    </div>
    <div @click="setEditable('status')">
      <EditableSelectCell
        v-model="formModel.status"
        :options="statusOptions"
        class="whitespace-nowrap"
        :class="{'select-cell': isEditable('status')}"
        :is-editable="isEditable('status')"
        placeholder="Status"
        @blur="onBlur"
        @input="handleUpdate"
      />
    </div>
    <div @click="setEditable('taxForm')">
      <EditableSelectCell
        v-model="formModel.taxForm"
        class="font-bold ml-2 whitespace-nowrap"
        :class="{'select-cell': isEditable('taxForm')}"
        :options="taxFormOptions"
        :is-editable="isEditable('taxForm')"
        placeholder="Tax Form"
        @blur="onBlur"
        @input="handleUpdate"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { models } from '~/shared/constants'

export default {
  name: 'ClientTaxYearExtension',
  props: {
    extension: {
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
    this.formModel = JSON.parse(JSON.stringify(this.extension))
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
        { clientId: this.selectedClient.id, filingId: this.extension.id },
        this.formModel
      )
    }
  }
}
</script>

<style scoped>
.extension {
  @apply text-xs flex;

  transform: rotate(270deg);
}

.select-cell {
  transform: rotate(90deg);
}

</style>
