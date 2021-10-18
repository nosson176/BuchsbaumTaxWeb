<template>
  <Table>
    <template #header>
      <TableHeader>
        <div class="xs table-header" />
        <div class="sm table-header">
          Cat
        </div>
        <div class="normal table-header">
          First
        </div>
        <div class="xs table-header">
          M
        </div>
        <div class="normal table-header">
          Last
        </div>
        <div class="sm table-header">
          DOB
        </div>
        <div class="normal table-header">
          SSN
        </div>
        <div class="sm table-header">
          Informal
        </div>
        <div class="sm table-header">
          Relation
        </div>
        <div class="sm table-header">
          Lang
        </div>
        <div class="xs table-header" />
      </TableHeader>
    </template>
    <template #body>
      <TableRow
        v-for="(personal, idx) in displayedPersonals"
        :key="personal.id"
        :idx="idx"
      >
        <div class="xs table-col">
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
        <div class="sm table-col-primary">
          {{ personal.category }}
        </div>
        <div class="normal table-col">
          {{ personal.firstName }}
        </div>
        <div class="xs table-col">
          {{ personal.middleInitial }}
        </div>
        <div class="normal table-col">
          {{ personal.lastName }}
        </div>
        <div class="sm table-col">
          {{ formatDate(personal.dateOfBirth) }}
        </div>
        <div class="normal table-col">
          {{ personal.ssn }}
        </div>
        <div class="sm table-col">
          {{ personal.informal }}
        </div>
        <div class="sm table-col">
          {{ personal.relation }}
        </div>
        <div class="sm table-col">
          {{ personal.language }}
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
import { format, parseISO } from 'date-fns'
import { models } from '~/shared/constants'
import { sortByCategory } from '~/shared/domain-utilities'

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
          .sort((a, b) => sortByCategory(a, b))
      } else {
        return null
      }
    },
    archived () {
      if (this.selectedClient.taxPersonals) {
        return this.selectedClient.taxPersonals
          .filter(personal => personal.archived)
          .sort((a, b) => sortByCategory(a, b))
      } else {
        return null
      }
    }
  },
  methods: {
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
.header {
  @apply px-1 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider;
}

.table-col {
  @apply px-1 py-1 whitespace-nowrap text-sm text-gray-500;
}

.table-primary-table-col {
  @apply px-1 py-1 whitespace-nowrap text-sm font-medium text-gray-900;
}
</style>
