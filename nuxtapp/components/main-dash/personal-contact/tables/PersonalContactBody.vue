<template>
  <div class="flex flex-grow overflow-hidden">
    <TaxPersonalsTable v-if="showTaxPersonals" :show-archived="showArchived" @delete="emitDelete" />
    <ContactTable v-else-if="showContacts" :show-archived="showArchived" @delete="emitDelete" />
  </div>
</template>

<script>
import { events, tabs } from '~/shared/constants'
export default {
  name: 'PersonalContactBody',
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
  },
  methods: {
    emitDelete (deleteObj) {
      this.$emit(events.delete, deleteObj)
    }
  }
}
</script>

<style scoped>

</style>
