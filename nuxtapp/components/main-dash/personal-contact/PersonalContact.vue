<template>
  <div class="flex-grow overflow-auto">
    <div
      v-for="(personal, idx) in displayedPersonals"
      :key="personal.id"
    >
      <TableHeader>
        <TableRow :idx="idx">
          <div class="w-1/12">
            {{ personal.include }}
          </div>
          <div class="w-1/12">
            {{ personal.category }}
          </div>
          <div class="w-2/12">
            {{ personal.firstName }}
          </div>
          <div class="w-1/12">
            {{ personal.middleInitial || '' }}
          </div>
          <div class="w-2/12">
            {{ personal.lastName }}
          </div>
          <div class="w-2/12">
            {{ personal.dateOfBirth }}
          </div>
          <div class="w-2/12">
            {{ personal.ssn }}
          </div>
          <div class="w-2/12">
            {{ personal.informal }}
          </div>
          <div class="w-1/12">
            {{ personal.relation }}
          </div>
          <div>{{ personal.language }}</div>
        </TableRow>
      </TableHeader>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { models } from '~/shared/constants'
const categories = {
  primary: 'PRI.',
  secondary: 'SEC.',
  dependant: 'DEP. '
}

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
    },
    columnNames () {
      if (this.selectedClient.taxPersonals) {
        return Object.keys(this.selectedClient.taxPersonals)
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
    }
  }
}
</script>

<style scoped>

</style>
