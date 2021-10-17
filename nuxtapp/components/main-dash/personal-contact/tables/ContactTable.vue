<template>
  <Table>
    <template #header>
      <TableHeader>
        <div class="table-header xs" />
        <div class="table-header xs" />
        <div class="table-header sm">
          Type
        </div>
        <div class="table-header sm">
          Memo
        </div>
        <div class="table-header xl">
          Address / Phone / Routing
        </div>
        <div class="table-header normal">
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
        <div class="table-col xs">
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
        <div class="table-col xs">
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
        <div class="table-col-primary normal">
          {{ contact.contactType }}
        </div>
        <div class="table-col normal">
          {{ contact.memo }}
        </div>
        <div class="table-col xl">
          {{ contact.mainDetail }}
        </div>
        <div class="table-col normal">
          {{ contact.secondaryDetail }}
        </div>
        <div class="table-col xs">
          {{ contact.state }}
        </div>
        <div class="table-col sm">
          {{ contact.zip || '' }}
        </div>
        <div class="table-col xs">
          <DeleteButton />
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
  props: {
    showArchived: {
      type: Boolean,
      default: false
    }
  },
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
