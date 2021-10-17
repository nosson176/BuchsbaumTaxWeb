<template>
  <div class="flex flex-grow overflow-hidden">
    <TaxPersonalsTable v-if="showTaxPersonals" show-archived />
    <ContactTable v-else-if="showContacts" show-archived />
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
    },
    showContacts () {
      return this.currentTab === tabs.contact
    }
  }
}
</script>

<style scoped>

</style>
