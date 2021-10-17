<template>
  <Table>
    <template #header>
      <TableHeader>
        <div class="table-header w-1/12" />
        <div class="table-header w-1/12" />
        <div class="table-header w-2/12">
          Type
        </div>
        <div class="table-header w-2/12">
          Memo
        </div>
        <div class="table-header w-4/12">
          Address / Phone / Routing
        </div>
        <div class="table-header w-1/5">
          City / Account
        </div>
        <div class="table-header w-1/12">
          St
        </div>
        <div class="table-header w-1/12">
          Zip
        </div>
        <div class="table-header w-1/12" />
      </TableHeader>
    </template>
    <template #body>
      <TableRow
        v-for="(contact, idx) in displayedContacts"
        :key="contact.id"
        :idx="idx"
      >
        <div class="table-col w-1/12">
          <div class="flex items-center h-5">
            <input
              id="comments"
              :checked="false"
              name="comments"
              type="checkbox"
              class="h-4 w-4"
            >
          </div>
        </div>
        <div class="table-col w-1/12">
          <div class="flex items-center h-5">
            <input
              id="disabled"
              :checked="!contact.disabled"
              name="disabled"
              type="checkbox"
              class="h-3 w-3 pointer-events-none"
              disabled
            >
          </div>
        </div>
        <div class="table-primary-col w-2/12">
          {{ contact.contactType }}
        </div>
        <div class="table-col w-1/5">
          {{ contact.memo }}
        </div>
        <div class="table-col w-4/12">
          {{ contact.mainDetail }}
        </div>
        <div class="table-col w-1/5">
          {{ contact.secondaryDetail }}
        </div>
        <div class="table-col w-1/12">
          {{ contact.state }}
        </div>
        <div class="table-col w-1/12">
          {{ contact.zip || '' }}
        </div>
        <div class="table-col w-1/12 flex items-center justify-center">
          <div class="rounded-full cursor-pointer bg-gray-200 w-5 h-5 leading-tight text-center">
            <CloseIcon class="w-2 h-2" />
          </div>
        </div>
      </TableRow>
    </template>
  </Table>
</template>

<script>
import { mapState } from 'vuex'
import { models } from '~/shared/constants'

export default {
  name: 'ContactTable',
  computed: {
    ...mapState([models.selectedClient]),
    displayedContacts () {
      if (!this.showArchived) {
        return this.notArchived
      } else {
        return this.archived
      }
    },
    notArchived () {
      if (this.selectedClient.contacts) {
        return this.selectedClient.contacts
          .filter(contact => !contact.archived)
      } else {
        return null
      }
    },
    archived () {
      if (this.selectedClient.contacts) {
        return this.selectedClient.contacts
          .filter(contact => contact.archived)
      } else {
        return null
      }
    }
  }
}
</script>

<style scoped>
</style>
