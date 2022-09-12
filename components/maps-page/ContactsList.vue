<template>
  <Table class="h-auto shadow" @keydown.tab.prevent="onKeyDown">
    <template #header>
      <TableHeader>
        <div class="table-header xs"></div>
        <div class="table-header xs"></div>
        <div class="table-header min-w-[4.25rem] w-1/3">Type</div>
        <div class="table-header lg">Address / Phone / Routing</div>
        <div class="table-header lg">City / Account</div>
        <div class="table-header xs"></div>
      </TableHeader>
    </template>
    <template #body>
      <TableRow
        v-for="(contact, idx) in displayedContacts"
        :key="`${contact.id}  ${isSelected(contact)}`"
        class="pr-1"
        :idx="idx"
        :selected="isSelected(contact)"
      >
        <div class="table-col xs bg-gray-200 mr-1">
          <ClickCell>{{ idx + 1 }}</ClickCell>
        </div>
        <div class="table-col xs">
          <EditableCheckBoxCell v-model="contact.enabled" />
        </div>
        <div class="table-col min-w-[4.25rem] w-1/3">
          {{ contact.contactType }}
        </div>
        <div :id="`${idx}-mainDetail`" class="table-col lg" @click="toggleEditable(`${idx}-mainDetail`, contact.id)">
          <EditableInputCell
            v-model="contact.mainDetail"
            :is-editable="isEditable(`${idx}-mainDetail`)"
            @blur="onBlur"
          />
        </div>
        <div
          :id="`${idx}-secondaryDetail`"
          class="table-col lg"
          @click="toggleEditable(`${idx}-secondaryDetail`, contact.id)"
        >
          <EditableInputCell
            v-model="contact.secondaryDetail"
            :is-editable="isEditable(`${idx}-secondaryDetail`)"
            @blur="onBlur"
          />
        </div>
        <div class="table-col xs">
          <button v-if="isTypeAddress(contact)" @click="setCurrentMapLocation(contact)">
            <MapIcon class="w-4 h-4 text-indigo-500" />
          </button>
        </div>
      </TableRow>
    </template>
  </Table>
</template>

<script>
import { mapState } from 'vuex'
import { models, mutations } from '~/shared/constants'
import { searchArrOfObjs } from '~/shared/utility'

export default {
  name: 'ContactsList',
  data() {
    return {
      editableId: '',
      editableContactId: '',
    }
  },
  computed: {
    ...mapState([models.selectedClient, models.valueTypes, models.search, models.selectedContactId]),
    displayedContacts() {
      const contacts = this.filteredContacts
      contacts?.map((contact) => {
        return { enabled: !contact.disabled, ...contact }
      })
      return searchArrOfObjs(contacts, this.searchInput)
    },
    filteredContacts() {
      if (this.contacts) {
        return this.contacts.filter((contact) => !contact.archived)
      } else {
        return null
      }
    },
    contacts() {
      if (this.selectedClient.contacts) {
        return JSON.parse(JSON.stringify(this.selectedClient.contacts))
      } else {
        return null
      }
    },
    headers() {
      return this.$api.getHeaders()
    },
  },
  methods: {
    setCurrentMapLocation(contact) {
      this.$store.commit(mutations.setModelResponse, { model: models.selectedContactId, data: contact.id })
    },
    isTypeAddress({ contactType }) {
      return contactType?.toLowerCase().includes('address')
    },
    isSelected({ id }) {
      return this.selectedContactId === id
    },
    toggleEditable(id, contactId) {
      this.handleUpdate()
      this.editableContactId = contactId
      if (!(this.editableId === id)) {
        this.editableId = id
      }
    },
    isEditable(id) {
      return this.editableId === id
    },
    handleUpdate() {
      if (!this.editableContactId) return
      const contact = this.displayedContacts.find((contact) => contact.id === this.editableContactId)
      this.$api.updateContact(
        this.headers,
        { clientId: this.selectedClient.id, contactId: this.editableContactId },
        contact
      )
    },
    onBlur() {
      this.handleUpdate()
      this.editableId = ''
    },
  },
}
</script>

<style scoped></style>
