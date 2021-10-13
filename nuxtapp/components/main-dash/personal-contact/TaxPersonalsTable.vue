<template>
  <div>
    <Table>
      <template #header>
        <TableHeader>
          <th scope="col" class="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
          <th scope="col" class="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Cat
          </th>
          <th scope="col" class="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            First
          </th>
          <th scope="col" class="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            M
          </th>
          <th scope="col" class="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Last
          </th>
          <th scope="col" class="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            DOB
          </th>
          <th scope="col" class="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            SSN
          </th>
          <th scope="col" class="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Informal
          </th>
          <th scope="col" class="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Relation
          </th>
          <th scope="col" class="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Lang
          </th>
          <th scope="col" class="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
        </TableHeader>
      </template>
      <template #body>
        <TableRow
          v-for="(personal, idx) in displayedPersonals"
          :key="personal.id"
          :idx="idx"
        >
          <td class="px-2 py-4 text-sm text-gray-500">
            <div class="flex items-center h-5">
              <input
                id="comments"
                :checked="personal.include"
                aria-describedby="comments-description"
                name="comments"
                type="checkbox"
                class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded pointer-events-none"
              >
            </div>
          </td>
          <td class="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            {{ personal.category }}
          </td>
          <td class="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ personal.firstName }}
          </td>
          <td class="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ personal.middleInitial }}
          </td>
          <td class="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ personal.lastName }}
          </td>
          <td class="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ formatDate(personal.dateOfBirth) }}
          </td>
          <td class="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ personal.ssn }}
          </td>
          <td class="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ personal.informal }}
          </td>
          <td class="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ personal.relation }}
          </td>
          <td class="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ personal.language }}
          </td>
          <td class="px-2 py-4 whitespace-nowrap text-sm text-gray-500 font-medium flex items-center justify-center">
            <div class="rounded-full cursor-pointer bg-gray-200 w-5 h-5 leading-tight text-center">
              x
            </div>
          </td>
        </TableRow>
      </template>
    </table>
  </div>
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
.column-1 {
  @apply w-1/12;
}

.column-2 {
  @apply w-1/12;
}

.column-3 {
  @apply w-1/5;
}

.column-4 {
  @apply w-1/12;
}

.column-5 {
  @apply w-1/5;
}

.column-6 {
  @apply w-2/12;
}

.column-7 {
  @apply w-3/12;
}

.column-8 {
  @apply w-2/12;
}

.column-9 {
  @apply w-2/12;
}

.column-10 {
  @apply w-1/12;
}

.column-11 {
  @apply w-1/12;
}
</style>
