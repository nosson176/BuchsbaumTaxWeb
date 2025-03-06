<template>
  <Table @keydown.tab.prevent @keyup.shift.tab.exact="goToPrevColumn">
    <template #header>
      <TableHeader>
        <div class="table-header">
          <AddRowButton @click="onAddRowClick" />
        </div>
        <div class="table-header xs" />
        <div class="table-header normal">Type</div>
        <div class="table-header normal">Memo</div>
        <div class="table-header xs"></div>
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
          <TableRow v-for="(contact, idx) in displayedContacts" :key="contact.id" :idx="idx"
            :selected="isSelected(contact.id)" :class="{ disabled: !contact.enabled }">
            <div class="table-col bg-gray-200 mr-1">
              <ClickCell @click="toggleSelected(contact)">{{ idx + 1 }}</ClickCell>


            </div>
            <div :id="`${idx}-disabled`" class="table-col xs" @click="toggleEditable(`${idx}-disabled`, contact.id)">
              <EditableCheckBoxCell v-model="contact.enabled" :is-editable="isEditable(`${idx}-disabled`)"
                @input="handleUpdate" />
            </div>
            <div :id="`${idx}-contactType`" class="table-col-primary normal"
              @click="toggleEditable(`${idx}-contactType`, contact.id, contact.contactType)">
              <EditableSelectCell v-model="contact.contactType" :is-editable="isEditable(`${idx}-contactType`)"
                :options="contactTypeOptions" @blur="onBlur(contact.contactType, 'type', $event)"
                @keyup.tab.native="onBlur(contact.contactType, 'type', $event)" initiallyOpen=true />
            </div>
            <div :id="`${idx}-memo`" class="table-col normal"
              @click="toggleEditable(`${idx}-memo`, contact.id, contact.memo)">
              <EditableInputCell v-model="contact.memo" @keyup.esc.native="onBlur(contact.memo, 'memo', $event)"
                @keyup.tab.native="onBlur(contact.memo, 'memo', $event)" @blur="onBlur(contact.memo, 'memo', $event)"
                :is-editable="isEditable(`${idx}-memo`)" />
            </div>
            <div class="table-col xs">
              <button v-if="isTypeAddress(contact)" @click="setCurrentMapLocation(contact)">
                <MapIcon class="w-4 h-4 text-indigo-500" />
              </button>
            </div>
            <div :id="`${idx}-mainDetail`" class="table-col lg"
              @click="toggleEditable(`${idx}-mainDetail`, contact.id, contact.mainDetail)">
              <EditableInputCell v-model="contact.mainDetail"
                @keyup.esc.native="onBlur(contact.mainDetail, 'mainDetail', $event)"
                @keyup.tab.native="onBlur(contact.mainDetail, 'mainDetail', $event)"
                @blur="onBlur(contact.mainDetail, 'mainDetail', $event)"
                :is-editable="isEditable(`${idx}-mainDetail`)" />
            </div>
            <div :id="`${idx}-secondaryDetail`" class="table-col lg"
              @click="toggleEditable(`${idx}-secondaryDetail`, contact.id, contact.secondaryDetail)">
              <EditableInputCell v-model="contact.secondaryDetail"
                @keyup.esc.native="onBlur(contact.secondaryDetail, 'secondaryDetail', $event)"
                @keyup.tab.native="onBlur(contact.secondaryDetail, 'secondaryDetail', $event)"
                @blur="onBlur(contact.secondaryDetail, 'secondaryDetail', $event)"
                :is-editable="isEditable(`${idx}-secondaryDetail`)" />
            </div>
            <div :id="`${idx}-state`" class="table-col xs"
              @click="toggleEditable(`${idx}-state`, contact.id, contact.state)">
              <EditableSelectCell v-model="contact.state" :options="stateOptions"
                @keyup.tab.native="onBlur(contact.state, 'state', $event)"
                @keyup.esc.native="onBlur(contact.state, 'state', $event)" :is-editable="isEditable(`${idx}-state`)"
                @blur="onBlur(contact.state, $event)" initiallyOpen=true />
            </div>
            <div :id="`${idx}-zip`" class="table-col sm" @click="toggleEditable(`${idx}-zip`, contact.id, contact.zip)">
              <EditableInputCell v-model="contact.zip" @keyup.esc.native="onBlur(contact.zip, 'zip', $event)"
                @keyup.tab.native="onBlur(contact.zip, 'zip', $event)" :is-editable="isEditable(`${idx}-zip`)"
                @blur="onBlur(contact.zip, 'zip', $event)" />
            </div>
            <div :id="`${idx}-delete`" class="table-col xs">
              <DeleteButton small @click="onDeleteClick(contact)" />
              <span v-if="contact.overrideSortOrder"
                class="w-2 h-2 bg-blue-500 rounded-full inline-block ml-1 cursor-pointer"
                @click="removeOverride(contact)"></span>
            </div>
          </TableRow>
        </transition-group>
      </draggable>
      <Modal :showing="showDeleteModal" @hide="closeDeleteModal">
        <DeleteArchiveModal :label="'contact'" :mode="showArchived ? 'archived' : 'normal'" @hide="closeDeleteModal"
          @delete="handleDelete" @archive="handleArchive" @unarchive="handleUnarchive" />
      </Modal>
    </template>
  </Table>
</template>

<script>
import { mapState } from 'vuex'
import draggable from 'vuedraggable'
import { models, mutations, routes, tableGroups, TRANSITION_NAME } from '~/shared/constants'
import { generateRandomId, searchArrOfObjs } from '~/shared/utility'

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
      dragOptions: {
        animation: 200,
        ghostClass: 'ghost',
      },
      dragActive: false,
      showDeleteModal: false,
      editableContactId: '',
      editableId: '',
      oldValue: '',
      updateData: [],
      selectedItems: {},
      contactToModify: null,
      trackedContactId: null,
    }
  },
  computed: {
    ...mapState([models.selectedClient, models.valueTypes, models.search, models.cmdPressed]),
    // In the computed section
    displayedContacts() {
      console.log('displayedContacts', this.filteredContacts)
      const contacts = this.filteredContacts?.map(contact => {
        const processedContact = {
          enabled: !contact.disabled,
          ...contact,
        };
        console.log('Processing contact:', processedContact);
        console.log('Processing22 contact:', contact);
        return processedContact;
      }) || [];

      console.log('Total filtered contacts:', contacts.length);
      console.log('Contacts before search filter:', contacts);

      const searchFilteredContacts = searchArrOfObjs(contacts, this.searchInput);

      console.log('Contacts after search filter:', searchFilteredContacts);
      console.log('Total search filtered contacts:', searchFilteredContacts.length);

      return searchFilteredContacts;
    },

    filteredContacts() {
      if (this.contacts) {
        const filteredContacts = this.contacts.filter((contact) => this.showArchived === contact.archived);
        console.log('Raw contacts:', this.contacts);
        console.log('Filtered contacts:', filteredContacts);
        console.log('Total filtered contacts:', filteredContacts.length);
        console.log('showArchived:', this.showArchived);
        return filteredContacts;
      } else {
        return null;
      }
    },
    contactTypeOptions() {
      return this.valueTypes.contact_type.filter((type) => {
        return type.show
      })
    },
    headers() {
      return this.$api.getHeaders()
    },
    clientId() {
      return this.selectedClient.id
    },
    contacts() {
      if (this.selectedClient.contacts) {
        console.log('contacts', JSON.parse(JSON.stringify(this.selectedClient.contacts)))
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
    isCmdPressed() {
      return this.cmdPressed && !Array.isArray(this.cmdPressed)
    },
    isCopyingContacts() {
      return this.isCmdPressed && this.selectedContactIds.length > 0
    },
    selectedContactIds() {
      return Object.keys(this.selectedItems).filter((id) => this.selectedItems[id])
    },
    stateOptions() {
      return this.valueTypes.state
    },
  },
  mounted() {
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  },

  created() {
    console.log('created', this.displayedContacts)
    this.sortContactsByType()
  },

  // watch: {
  //   displayedContacts() {
  //     console.log('watch', this.displayedContacts)
  //     this.sortContactsByType()
  //   }
  // },

  beforeDestroy() {
    if (this.updateData.length > 0) {
      this.sendUpdateContect()
    }
  },
  methods: {
    handleBeforeUnload(event) {
      if (this.updateData.length > 0) {
        this.sendUpdateContect();
        // Optionally, to show a confirmation dialog
        event.preventDefault();
        event.returnValue = '';
      }
    },
    toggleEditable(id, contactId, value) {
      if (!value) {
        const val = id.split("-")[1]
        const contact = this.displayedContacts.find((contact) => contact.id === contactId)
        this.oldValue = contact[val]
      } else this.oldValue = value
      this.editableContactId = contactId
      this.trackedContactId = contactId
      if (!(this.editableId === id)) {
        this.editableId = id
      }

    },
    isEditable(id) {
      return this.editableId === id
    },
    toggleSelected(contact) {
      this.selectedItems[contact.id] = !this.selectedItems[contact.id]
      this.selectedItems = Object.assign({}, this.selectedItems)
    },
    isSelected(contactId) {
      return this.selectedItems[contactId]
    },
    checkTelphone(contact) {
      const validTypes = ['Cell', 'Phone', 'Fax'];
      return validTypes.some(type => contact.contactType.includes(type));
    },
    formatPhoneNumber(number) {
      // Remove non-digit characters
      const digits = number.replace(/\D/g, '');

      if (digits.length === 10) {
        // Format for 10-digit numbers: (XXX) XXX-XXXX
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
      } else if (digits.length === 9) {
        // Format for 9-digit numbers: (XX) XXX-XXXX
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 5)}-${digits.slice(5)}`;
      } else {
        // Return the original input if it doesn't match the expected length
        return number;
      }
    },
    async handleUpdate(field) {
      if (!this.editableContactId) return;
      let oldVal
      const contact = this.displayedContacts.find((contact) => contact.id === this.editableContactId);
      if (!contact) return

      if (field === 'mainDetail' && this.checkTelphone(contact)) {
        contact.mainDetail = contact.mainDetail.replace(/[()\-\s]/g, '');
        if (!isNaN(contact.mainDetail)) {
          const tel = this.formatPhoneNumber(contact.mainDetail)
          contact.mainDetail = tel
        }
      }
      if (contact.enabled) {
        // Get only enabled contacts
        const enabledContacts = this.displayedContacts.filter(c => c.enabled);

        // Check if the contactType already exists among enabled contacts (excluding the current one)

        const duplicate = enabledContacts.some(
          c => c.contactType === contact.contactType && c.id !== this.editableContactId
        );

        if (duplicate) {
          this.$toast.error('This contact type already exists for another enabled contact');

          // Reset the value to the old one
          contact.contactType = this.oldValue;

          this.editableId = "";
          // return;

        }
      }
      const index = this.updateData.findIndex(con => con.id === contact.id)
      if (index !== -1) {
        this.updateData[index] = contact
      } else {
        this.updateData.push(contact)
      }

      if (field === 'type' && this.oldValue) {
        oldVal = this.oldValue
        const res = await this.$api.updateFilingDelivary(this.headers, {
          clientId: this.clientId,
          oldContectDelivary: this.oldValue,
          newContectDelivary: contact.contactType
        });

        if (res.status === 'success') {
          this.$store.commit('UPDATE_FILINGS_CONTACT', {
            oldValue: oldVal,
            newValue: contact.contactType
          });
        }
      }
      this.$store.dispatch('updateContactAction', { contact });
      this.sortContactsByType()
      // this.editableId = ""
    },

    // sortContactsByType() {
    //   console.log('sort', this.displayedContacts)
    //   const sortedContacts = [...this.displayedContacts].sort((a, b) => {
    //     if (a.contactType == null && b.contactType == null) return 0;
    //     if (a.contactType == null) return -1;
    //     if (b.contactType == null) return 1;

    //     const contactTypeOrder = this.contactTypeOptions
    //       .filter(type => type.show)
    //       .map(type => type.value);

    //     const aIndex = contactTypeOrder.indexOf(a.contactType);
    //     const bIndex = contactTypeOrder.indexOf(b.contactType);

    //     if (aIndex === -1 && bIndex === -1) return 0;
    //     if (aIndex === -1) return 1;
    //     if (bIndex === -1) return -1;

    //     return aIndex - bIndex;
    //   });

    //   // Directly mutate the array to trigger reactivity
    //   this.displayedContacts.splice(0, this.displayedContacts.length, ...sortedContacts);


    //   if (this.trackedContactId) {
    //     const newIndex = this.displayedContacts.findIndex(c => c.id === this.trackedContactId);
    //     if (newIndex !== -1) {
    //       this.$nextTick(() => {
    //         const currentColumn = this.editableId.split('-')[1];
    //         this.editableId = `${newIndex}-${currentColumn}`;
    //       });
    //     }
    //   }
    // },


    sendUpdateContect() {
      this.$api.updateContacts(this.headers, this.updateData)
        .catch(() => this.$toast.error('Error updating contact'))
    },
    // onDeleteClick(contactObj) {
    //   const contact = this.displayedContacts.find((contact) => contact.id === contactObj.id)
    //   if (this.showArchived) {
    //     contact.archived = false
    //   } else {
    //     contact.archived = true
    //   }
    //   const index = this.updateData.findIndex(c => c.id === contact.id)
    //   if (index !== -1) {
    //     this.updateData[index] = contact
    //   } else {
    //     this.updateData.push(contact)
    //   }

    //   this.$store.dispatch('updateContactAction', { contact });
    // },
    closeDeleteModal() {
      this.showDeleteModal = false;

    },
    onDeleteClick(contactObj) {
      this.showDeleteModal = true;
      this.contactToModify = contactObj;
    },
    handleArchive() {
      const contact = this.displayedContacts.find((contact) => contact.id === this.contactToModify.id)
      if (this.showArchived) {
        contact.archived = false
      } else {
        contact.archived = true
      }
      const index = this.updateData.findIndex(c => c.id === contact.id)
      if (index !== -1) {
        this.updateData[index] = contact
      } else {
        this.updateData.push(contact)
      }
      this.closeDeleteModal()
      this.$store.dispatch('updateContactAction', { contact });
    },

    handleUnarchive() {
      const contact = this.displayedContacts.find((contact) => contact.id === this.contactToModify.id)
      if (this.showArchived) {
        contact.archived = false
      } else {
        contact.archived = true
      }
      const index = this.updateData.findIndex(c => c.id === contact.id)
      if (index !== -1) {
        this.updateData[index] = contact
      } else {
        this.updateData.push(contact)
      }
      this.closeDeleteModal()
      this.$store.dispatch('updateContactAction', { contact });
    },

    handleDelete() {
      this.$api.deleteContact(this.headers, { contactId: this.contactToModify.id }).then(res => {
        this.closeDeleteModal()
        this.$store.commit('deleteContact', { contactId: this.contactToModify.id })
      })
    },

    // updateContactAndClose(contact, isDelete = false) {
    //   if (!isDelete) {
    //     const index = this.updateData.findIndex(c => c.id === contact.id);
    //     if (index !== -1) {
    //       this.updateData[index] = contact;
    //     } else {
    //       this.updateData.push(contact);
    //     }
    //     this.$store.dispatch('updateContactAction', { contact });
    //   } else {
    //     // Handle permanent deletion
    //     this.$store.dispatch('deleteContactAction', { contactId: contact.id });
    //   }
    //   this.showDeleteModal = false;
    //   this.contactToModify = null;
    // },


    async onAddRowClick() {
      if (!this.selectedClient) {
        return
      }
      const clientId = this.selectedClient.id
      const defaultValues = {
        clientId,
        sortOrder: this.isDefaultOrder ? 0 : 1,
        archived: false,
        id: generateRandomId(),
        enabled: true,
        zip: null,
        state: null,
        mainDetail: null,
        secondaryDetail: null,
        memo: null,
        contactType: null,
        overrideSortOrder: false
      }
      if (this.isCopyingContacts) {
        this.selectedContactIds.forEach((contactId, idx) => {
          const contactIndex = this.displayedContacts.findIndex((contact) => contact.id === Number(contactId))
          const contact = this.displayedContacts[contactIndex]
          contact.contactType = ''
          const newContact = Object.assign({}, contact)
          newContact.id = generateRandomId()
          this.updateData.push(newContact)
          this.$store.commit('pushNewContact', {
            state: this.selectedClient,
            contact: newContact
          });

          // Wait for Vue to update the DOM before setting focus
          this.$nextTick(() => {
            const newIndex = this.displayedContacts.findIndex(c => c.id === newContact.id);
            if (newIndex !== -1) {
              // Focus specifically on the contactType field
              this.toggleEditable(`${newIndex}-contactType`, newContact.id);

              // Find and click the contactType cell to open the dropdown
              const typeCell = document.getElementById(`${newIndex}-contactType`);
              if (typeCell) {
                typeCell.click();
              }
            }
          });
        })
      } else {
        // const contact = Object.assign({}, defaultValues)
        const contact = await this.$api.createContact(this.headers, { contact: defaultValues })
        console.log('contact', contact)
        this.updateData.push(contact)
        this.$store.commit('pushNewContact', {
          state: this.selectedClient,
          contact
        });

        // Wait for Vue to update the DOM before setting focus
        this.$nextTick(() => {
          const newIndex = this.displayedContacts.findIndex(c => c.id === contact.id);
          if (newIndex !== -1) {
            // Focus specifically on the contactType field
            this.toggleEditable(`${newIndex}-contactType`, contact.id);

            // Find and click the contactType cell to open the dropdown
            const typeCell = document.getElementById(`${newIndex}-contactType`);
            if (typeCell) {
              typeCell.click();
            }
          }
        });
      }
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
    // goToPrevColumn() {
    //   console.log("goprev", this.editableId)
    //   const currentCell = this.editableId
    //   const idArr = currentCell.split('-')
    //   const columnIndex = columns.findIndex((col) => col === idArr[1])
    //   const currentRow = Number(idArr[0])
    //   if (columnIndex === 0 && currentRow > 0) {
    //     const prevRow = currentRow - 1
    //     const prevCell = `${prevRow}-${columns[columns.length - 1]}`
    //     console.log(prevCell)
    //     this.toggleEditable(prevCell, this.editableContactId)
    //   } else if (columnIndex > 0) {
    //     const prevCell = `${currentRow}-${columns[columnIndex - 1]}`
    //     console.log(prevCell)
    //     this.toggleEditable(prevCell, this.editableContactId)
    //   }
    // },
    goToPrevColumn() {
      const currentCell = this.editableId
      const idArr = currentCell.split('-')
      const columnIndex = columns.findIndex((col) => col === idArr[1])
      const currentRow = Number(idArr[0])
      if (columnIndex === 0 && currentRow > 0) {
        const prevRow = currentRow - 1
        const prevCell = `${prevRow}-${columns[columns.length - 1]}`
        this.toggleEditable(prevCell, this.editableContactId)
      } else if (columnIndex > 0) {
        const prevCell = `${idArr[0]}-${columns[columnIndex - 1]}`
        this.toggleEditable(prevCell, this.editableContactId)
      }
    },
    onBlur(val, field, event = null) {
      if (event && event.shiftKey && event.key === "Tab") return;
      if (this.oldValue !== val) {
        this.handleUpdate(field)
        if (event?.key !== 'Escape') {
          this.goToNextColumn()
          return
        }
      }
      if (event?.key === 'Tab' || event?.key === 'Enter') {
        this.goToNextColumn()
        return
      }
      this.editableId = ""
    },
    startDrag() {
      this.dragActive = true
    },

    removeOverride(contact) {
      contact.overrideSortOrder = false;
      this.$api.updateContact(this.headers, { clientId: this.clientId, contactId: contact.id }, contact)
      this.$store.commit('removeContactOverrideSort', { contact });
      this.sortContactsByType();

      const index = this.updateData.findIndex(con => con.id === contact.id)
      if (index !== -1) {
        this.updateData[index] = contact
      } else {
        this.updateData.push(contact)
      }
    },

    onDrop(evt) {
      const item = this.displayedContacts[evt.oldIndex]
      item.sortOrder = evt.newIndex + 1
      item.overrideSortOrder = true  // Add this flag
      console.log('onDrop', item)
      this.$api.updateContact(this.headers, { clientId: this.clientId, contactId: item.id }, item)
      this.dragActive = false
      this.displayedContacts.forEach((contact, index) => {
        if (contact.id !== item.id) {
          contact.sortOrder = index + 1
        }
      })
      this.$store.commit('updateContactOrder', { item })
      this.sortContactsByType('onDrop', item, evt)

    },

    sortContactsByType(str, item, evt) {
      console.log('sort function run');
      console.log('Initial displayedContacts:', JSON.parse(JSON.stringify(this.displayedContacts)));

      if (str === 'onDrop') {
        console.log('onDrop', item);

        const contacts = this.displayedContacts;
        const oldIndex = evt.oldIndex;
        const newIndex = evt.newIndex;

        // Remove the moved item from its old position
        const movedItem = contacts.splice(oldIndex, 1)[0];

        // Insert the moved item at the new index
        contacts.splice(newIndex, 0, movedItem);

        // If the item moved UP (oldIndex > newIndex):
        if (oldIndex > newIndex) {
          // Loop from newIndex to oldIndex (inclusive) and update sortOrder
          for (let i = newIndex; i <= oldIndex; i++) {
            contacts[i].sortOrder = i + 1; // 1-based sortOrder
          }
        }
        // Else if the item moved DOWN (oldIndex < newIndex):
        else if (oldIndex < newIndex) {
          // Loop from oldIndex to newIndex (inclusive) and update sortOrder
          for (let i = oldIndex; i <= newIndex; i++) {
            contacts[i].sortOrder = i + 1;
          }
        }

        // console.log('Updated displayedContacts:', JSON.parse(JSON.stringify(contacts)));
        this.displayedContacts = contacts;

        console.log('moveditem', movedItem)
        const index = this.updateData.findIndex(con => con.id === movedItem.id)
        if (index !== -1) {
          this.updateData[index] = movedItem
        } else {
          this.updateData.push(movedItem)
        }
        return
      }


      // בדיקה אם קיימים פריטים שנגררו ידנית
      const hasManuallyPositioned = this.displayedContacts.some(contact => contact.overrideSortOrder);

      if (hasManuallyPositioned) {
        // console.log('Manually positioned items found');
        // הפרדת פריטים שנגררו ידנית מהאוטומטיים
        const manuallyPositioned = this.displayedContacts.filter(contact => contact.overrideSortOrder);
        const autoPositioned = this.displayedContacts.filter(contact => !contact.overrideSortOrder);

        // console.log('Manually positioned:', manuallyPositioned);
        // console.log('Auto positioned:', autoPositioned);

        // מיון הפריטים האוטומטיים לפי contactType לפי הסדר המוגדר ב־contactTypeOptions
        const sortedAutoPositioned = [...autoPositioned].sort((a, b) => {
          if (a.contactType == null && b.contactType == null) return 0;
          if (a.contactType == null) return -1;
          if (b.contactType == null) return 1;

          const contactTypeOrder = this.contactTypeOptions
            .filter(type => type.show)
            .map(type => type.value);

          const aIndex = contactTypeOrder.indexOf(a.contactType);
          const bIndex = contactTypeOrder.indexOf(b.contactType);

          if (aIndex === -1 && bIndex === -1) return 0;
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;

          return aIndex - bIndex;
        });

        // מיון הפריטים שנגררו ידנית לפי sortOrder
        const sortedManuallyPositioned = [...manuallyPositioned].sort((a, b) => {
          return (a.sortOrder || 0) - (b.sortOrder || 0);
        });
        // console.log('sortedManuallyPositioned', sortedManuallyPositioned);

        // יצירת מערך חדש עם אורך התואם למספר הפריטים המקורי
        const finalContacts = new Array(this.displayedContacts.length);

        // הצבת הפריטים שנגררו ידנית במערך עם הלוגיקה המעודכנת
        sortedManuallyPositioned.forEach(contact => {
          // חישוב המיקום הרצוי (נניח ש־sortOrder הוא בספירה של 1)
          let target = contact.sortOrder > 0 ? contact.sortOrder - 1 : 0;
          // אם המיקום הרצוי מחוץ לגבולות המערך, מצרפים לסוף
          if (target >= finalContacts.length) {
            finalContacts.push(contact);
            // console.log('Placed manually positioned contact with id', contact.id, 'at appended position', finalContacts.length - 1);
          } else {
            // אם המיקום הרצוי תפוס, מחפשים את המיקום הפנוי הבא
            while (target < finalContacts.length && finalContacts[target] !== undefined) {
              target++;
            }
            if (target < finalContacts.length) {
              finalContacts[target] = contact;
              // console.log('Placed manually positioned contact with id', contact.id, 'at position', target);
            } else {
              finalContacts.push(contact);
              // console.log('Placed manually positioned contact with id', contact.id, 'at appended position', finalContacts.length - 1);
            }
          }
        });

        // מילוי הפערים בפריטים האוטומטיים
        let autoIndex = 0;
        for (let i = 0; i < finalContacts.length; i++) {
          if (finalContacts[i] === undefined && autoIndex < sortedAutoPositioned.length) {
            // console.log('Adding auto-positioned item at index', i, 'with id', sortedAutoPositioned[autoIndex].id);
            finalContacts[i] = sortedAutoPositioned[autoIndex++];
          }
        }
        // הוספת פריטים אוטומטיים שנותרו
        while (autoIndex < sortedAutoPositioned.length) {
          finalContacts.push(sortedAutoPositioned[autoIndex++]);
        }
        // console.log("finalContacts", finalContacts);

        // הסרת ערכים undefined (אם יש)
        const cleanedFinalContacts = finalContacts.filter(c => c !== undefined);
        // console.log('cleanedFinalContacts', cleanedFinalContacts);
        // console.log('Final contacts before update:', JSON.parse(JSON.stringify(cleanedFinalContacts)));

        // עדכון רשימת הפריטים המוצגת
        this.displayedContacts.splice(0, this.displayedContacts.length, ...cleanedFinalContacts);
      } else {
        // הלוגיקה הקיימת עבור פריטים שאינם נגררו ידנית
        const sortedContacts = [...this.displayedContacts].sort((a, b) => {
          if (a.contactType == null && b.contactType == null) return 0;
          if (a.contactType == null) return -1;
          if (b.contactType == null) return 1;

          const contactTypeOrder = this.contactTypeOptions
            .filter(type => type.show)
            .map(type => type.value);

          const aIndex = contactTypeOrder.indexOf(a.contactType);
          const bIndex = contactTypeOrder.indexOf(b.contactType);

          if (aIndex === -1 && bIndex === -1) return 0;
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;

          return aIndex - bIndex;
        });
        this.displayedContacts.splice(0, this.displayedContacts.length, ...sortedContacts);
      }

      // console.log('After sort:', JSON.parse(JSON.stringify(this.displayedContacts)));

      // שמירה על הפוקוס בעורך אם נדרש
      if (this.trackedContactId) {
        const newIndex = this.displayedContacts.findIndex(c => c.id === this.trackedContactId);
        if (newIndex !== -1) {
          this.$nextTick(() => {
            const currentColumn = this.editableId.split('-')[1];
            this.editableId = `${newIndex}-${currentColumn}`;
          });
        }
      }
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
