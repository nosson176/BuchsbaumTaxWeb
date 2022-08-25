<template>
  <Table class="h-auto shadow" @keydown.tab.prevent="onKeyDown">
    <template #header>
      <TableHeader>
        <div class="table-header"></div>
        <div class="table-header">Type</div>
        <div class="table-header w-full ml-1">Address/Number</div>
        <div class="table-header"></div>
      </TableHeader>
    </template>
    <template #body>
      <TableRow
        v-for="(contact, idx) in displayedContacts"
        :key="contact.id"
        class="pr-1"
        :class="{ selected: isSelected(contact) }"
      >
        <div class="table-col bg-gray-200 mr-1">
          <ClickCell>{{ idx + 1 }}</ClickCell>
        </div>
        <div class="table-col">
          <EditableCheckBoxCell v-model="contact.enabled" />
        </div>
        <div class="table-col">
          {{ contact.type }}
        </div>
        <div class="table-col w-full">
          {{ contact.mainDetail }}
          <span v-if="contact.secondaryDetail"
            >, <br />
            {{ contact.secondaryDetail }}
          </span>
        </div>
        <div class="table-col">
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
    return {}
  },
  computed: {
    ...mapState([models.selectedClient, models.valueTypes, models.search, models.selectedContact]),
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
  },
  mounted() {},
  methods: {
    setCurrentMapLocation(contact) {
      this.$store.commit(mutations.setModelResponse, { model: models.selectedContact, data: contact })
    },
    isTypeAddress({ contactType }) {
      return contactType?.toLowerCase().includes('address')
    },
    isSelected({ id }) {
      console.log(this.selectedContact.id === id)
      return this.selectedContact.id === id
    },
  },
}
</script>

<style scoped>
.selected {
  @apply bg-indigo-200;
}
</style>
