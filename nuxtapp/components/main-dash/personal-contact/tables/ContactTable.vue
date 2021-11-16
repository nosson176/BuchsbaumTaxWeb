<template>
  <Table>
    <template #header>
      <TableHeader>
        <div class="table-header xs" />
        <div class="table-header xs" />
        <div class="table-header normal">
          Type
        </div>
        <div class="table-header normal">
          Memo
        </div>
        <div class="table-header lg">
          Address / Phone / Routing
        </div>
        <div class="table-header lg">
          City / Account
        </div>
        <div class="table-header xs">
          St
        </div>
        <div class="table-header sm">
          Zip
        </div>
        <div class="table-header xs" />
      </TableHeader>
    </template>
    <template #body>
      <TableRow
        v-for="(contact, idx) in displayedContacts"
        :key="contact.id"
        :idx="idx"
      >
        <div :id="`${idx}`" class="table-col xs">
          <div class="flex items-center h-5">
            <input
              :checked="false"
              type="checkbox"
              class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            >
          </div>
        </div>
        <div :id="`${idx}-disabled`" class="table-col xs">
          <CheckBoxToDisplayTrueFalse
            id="disabled"
            :checked="!contact.disabled"
            name="disabled"
            disabled
          />
        </div>
        <div :id="`${idx}-contactType`" class="table-col-primary normal" @click="toggleEditable(`${idx}-contactType`, contact.id)">
          <EditableSelectCell :is-editable="isEditable(`${idx}-contactType`)" :selected-option="contact.contactType" :options="contactTypeOptions" @blur="onBlur" @change="debounceUpdate" />
        </div>
        <div :id="`${idx}-memo`" class="table-col normal" @click="toggleEditable(`${idx}-memo`, contact.id)">
          <EditableInputCell v-model="contact.memo" :is-editable="isEditable(`${idx}-memo`)" @blur="onBlur" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-mainDetail`" class="table-col lg" @click="toggleEditable(`${idx}-mainDetail`, contact.id)">
          <EditableInputCell v-model="contact.mainDetail" :is-editable="isEditable(`${idx}-mainDetail`)" @blur="onBlur" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-secondaryDetail`" class="table-col lg" @click="toggleEditable(`${idx}-secondaryDetail`, contact.id)">
          <EditableInputCell v-model="contact.secondaryDetail" :is-editable="isEditable(`${idx}-secondaryDetail`)" @blur="onBlur" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-state`" class="table-col xs" @click="toggleEditable(`${idx}-state`, contact.id)">
          <EditableInputCell v-model="contact.state" :is-editable="isEditable(`${idx}-state`)" @blur="onBlur" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-zip`" class="table-col sm" @click="toggleEditable(`${idx}-zip`, contact.id)">
          <EditableInputCell v-model="contact.zip" :is-editable="isEditable(`${idx}-zip`)" @blur="onBlur" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-delete`" class="table-col xs">
          <DeleteButton @click="onDeleteClick(contact.id)" />
        </div>
      </TableRow>
    </template>
  </Table>
</template>

<script>
import { debounce } from 'lodash'
import { mapState } from 'vuex'
import { models, mutations, tabs } from '~/shared/constants'

export default {
  name: 'ContactTable',
  props: {
    showArchived: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      editableId: '',
      editableContactId: ''
    }
  },
  computed: {
    ...mapState([models.selectedClient, models.valueTypes]),
    displayedContacts () {
      let contacts = []
      if (!this.showArchived) {
        contacts = this.notArchived
      } else {
        contacts = this.archived
      }
      return contacts
    },
    notArchived () {
      if (this.contacts) {
        return this.contacts
          .filter(contact => !contact.archived)
      } else {
        return null
      }
    },
    archived () {
      if (this.contacts) {
        return this.contacts
          .filter(contact => contact.archived)
      } else {
        return null
      }
    },
    debounceUpdate () {
      return debounce(this.handleUpdate, 500)
    },
    contactTypeOptions () {
      return this.valueTypes.contact_type.filter(type => type.show)
    },
    headers () {
      return this.$api.getHttpConfig()
    },
    clientId () {
      return this.selectedClient.id
    },
    contacts () {
      if (this.selectedClient.contacts) {
        return JSON.parse(JSON.stringify(this.selectedClient.contacts))
      } else {
        return null
      }
    }
  },
  methods: {
    toggleEditable (id, contactId) {
      this.editableContactId = contactId
      if (!(this.editableId === id)) {
        this.editableId = id
      }
    },
    isEditable (id) {
      return this.editableId === id
    },
    handleUpdate () {
      const contact = this.displayedContacts.find(contact => contact.id === this.editableContactId)
      this.$api.updateContact(this.headers, { clientId: this.clientId, contactId: this.editableContactId }, contact)
    },
    onDeleteClick (contactId) {
      if (this.showArchived) {
        const contact = this.displayedContacts.find(contact => contact.id === contactId)
        contact.archived = false
        this.$api.updateContact(this.headers, { clientId: this.clientId, contactId }, contact)
          .then(() => {
            this.updateClient(contactId, contact)
          })
      } else {
        this.$store.commit(
          mutations.setModelResponse,
          { model: models.modals, data: { delete: { showing: true, data: { id: contactId, type: tabs.contact } } } }
        )
      }
    },
    updateClient (contactId, contact) {
      const contactIndex = this.contacts.findIndex(contact => contact.id === contactId)
      this.contacts[contactIndex] = contact
      const data = Object.assign({}, this.selectedClient, { contacts: this.contacts })
      this.$store.commit(mutations.setModelResponse, { model: models.selectedClient, data })
    },
    onBlur () {
      this.editableId = ''
    }
  }
}
</script>

<style scoped>

</style>
