<template>
  <div>
    <Table>
      <template #header>
        <TableHeader>
          <th scope="col" class="header-cell" />
          <th scope="col" class="header-cell" />
          <th scope="col" class="header-cell">
            Type
          </th>
          <th scope="col" class="header-cell">
            Memo
          </th>
          <th scope="col" class="header-cell">
            Address / Phone / Routing
          </th>
          <th scope="col" class="header-cell">
            City / Account
          </th>
          <th scope="col" class="header-cell">
            St
          </th>
          <th scope="col" class="header-cell">
            Zip
          </th>
          <th scope="col" class="header-cell" />
        </TableHeader>
      </template>
      <template #body>
        <TableRow
          v-for="(contact, idx) in displayedContacts"
          :key="contact.id"
          :idx="idx"
        >
          <td class="row-cell">
            <div class="flex items-center h-5">
              <input
                id="comments"
                :checked="false"
                aria-describedby="comments-description"
                name="comments"
                type="checkbox"
                class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded pointer-events-none"
              >
            </div>
          </td>
          <td class="row-cell">
            <div class="flex items-center h-5">
              <input
                id="comments"
                :checked="true"
                aria-describedby="comments-description"
                name="comments"
                type="checkbox"
                class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded pointer-events-none"
              >
            </div>
          </td>
          <td class="main-row-cell">
            {{ contact.contactType }}
          </td>
          <td class="row-cell">
            {{ contact.memo }}
          </td>
          <td class="row-cell">
            {{ contact.mainDetail }}
          </td>
          <td class="row-cell">
            {{ contact.secondaryDetail }}
          </td>
          <td class="row-cell">
            {{ contact.state }}
          </td>
          <td class="row-cell">
            {{ contact.zip || '' }}
          </td>
          <td class="row-cell font-medium flex items-center justify-center">
            <div class="rounded-full cursor-pointer bg-gray-200 w-5 h-5 leading-tight text-center">
              <CloseIcon class="w-2 h-2" />
            </div>
          </td>
        </TableRow>
      </template>
    </Table>
  </div>
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
      } else {
        return null
      }
    }
  }
}
</script>

<style scoped>
.header-cell {
  @apply px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider;
}

.row-cell {
  @apply px-2 py-4 text-sm whitespace-nowrap text-gray-500;
}

.main-row-cell {
  @apply px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900;
}
</style>
