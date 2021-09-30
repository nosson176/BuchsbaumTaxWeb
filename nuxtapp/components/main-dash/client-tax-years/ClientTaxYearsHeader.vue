<template>
  <div class="bg-gray-700 text-white rounded-t-sm px-3 h-6">
    <div class="grid grid-cols-7 grid-rows-1">
      <div class=" col-start-1">
        {{ selectedClient.lastName || '' }}
      </div>
      <div class=" col-start-3">
        {{ selectedClient.currentStatus || '' }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { models } from '~/shared/constants'

export default {
  name: 'ClientTaxYearsHeader',
  computed: {
    ...mapState([models.selectedClient])
  }
}
</script>

<style scoped>

</style>
