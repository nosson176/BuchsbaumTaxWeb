<template>
  <div class="header">
    <div v-if="selectedClient" class="w-full grid grid-cols-7 gap-x-4 grid-rows-1 items-center">
      <div class="col-start-1 font-bold text-lg">
        {{ selectedClient.lastName }}
      </div>
      <div class="col-start-2">
        <ClientTaxYearsHeaderPersonal :personal="primaryPersonal" />
        <ClientTaxYearsHeaderPersonal :personal="secondaryPersonal" />
      </div>
      <div class="col-start-3 font-semibold text-gray-100 flex justify-center">
        {{ selectedClient.currentStatus }}
      </div>
      <div class="col-start-4">
        {{ selectedClient.periodical }}
      </div>
      <div class="col-start-5">
        {{ formattedCreatedDate }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { categories, models } from '~/shared/constants'
import { formatDateForClient } from '~/shared/domain-utilities'

export default {
  name: 'ClientTaxYearsHeader',
  computed: {
    ...mapState([models.selectedClient]),
    primaryPersonal () {
      return this.selectedClient?.taxPersonals?.filter(personal => personal.category === categories.primary)[0]
    },
    secondaryPersonal () {
      return this.selectedClient?.taxPersonals?.filter(personal => personal.category === categories.secondary)[0]
    },
    formattedCreatedDate () {
      if (this.selectedClient.created) {
        return formatDateForClient(this.selectedClient.created)
      } else {
        return ''
      }
    }
  }
}
</script>

<style scoped>
  .header {
    @apply flex bg-gray-700 text-white rounded-t-sm px-3 items-center;

    min-height: 4rem;
  }
</style>
