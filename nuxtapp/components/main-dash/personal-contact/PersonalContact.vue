<template>
  <div class="flex-grow overflow-auto">
    <TableHeader>
      <div class="column-1" />
      <div class="column-2">
        Cat
      </div>
      <div class="column-3">
        First
      </div>
      <div class="column-4">
        M
      </div>
      <div class="column-5">
        Last
      </div>
      <div class="column-6">
        DOB
      </div>
      <div class="column-7">
        SSN
      </div>
      <div class="column-8">
        Informal
      </div>
      <div class="column-9">
        Relation
      </div>
      <div class="column-10">
        Lang
      </div>
      <div class="column-11" />
    </TableHeader>
    <div
      v-for="(personal, idx) in displayedPersonals"
      :key="personal.id"
    >
      <TableRow :idx="idx">
        <div class="column-1">
          {{ personal.include }}
        </div>
        <div class="column-2">
          {{ personal.category }}
        </div>
        <div class="column-3">
          {{ personal.firstName }}
        </div>
        <div class="column-4">
          {{ personal.middleInitial }}
        </div>
        <div class="column-5">
          {{ personal.lastName }}
        </div>
        <div class="column-6">
          {{ formatDate(personal.dateOfBirth) }}
        </div>
        <div class="column-7">
          {{ personal.ssn }}
        </div>
        <div class="column-8">
          {{ personal.informal }}
        </div>
        <div class="column-9">
          {{ personal.relation }}
        </div>
        <div class="column-10">
          {{ personal.language }}
        </div>
        <div class="column-11">
          x
        </div>
      </TableRow>
    </div>
  </div>
</template>

<script>
import { format, parseISO } from 'date-fns'
import { mapState } from 'vuex'
import { models } from '~/shared/constants'
const categories = {
  primary: 'PRI.',
  secondary: 'SEC.',
  dependant: 'DEP.'
}
const dateFormat = 'M/d/yy'

export default {
  name: 'PersonalContact',
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
