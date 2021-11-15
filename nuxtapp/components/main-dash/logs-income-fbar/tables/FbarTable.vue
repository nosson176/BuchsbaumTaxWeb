<template>
  <Table>
    <template #header>
      <TableHeader>
        <div class="xs table-header">
          <AddRowButton />
        </div>
        <div class="table-header sm">
          Year
        </div>
        <div class="table-header xs">
          Cat
        </div>
        <div class="table-header  normal">
          Group
        </div>
        <div class="table-header normal">
          Type
        </div>
        <div class="table-header sm">
          Job
        </div>
        <div class="table-header normal">
          Amt
        </div>
        <div class="table-header sm">
          Curr
        </div>
        <div class="table-header xs">
          X
        </div>
        <div class="table-header xs">
          $
        </div>
        <div class="table-header sm">
          Doc
        </div>
        <div class="table-header lg">
          Description
        </div>
        <div class="table-header sm">
          Depend
        </div>
        <div class="table-header xs" />
      </TableHeader>
    </template>
    <template #body>
      <TableRow
        v-for="(fbar, idx) in displayedFbar"
        :key="fbar.id"
        :idx="idx"
      >
        <div :id="`${idx}-include`" class="table-col xs">
          <CheckBoxToDisplayTrueFalse
            id="include"
            :checked="fbar.include"
            name="disabled"
            disabled
          />
        </div>
        <div :id="`${idx}-years`" class="table-col-primary sm" @click="toggleEditable(`${idx}-years`, fbar.id)">
          <EditableSelectCell :is-editable="isEditable(`${idx}-years`)" :selected-option="fbar.years" :options="yearNameOptions" @change="debounceUpdate" />
        </div>
        <div :id="`${idx}-category`" class="table-col xs" @click="toggleEditable(`${idx}-category`, fbar.id)">
          <EditableSelectCell :is-editable="isEditable(`${idx}-category`)" :selected-option="fbar.category" :options="categoryOptions" @change="debounceUpdate" />
        </div>
        <div :id="`${idx}-taxGroup`" class="table-col normal" @click="toggleEditable(`${idx}-taxGroup`, fbar.id)">
          <EditableSelectCell :is-editable="isEditable(`${idx}-taxGroup`)" :selected-option="fbar.taxGroup" :options="taxGroupOptions" @change="debounceUpdate" />
        </div>
        <div :id="`${idx}-taxType`" class="table-col normal" @click="toggleEditable(`${idx}-taxType`, fbar.id)">
          <EditableSelectCell :is-editable="isEditable(`${idx}-taxType`)" :selected-option="fbar.taxType" :options="taxTypeOptions" @change="debounceUpdate" />
        </div>
        <div :id="`${idx}-job`" class="table-col sm" @click="toggleEditable(`${idx}-job`, fbar.id)">
          <EditableSelectCell :is-editable="isEditable(`${idx}-job`)" :selected-option="fbar.job" :options="jobOptions" @change="debounceUpdate" />
        </div>
        <div :id="`${idx}-amount`" class="normal table-col" @click="toggleEditable(`${idx}-amount`, fbar.id)">
          <EditableInputCell v-model="fbar.amount" :is-editable="isEditable(`${idx}-amount`)" is-currency @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-currency`" class="table-col sm" @click="toggleEditable(`${idx}-currency`, fbar.id)">
          <EditableSelectCell :is-editable="isEditable(`${idx}-currency`)" :selected-option="fbar.currency" :options="currencyOptions" @change="debounceUpdate" />
        </div>
        <div :id="`${idx}-frequency`" class="table-col xs">
          {{ fbar.frequency || '' }}
        </div>
        <div :id="`${idx}-$`" class="table-col xs">
          $
        </div>
        <div :id="`${idx}-documents`" class="table-col sm">
          {{ fbar.documents }}
        </div>
        <div :id="`${idx}-description`" class="table-col lg">
          {{ fbar.description }}
        </div>
        <div :id="`${idx}-depend`" class="table-col sm">
          {{ fbar.depend }}
        </div>
        <div :id="`${idx}-delete`" class="table-col xs">
          <DeleteButton @click="onDeleteClick(fbar.id)" />
        </div>
      </TableRow>
    </template>
  </Table>
</template>

<script>
import { debounce } from 'lodash'
import { mapState } from 'vuex'
import { events, models, tabs } from '~/shared/constants'

export default {
  name: 'FbarTable',
  props: {
    showArchived: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      editableId: '',
      editablePersonalId: ''
    }
  },
  computed: {
    ...mapState([models.selectedClient, models.valueTypes, models.valueTaxGroups]),
    displayedFbar () {
      let fbar = []
      if (!this.showArchived) {
        fbar = this.notArchived
      } else {
        fbar = this.archived
      }
      return JSON.parse(JSON.stringify(fbar))
    },
    notArchived () {
      if (this.selectedClient.fbarBreakdowns) {
        return this.selectedClient.fbarBreakdowns
          .filter(fbar => !fbar.archived)
          .sort((a, b) => b.years - a.years)
      } else {
        return null
      }
    },
    archived () {
      if (this.selectedClient.fbarBreakdowns) {
        return this.selectedClient.fbarBreakdowns
          .filter(fbar => fbar.archived)
          .sort((a, b) => b.years - a.years)
      } else {
        return null
      }
    },
    debounceUpdate () {
      return debounce(this.handleUpdate, 500)
    },
    categoryOptions () {
      return this.valueTypes.category.filter(category => category.show)
    },
    yearNameOptions () {
      return this.valueTypes.year_name.filter(yearName => yearName.show)
    },
    taxTypeOptions () {
      return this.valueTypes.tax_type.filter(taxType => taxType.show)
    },
    jobOptions () {
      return this.valueTypes.job.filter(job => job.show)
    },
    currencyOptions () {
      return this.valueTypes.currency.filter(currency => currency.show)
    },
    taxGroupOptions () {
      return Object.values(this.valueTaxGroups).filter(taxGroup => taxGroup.show)
    },
    headers () {
      return this.$api.getHttpConfig()
    },
    clientId () {
      return this.selectedClient.id
    }
  },
  methods: {
    toggleEditable (id, fbarId) {
      this.editableFbarId = fbarId
      if (!(this.editableId === id)) {
        this.editableId = id
      }
    },
    isEditable (id) {
      return this.editableId === id
    },
    handleUpdate () {
      const fbar = this.displayedFbars.find(fbar => fbar.id === this.editableFbarId)
      this.$api.updateFbar(this.headers, { clientId: this.clientId, fbarId: this.editableFbarId }, fbar)
    },
    onDeleteClick (fbarId) {
      if (this.showArchived) {
        const fbar = this.displayedFbars.find(fbar => fbar.id === fbarId)
        fbar.archived = false
        this.$api.updateFbar(this.headers, { clientId: this.clientId, fbarId }, fbar)
          .then(() => {
            this.reloadClient()
          })
      } else {
        this.$emit(events.delete, { id: fbarId, type: tabs.fbar })
      }
    },
    reloadClient () {
      this.$api.getClientData(this.headers, this.clientId)
    }
  }
}
</script>

<style scoped>

</style>
