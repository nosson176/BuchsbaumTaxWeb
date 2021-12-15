<template>
  <div class="header">
    <div v-if="selectedClient" class="w-full grid grid-cols-7 gap-x-4 grid-rows-1 items-center">
      <div class="col-start-1 font-bold text-lg">
        {{ selectedClient.lastName }}
      </div>
      <div class="col-start-2">
        <ClientTaxYearsHeaderPersonal :personal="primaryPersonal" />
        <ClientTaxYearsHeaderPersonal :personal="secondaryPersonal" />
      </div>
      <div class="col-start-3 font-semibold text-gray-100 flex justify-center" @click="setEditable('status')">
        <EditableSelectCell
          v-model="status"
          :options="statusOptions"
          :is-editable="isEditable('status')"
          @blur="onBlur"
          @input="debounceUpdate"
        />
      </div>
      <div class="col-start-4 font-semibold text-gray-100 flex justify-center" @click="setEditable('periodical')">
        <EditableSelectCell
          v-model="periodical"
          :options="periodicalOptions"
          :is-editable="isEditable('periodical')"
          @blur="onBlur"
          @input="debounceUpdate"
        />
      </div>
      <div class="col-start-5">
        {{ formattedCreatedDate }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { debounce } from 'lodash'
import { categories, models } from '~/shared/constants'
import { formatDateForClient } from '~/shared/domain-utilities'

export default {
  name: 'ClientTaxYearsHeader',
  data () {
    return {
      editingId: ''
    }
  },
  computed: {
    ...mapState([models.selectedClient, models.valueTypes]),
    primaryPersonal () {
      return this.selectedClient?.taxPersonals?.filter(personal => personal.category === categories.primary)[0]
    },
    secondaryPersonal () {
      return this.selectedClient?.taxPersonals?.filter(personal => personal.category === categories.secondary)[0]
    },
    formattedCreatedDate () {
      if (this.selectedClient.created) {
        return formatDateForClient(this.selectedClient.created)
      } else {
        return ''
      }
    },
    status () {
      return this.selectedClient.status
    },
    periodical () {
      return this.selectedClient.periodical
    },
    debounceUpdate () {
      return debounce(this.handleUpdate, 500)
    },
    statusOptions () {
      return this.valueTypes.status
    },
    periodicalOptions () {
      return this.valueTypes.periodical
    }
  },
  methods: {
    setEditable (editingId) {
      this.editingId = editingId
    },
    isEditable (editingId) {
      return this.editingId === editingId
    },
    onBlur () {
      this.editingId = ''
    },
    handleUpdate () {
    }
  }
}
</script>

<style scoped>
  .header {
    @apply flex bg-gray-700 text-white rounded-t-sm px-3 items-center z-10 shadow;

    min-height: 4rem;
  }
</style>
