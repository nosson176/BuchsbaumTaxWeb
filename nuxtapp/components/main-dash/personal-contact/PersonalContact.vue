<template>
  <div class="flex-grow overflow-auto">
    <TaxPersonals v-if="showTaxPersonals" show-archived />
  </div>
</template>

<script>
import { tabs } from '~/shared/constants'
export default {
  name: 'PersonalContact',
  props: {
    showArchived: {
      type: Boolean,
      default: false
    },
    currentTab: {
      type: String,
      default: ''
    }
  },
  computed: {
    showTaxPersonals () {
      return this.currentTab === tabs.tax_personals
    }
  }
}
</script>

<style scoped>

</style>
