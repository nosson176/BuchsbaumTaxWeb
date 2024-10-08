<template>
  <div class="fbar" @click="setEditable('')" @keydown.tab.prevent @keyup.tab.exact="goToNextItem"
    @keyup.shift.tab.exact="goToPrevItem">
    <DeleteButton class="mx-1" small @click="emitDelete" />
    <div class="fbar-i">
      <div v-if="!isEditable('fileType')" @click.stop="setEditable('fileType')">
        <EditableSelectCell v-model="formModel.fileType" class="font-bold ml-2 whitespace-nowrap"
          :options="fileTypeOptions" :is-editable="false" placeholder="Type" />
      </div>
      <div v-else v-click-outside="onBlur" class="absolute top-0 h-48 w-40">
        <EditableSelectCell v-model="formModel.fileType" class="font-bold ml-2 whitespace-nowrap select-cell"
          :options="fileTypeOptions" :is-editable="true" placeholder="Type" @blur="onBlur" />
      </div>
    </div>
    <div class="fbar-i">
      <div v-if="!isEditable('status')" @click.stop="setEditable('status')">
        <EditableSelectCell v-model="formModel.status" :options="statusOptions" class="whitespace-nowrap"
          :is-editable="false" placeholder="Status" />
      </div>
      <div v-else v-click-outside="onBlur" class="absolute top-0 h-48 w-40 ">
        <EditableSelectCell v-model="formModel.status" :options="statusOptions" class="whitespace-nowrap select-cell"
          :is-editable="true" placeholder="Status" @blur="onBlur" />
      </div>
    </div>
    <div class="fbar-i">
      <div v-if="!isEditable('statusDetail')" @click.stop="setEditable('statusDetail')">
        <EditableSelectCell v-model="formModel.statusDetail" :options="statusDetailOptions" class="whitespace-nowrap"
          :is-editable="false" placeholder="Detail" />
      </div>
      <div v-else v-click-outside="onBlur" class="absolute top-0 h-48 w-40">
        <EditableSelectCell v-model="formModel.statusDetail" class="whitespace-nowrap select-cell"
          :options="statusDetailOptions" :is-editable="true" placeholder="Detail" @blur="onBlur" />
      </div>
    </div>
    <div class="mt-85">
      <div class="fbar-i" @click.stop="setEditable('statusDate')">
        <EditableDate v-model="formModel.statusDate" placeholder="Date" type="date"
          :is-editable="isEditable('statusDate')" @blur="onBlur" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ClickOutside from 'vue-click-outside'
import { events, models } from '~/shared/constants'

const items = ['fileType', 'status', 'statusDetail', 'statusDate']

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
  },
  data() {
    return {
      editable: '',
      formModel: null,
    }
  },
  computed: {
    ...mapState([models.valueTypes, models.selectedClient]),
    headers() {
      return this.$api.getHeaders()
    },
    statusOptions() {
      return this.valueTypes.fbar_status.filter((status) => status.show)
    },
    statusDetailOptions() {
      const parentId = this.valueTypes.fbar_status.find((status) => status.value === this.formModel.status)?.id
      return this.valueTypes.fbar_status_detail.filter((status) => status.parentId === parentId && status.show)
    },
    fileTypeOptions() {
      return this.valueTypes.fbar_filing.filter((fileType) => fileType.show)
    },
  },
  created() {
    this.formModel = JSON.parse(JSON.stringify(this.fbar))
  },
  methods: {
    setEditable(editable) {
      this.editable = editable
    },
    isEditable(value) {
      return this.editable === value
    },
    onBlur() {
      this.handleUpdate()
      this.setEditable('')
    },
    handleUpdate() {
      this.$api.updateFiling(this.headers, { clientId: this.selectedClient.id, filingId: this.fbar.id }, this.formModel)
    },
    emitDelete() {
      this.$emit(events.delete, this.fbar.id)
    },
    goToNextItem() {
      const currentCell = this.editable
      const itemIndex = items.findIndex((col) => col === currentCell)
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
.fbar {
  @apply text-xs flex flex-col items-center p-2;

  justify-content: space-between;
  min-height: 250px;
  width: 100%;
}

.fbar-i {
  position: relative;
  transform: rotate(90deg);
}


.select-cell {
  transform: rotate(270deg);
  min-width: 40px;
  margin-top: 55px;
}
</style>