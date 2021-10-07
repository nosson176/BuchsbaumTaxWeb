<template>
  <div class="flex-grow overflow-auto">
    <div
      v-for="(personal, idx) in displayedPersonals"
      :key="personal.id"
      class="bg-gray-100"
      :class=" idx % 2 === 0 ? 'even': ''"
    >
      {{ personal }}
    </div>
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
      return this.selectedClient.taxPersonals
        .filter(personal => !personal.archived)
    },
    archived () {
      return this.selectedClient.taxPersonals
    }
  }
}
</script>

<style scoped>
.even {
  @apply bg-gray-300;
}
</style>
