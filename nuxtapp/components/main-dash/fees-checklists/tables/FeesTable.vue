<template>
  <div class="flex-grow overflow-auto">
    <FeesItem v-for="(fee, idx) in selectedClientFees" :key="idx" :idx="idx" :fee="fee" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { models } from '~/shared/constants'
export default {
  name: 'FeesTable',
  props: {
    showArchived: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState([models.allClientFees, models.selectedClient]),
    classObj () {
      const even = this.idx % 2 === 0
      return { even }
    },
    selectedClientId () {
      return this.selectedClient.id
    },
    selectedClientFees () {
      return Object.values(this.allClientFees).filter(fees => fees.clientId === this.selectedClientId)
    }
  },
  methods: {

  }
}
</script>

<style scoped>
.even {
  @apply bg-gray-50;
}
</style>
