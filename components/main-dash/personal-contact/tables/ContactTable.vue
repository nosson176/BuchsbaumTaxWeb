<template>
  <Table @keydown.tab.prevent="onKeyDown">
    <template #header>
      <TableHeader>
        <div class="table-header">
          <AddRowButton @click="onAddRowClick" />
        </div>
        <div class="xs table-header" />
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
        :class="{'disabled': !contact.enabled}"
      >
        <div class="table-col bg-gray-200">
          <ClickCell>
            {{ idx+1 }}
          </ClickCell>
        </div>
        <div :id="`${idx}-disabled`" class="table-col xs" @click="toggleEditable(`${idx}-disabled`, contact.id)">
          <EditableCheckBoxCell v-model="contact.enabled" :is-editable="isEditable(`${idx}-disabled`)" @input="debounceUpdate" />
        </div>
        <div :id="`${idx}-contactType`" class="table-col-primary normal" @click="toggleEditable(`${idx}-contactType`, contact.id)">
          <EditableSelectCell v-model="contact.contactType" :is-editable="isEditable(`${idx}-contactType`)" :options="contactTypeOptions" @blur="onBlur" @input="debounceUpdate" />
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
          <DeleteButton small @click="onDeleteClick(contact.id)" />
        </div>
      </TableRow>
    </template>
  </Table>
</template>

<script>
import { debounce } from 'lodash'
import { mapState } from 'vuex'
import { models, mutations, tableGroups, tabs } from '~/shared/constants'
import { searchArrOfObjs } from '~/shared/utility'

const columns = [
  'disabled', 'contactType', 'memo', 'mainDetail', 'secondaryDetail', 'state', 'zip', 'delete'
]

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
      editableContactId: '',
      newContactId: ''
    }
  },
  computed: {
    ...mapState([models.selectedClient, models.valueTypes, models.search]),
    displayedContacts () {
      const contacts = this.filteredContacts
      contacts.map((contact) => { return { enabled: !contact.disabled, ...contact } })
      const newContactIdx = contacts?.findIndex(contact => contact.id === this.newContactId)
      if (newContactIdx > -1) {
        const tempContact = contacts[newContactIdx]
        contacts.splice(newContactIdx, 1)
        contacts.unshift(tempContact)
      }
      return searchArrOfObjs(contacts, this.searchInput)
    },
    filteredContacts () {
      if (this.contacts) {
        return this.contacts
          .filter(contact => this.showArchived === contact.archived)
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
      return this.$api.getHeaders()
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
    },
    searchInput () {
      return this.search?.[tableGroups.personalContact]
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
      } else {
        this.$store.commit(
          mutations.setModelResponse,
          { model: models.modals, data: { delete: { showing: true, data: { id: contactId, type: tabs.contact } } } }
        )
      }
    },
    onAddRowClick () {
      if (!this.selectedClient) {
        return
      }
      const clientId = this.selectedClient.id
      const defaultValues = {
        clientId,
        include: true
      }
      const contact = Object.assign({}, defaultValues)
      this.$api.createContact(this.headers, { contact })
        .then(async (data) => {
          await this.$api.getClientData(this.headers, this.selectedClient.id)
          this.newContactId = data.id
          this.toggleEditable(`0-${columns[0]}`, data.id)
        })
    },
    onKeyDown () {
      const currentCell = this.editableId
      const idArr = currentCell.split('-')
      const columnIndex = columns.findIndex(col => col === idArr[1])
      if (columnIndex < columns.length - 1) {
        const nextCell = `${idArr[0]}-${columns[columnIndex + 1]}`
        this.toggleEditable(nextCell, this.editableContactId)
      }
    },
    onBlur () {
      this.editableId = ''
    }
  }
}
</script>

<style scoped>

</style>
