<template>
  <div>
    <Table>
      <template #header>
        <TableHeader>
          <div class="w-1/12 header" />
          <div class="w-1/12 header">
            Cat
          </div>
          <div class="w-1/5 header">
            First
          </div>
          <div class="w-1/12 header">
            M
          </div>
          <div class="w-1/5 header">
            Last
          </div>
          <div class="w-2/12 header">
            DOB
          </div>
          <div class="w-3/12 header">
            SSN
          </div>
          <div class="w-2/12 header">
            Informal
          </div>
          <div class="w-2/12 header">
            Relation
          </div>
          <div class="w-1/12 header">
            Lang
          </div>
          <div class="w-1/12 header" />
        </TableHeader>
      </template>
      <template #body>
        <TableRow
          v-for="(personal, idx) in displayedPersonals"
          :key="personal.id"
          :idx="idx"
        >
          <div class="w-1/12 col">
            <div class="flex items-center h-5">
              <input
                id="include"
                :checked="personal.include"
                name="include"
                type="checkbox"
                class="h-4 w-4 pointer-events-none"
              >
            </div>
          </div>
          <div class="w-1/12 primary-col">
            {{ personal.category }}
          </div>
          <div class="w-1/5 col">
            {{ personal.firstName }}
          </div>
          <div class="w-1/12 col">
            {{ personal.middleInitial }}
          </div>
          <div class="w-1/5 col">
            {{ personal.lastName }}
          </div>
          <div class="w-2/12 col">
            {{ formadivate(personal.dateOfBirth) }}
          </div>
          <div class="w-3/12 col">
            {{ personal.ssn }}
          </div>
          <div class="w-2/12 col">
            {{ personal.informal }}
          </div>
          <div class="w-2/12 col">
            {{ personal.relation }}
          </div>
          <div class="w-1/12 col">
            {{ personal.language }}
          </div>
          <div class="w-1/12 col flex items-center justify-center">
            <div class="rounded-full cursor-pointer bg-gray-200 w-5 h-5 leading-tight text-center">
              <CloseIcon class="w-2 h-2" />
            </div>
          </div>
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
    formadivate (date) {
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
.header {
  @apply px-1 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider;
}

.col {
  @apply px-1 py-1 whitespace-nowrap text-sm text-gray-500;
}

.primary-col {
  @apply px-1 py-1 whitespace-nowrap text-sm font-medium text-gray-900;
}
</style>
