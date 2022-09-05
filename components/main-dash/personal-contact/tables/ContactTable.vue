<template>
  <Table @keydown.tab.prevent @keyup.tab.exact="goToNextColumn" @keyup.shift.tab.exact="goToPrevColumn">
    <template #header>
      <TableHeader>
        <div class="table-header">
          <AddRowButton @click="onAddRowClick" />
        </div>
        <div class="xs table-header" />
        <div class="table-header normal">Type</div>
        <div class="table-header normal">Memo</div>
        <div class="table-header sm"></div>
        <div class="table-header lg">Address / Phone / Routing</div>
        <div class="table-header lg">City / Account</div>
        <div class="table-header xs">St</div>
        <div class="table-header sm">Zip</div>
        <div class="table-header sm"><button v-if="!isDefaultOrder" @click="resetOrder">Reset Order</button></div>
      </TableHeader>
    </template>
    <template #body>
      <draggable :value="displayedContacts" v-bind="dragOptions" @start="startDrag" @end="onDrop">
        <transition-group type="transition" :name="transitionName">
          <TableRow
            v-for="(contact, idx) in displayedContacts"
            :key="contact.id"
            :idx="idx"
            :class="{ disabled: !contact.enabled }"
          >
            <div class="table-col bg-gray-200 mr-1">
              <ClickCell>{{ idx + 1 }}</ClickCell>
            </div>
            <div :id="`${idx}-disabled`" class="table-col xs" @click="toggleEditable(`${idx}-disabled`, contact.id)">
              <EditableCheckBoxCell
                v-model="contact.enabled"
                :is-editable="isEditable(`${idx}-disabled`)"
                @input="handleUpdate"
              />
            </div>
            <div
              :id="`${idx}-contactType`"
              class="table-col-primary normal"
              @click="toggleEditable(`${idx}-contactType`, contact.id)"
            >
              <EditableSelectCell
                v-model="contact.contactType"
                :is-editable="isEditable(`${idx}-contactType`)"
                :options="contactTypeOptions"
                @blur="onBlur"
              />
            </div>
            <div :id="`${idx}-memo`" class="table-col normal" @click="toggleEditable(`${idx}-memo`, contact.id)">
              <EditableInputCell v-model="contact.memo" :is-editable="isEditable(`${idx}-memo`)" @blur="onBlur" />
            </div>
            <div class="table-header sm">
              <button v-if="isTypeAddress(contact)" @click="setCurrentMapLocation(contact)">
                <MapIcon class="w-4 h-4 text-indigo-500" />
              </button>
            </div>
            <div
              :id="`${idx}-mainDetail`"
              class="table-col lg"
              @click="toggleEditable(`${idx}-mainDetail`, contact.id)"
            >
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
            <div :id="`${idx}-state`" class="table-col xs" @click="toggleEditable(`${idx}-state`, contact.id)">
              <EditableInputCell v-model="contact.state" :is-editable="isEditable(`${idx}-state`)" @blur="onBlur" />
            </div>
            <div :id="`${idx}-zip`" class="table-col sm" @click="toggleEditable(`${idx}-zip`, contact.id)">
              <EditableInputCell v-model="contact.zip" :is-editable="isEditable(`${idx}-zip`)" @blur="onBlur" />
            </div>
            <div :id="`${idx}-delete`" class="table-col xs">
              <DeleteButton small @click="onDeleteClick(contact)" />
            </div>
          </TableRow>
        </transition-group>
      </draggable>
    </template>
  </Table>
</template>

<script>
import { mapState } from 'vuex'
import draggable from 'vuedraggable'
import { models, mutations, routes, tableGroups, tabs, TRANSITION_NAME } from '~/shared/constants'
import { searchArrOfObjs } from '~/shared/utility'

const columns = ['disabled', 'contactType', 'memo', 'mainDetail', 'secondaryDetail', 'state', 'zip', 'delete']

export default {
  name: 'ContactTable',
  components: { draggable },
  props: {
    showArchived: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      editableId: '',
      editableContactId: '',
      dragActive: false,
      dragOptions: {
        animation: 200,
        ghostClass: 'ghost',
      },
    }
  },
  computed: {
    ...mapState([models.selectedClient, models.valueTypes, models.search]),
    displayedContacts() {
      const contacts = this.filteredContacts
      contacts?.map((contact) => {
        return { enabled: !contact.disabled, ...contact }
      })
      return searchArrOfObjs(contacts, this.searchInput)
    },
    filteredContacts() {
      if (this.contacts) {
        return this.contacts.filter((contact) => this.showArchived === contact.archived)
      } else {
        return null
      }
    },
    contactTypeOptions() {
      return this.valueTypes.contact_type.filter((type) => type.show)
    },
    headers() {
      return this.$api.getHeaders()
    },
    clientId() {
      return this.selectedClient.id
    },
    contacts() {
      if (this.selectedClient.contacts) {
        return JSON.parse(JSON.stringify(this.selectedClient.contacts))
      } else {
        return null
      }
    },
    searchInput() {
      return this.search?.[tableGroups.personalContact]
    },
    transitionName() {
      if (!this.dragActive) {
        return TRANSITION_NAME
      }
      return null
    },
    isDefaultOrder() {
      return this.displayedContacts?.every((contact) => !contact.sortOrder)
    },
  },
  methods: {
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
      this.$api.updateContact(this.headers, { clientId: this.clientId, contactId: this.editableContactId }, contact)
    },
    onDeleteClick(contactObj) {
      if (this.showArchived) {
        const contact = this.displayedContacts.find((contact) => contact.id === contactObj.id)
        contact.archived = false
        this.$api.updateContact(this.headers, { clientId: this.clientId, contactId: contactObj.id }, contact)
      } else {
        this.$store.commit(mutations.setModelResponse, {
          model: models.modals,
          data: {
            delete: { showing: true, data: { id: contactObj.id, type: tabs.contact, label: contactObj.contactType } },
          },
        })
      }
    },
    onAddRowClick() {
      if (!this.selectedClient) {
        return
      }
      const clientId = this.selectedClient.id
      const defaultValues = {
        clientId,
        include: true,
        sortOrder: this.isDefaultOrder ? 0 : 1,
      }
      const contact = Object.assign({}, defaultValues)
      this.$api.createContact(this.headers, { contact }).then(async (data) => {
        await this.$api.getClientData(this.headers, this.selectedClient.id)
        this.toggleEditable(`0-${columns[0]}`, data.id)
      })
    },
    goToNextColumn() {
      const currentCell = this.editableId
      const idArr = currentCell.split('-')
      const columnIndex = columns.findIndex((col) => col === idArr[1])
      const currentRow = Number(idArr[0])
      if (columnIndex < columns.length - 1) {
        const nextCell = `${currentRow}-${columns[columnIndex + 1]}`
        this.toggleEditable(nextCell, this.editableContactId)
      } else if (columnIndex === columns.length - 1 && currentRow < this.displayedContacts.length - 1) {
        const nextRow = currentRow + 1
        const nextCell = `${nextRow}-${columns[0]}`
        this.toggleEditable(nextCell, this.editableContactId)
      }
    },
    goToPrevColumn() {
      const currentCell = this.editableId
      const idArr = currentCell.split('-')
      const columnIndex = columns.findIndex((col) => col === idArr[1])
      const currentRow = Number(idArr[0])
      if (columnIndex === 0 && currentRow > 0) {
        const prevRow = currentRow - 1
        const prevCell = `${prevRow}-${columns[columns.length - 1]}`
        this.toggleEditable(prevCell, this.editableLogId)
      } else if (columnIndex > 0) {
        const prevCell = `${currentRow}-${columns[columnIndex - 1]}`
        this.toggleEditable(prevCell, this.editableLogId)
      }
    },
    onBlur() {
      this.handleUpdate()
      this.editableId = ''
    },
    startDrag() {
      this.dragActive = true
    },
    onDrop(evt) {
      const item = this.displayedContacts[evt.oldIndex]
      item.sortOrder = evt.newIndex + 1
      this.$api.updateContact(this.headers, { clientId: this.clientId, contactId: item.id }, item)
      this.dragActive = false
    },
    resetOrder() {
      const item = this.displayedContacts[0]
      item.sortOrder = 0
      this.$api.updateContact(this.headers, { clientId: this.clientId, contactId: item.id }, item)
    },
    setCurrentMapLocation(contact) {
      this.$store.commit(mutations.setModelResponse, { model: models.selectedContactId, data: contact.id })
      this.$router.push({ name: routes.maps })
    },
    isTypeAddress({ contactType }) {
      return contactType?.toLowerCase().includes('address')
    },
  },
}
</script>

<style scoped></style>
