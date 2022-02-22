<template>
  <div class="header">
    <div v-if="selectedClientCopy" class="w-full grid grid-cols-7 gap-x-4 grid-rows-1 items-center">
      <div class="col-start-1 font-bold text-2xl cursor-pointer" @click="openEditNameDialogue">
        {{ lastName }}
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
      <div class="col-start-4 text-gray-100 flex justify-center" @click="setEditable('periodical')">
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
    <Modal :showing="showEditNameDialogue">
      <SubmitCard :loading="isLastNameUpdateLoading" @hide="closeEditNameDialogue" @submit="handleUpdate">
        <FormInput ref="lastNameInput" v-model="lastName" label="Lastname" />
      </SubmitCard>
    </Modal>
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
      editingId: '',
      showEditNameDialogue: false,
      isLastNameUpdateLoading: false
    }
  },
  computed: {
    ...mapState([models.selectedClient, models.valueTypes, models.clients]),
    selectedClientCopy () {
      return JSON.parse(JSON.stringify(this.selectedClient))
    },
    primaryPersonal () {
      return this.selectedClientCopy?.taxPersonals?.filter(personal => personal.category === categories.primary)[0]
    },
    secondaryPersonal () {
      return this.selectedClientCopy?.taxPersonals?.filter(personal => personal.category === categories.secondary)[0]
    },
    formattedCreatedDate () {
      if (this.selectedClientCopy.created) {
        return formatDateForClient(this.selectedClientCopy.created)
      } else {
        return ''
      }
    },
    lastName: {
      get () {
        return this.selectedClientCopy.lastName
      },
      set (newVal) {
        this.selectedClientCopy.lastName = newVal
      }
    },
    status: {
      get () {
        return this.selectedClientCopy.status
      },
      set (newVal) {
        this.selectedClientCopy.status = newVal
      }
    },
    periodical: {
      get () {
        return this.selectedClientCopy.periodical
      },
      set (newVal) {
        this.selectedClientCopy.periodical = newVal
      }
    },
    debounceUpdate () {
      return debounce(this.handleUpdate, 500)
    },
    statusOptions () {
      return this.valueTypes.status || []
    },
    periodicalOptions () {
      return this.valueTypes.periodical || []
    },
    clientsCopy () {
      return JSON.parse(JSON.stringify(Object.assign(
        Object.values(this.clients)
          .map(client => client.id === this.selectedClientCopy.id ? this.selectedClientCopy : client)
      )))
    }
  },
  watch: {
    showEditNameDialogue: {
      handler (newVal) {
        if (newVal) {
          this.$nextTick(() => {
            this.$refs.lastNameInput.$refs.input.focus()
          })
        }
      }
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
      const headers = this.$api.getHeaders()
      const client = this.selectedClientCopy
      this.$api.updateClient(headers, { clientId: client.id, client })
    },
    openEditNameDialogue () {
      this.showEditNameDialogue = true
    },
    closeEditNameDialogue () {
      this.showEditNameDialogue = false
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
