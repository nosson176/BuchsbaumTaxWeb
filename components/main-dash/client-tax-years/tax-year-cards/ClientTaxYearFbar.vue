<template>
  <div class="fbar" @click="setEditable('')">
    <div v-if="!isEditable('fileType')" @click.stop="setEditable('fileType')">
      <EditableSelectCell
        v-model="formModel.fileType"
        class="font-bold ml-2 whitespace-nowrap"
        :options="fileTypeOptions"
        :is-editable="isEditable('fileType')"
        placeholder="Type"
        @blur="onBlur"
        @input="handleUpdate"
      />
    </div>
    <div v-else v-click-outside="onBlur" class="absolute top-0 h-48 w-48">
      <EditableSelectCell
        v-model="formModel.fileType"
        class="font-bold ml-2 whitespace-nowrap select-cell"
        :options="fileTypeOptions"
        is-editable
        placeholder="Type"
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
    <div v-else v-click-outside="onBlur" class="absolute top-0 left-12 h-48 w-48">
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { debounce } from 'lodash'
import ClickOutside from 'vue-click-outside'
import { models } from '~/shared/constants'

export default {
  name: 'ClientTaxYearFbar',
  directives: {
    ClickOutside
  },
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
    statusOptions() {
      return this.valueTypes.fbar_status.filter((status) => status.show)
    },
    fileTypeOptions() {
      return this.valueTypes.file_type.filter((fileType) => fileType.show)
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
