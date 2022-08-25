<template>
  <Table class="h-auto shadow" @keydown.tab.prevent="onKeyDown">
    <template #header>
      <TableHeader>
        <div class="table-header"></div>
        <div class="table-header"></div>
        <div class="table-header w-full ml-1">Name</div>
        <div class="table-header"></div>
      </TableHeader>
    </template>
    <template #body>
      <TableRow v-for="(contact, idx) in displayedContacts" :key="contact.id" class="pr-1">
        <div class="table-col bg-gray-200 mr-1">
          <ClickCell>{{ idx + 1 }}</ClickCell>
        </div>
        <div class="table-col"></div>
        <div class="table-col w-full">{{ contact.mainDetail }}</div>
        <div class="table-col">
          <DeleteButton />
        </div>
      </TableRow>
    </template>
  </Table>
</template>

<script>
import { mapState } from 'vuex'
import { models } from '~/shared/constants'
import { searchArrOfObjs } from '~/shared/utility'

export default {
  name: 'ContactsList',
  data() {
    return {}
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
  methods: {},
}
</script>

<style scoped></style>
