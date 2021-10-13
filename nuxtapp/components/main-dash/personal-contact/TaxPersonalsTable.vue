<template>
  <div>
    <Table>
      <template #header>
        <TableHeader>
          <th scope="col" class="header-cell" />
          <th scope="col" class="header-cell">
            Cat
          </th>
          <th scope="col" class="header-cell">
            First
          </th>
          <th scope="col" class="header-cell">
            M
          </th>
          <th scope="col" class="header-cell">
            Last
          </th>
          <th scope="col" class="header-cell">
            DOB
          </th>
          <th scope="col" class="header-cell">
            SSN
          </th>
          <th scope="col" class="header-cell">
            Informal
          </th>
          <th scope="col" class="header-cell">
            Relation
          </th>
          <th scope="col" class="header-cell">
            Lang
          </th>
          <th scope="col" class="header-cell" />
        </TableHeader>
      </template>
      <template #body>
        <TableRow
          v-for="(personal, idx) in displayedPersonals"
          :key="personal.id"
          :idx="idx"
        >
          <td class="row-cell">
            <div class="flex items-center h-5">
              <input
                id="include"
                :checked="personal.include"
                aria-describedby="personal-include"
                name="include"
                type="checkbox"
                class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded pointer-events-none"
              >
            </div>
          </td>
          <td class="main-row-cell">
            {{ personal.category }}
          </td>
          <td class="row-cell">
            {{ personal.firstName }}
          </td>
          <td class="row-cell">
            {{ personal.middleInitial }}
          </td>
          <td class="row-cell">
            {{ personal.lastName }}
          </td>
          <td class="row-cell">
            {{ formatDate(personal.dateOfBirth) }}
          </td>
          <td class="row-cell">
            {{ personal.ssn }}
          </td>
          <td class="row-cell">
            {{ personal.informal }}
          </td>
          <td class="row-cell">
            {{ personal.relation }}
          </td>
          <td class="row-cell">
            {{ personal.language }}
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
import { format, parseISO } from 'date-fns'
import { models } from '~/shared/constants'
const categories = {
  primary: 'PRI.',
  secondary: 'SEC.',
  dependant: 'DEP.'
}
const dateFormat = 'M/d/yy'

export default {
  name: 'TaxPersonalsTable',
  props: {
    showArchived: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState([models.selectedClient]),
    displayedPersonals () {
      if (!this.showArchived) {
        return this.notArchived
      } else {
        return this.archived
      }
    },
    notArchived () {
      if (this.selectedClient.taxPersonals) {
        return this.selectedClient.taxPersonals
          .filter(personal => !personal.archived)
          .sort((a, b) => this.sortByCategory(a, b))
      } else {
        return null
      }
    },
    archived () {
      if (this.selectedClient.taxPersonals) {
        return this.selectedClient.taxPersonals
      } else {
        return null
      }
    }
  },
  methods: {
    sortByCategory (a, b) {
      if (
        (a.category === categories.secondary && b.category === categories.primary) ||
              (a.category === categories.dependant && b.category === categories.primary) ||
              (a.category === categories.dependant && b.category === categories.secondary)
      ) {
        return 1
      } else if (
        (a.category === categories.primary && b.category === categories.secondary) ||
              (a.category === categories.primary && b.category === categories.dependant) ||
              (a.category === categories.secondary && b.category === categories.dependant)
      ) {
        return -1
      } else {
        return 0
      }
    },
    formatDate (date) {
      if (date) {
        return format(parseISO(date), dateFormat)
      } else {
        return ''
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
