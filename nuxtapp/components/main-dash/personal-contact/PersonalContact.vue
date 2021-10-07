<template>
  <div class="flex-grow overflow-auto">
    {{ selectedClient.taxPersonals }}
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { models } from '~/shared/constants'

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
      return Object.fromEntries(Object.entries(this.selectedClient)
        .filter(([key, person]) => person.archived === false))
    },
    archived () {
      return this.selectedClient
    }
  }
}
</script>

<style scoped>

</style>
