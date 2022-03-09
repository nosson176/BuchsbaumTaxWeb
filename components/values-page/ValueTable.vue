<template>
  <div class="w-full h-full">
    <ChecklistValueTables v-if="isChecklistsTabActive" />
    <ClientValueTables v-if="isClientTabActive" />
    <ContactValueTables v-if="isContactsTabActive" />
    <IncFbarValueTables v-if="isIncFbarTabActive" />
    <SharedValueTables v-if="isSharedTabActive" />
    <TaxPersonalValueTables v-if="isTaxPersonalTabActive" />
  </div>
</template>

<script>
import { tabs } from '~/shared/constants';
export default {
  name: "ValueTable",
  props: {
    activeTab: {
      type: Object,
      default: () => null
    }
  },
  computed: {
    isChecklistsTabActive () {
      return this.activeTab?.value === tabs.values.checklist;
    },
    isClientTabActive () {
      return this.activeTab?.value === tabs.values.client;
    },
    isContactsTabActive () {
      return this.activeTab?.value === tabs.values.contact;
    },
    isIncFbarTabActive () {
      return this.activeTab?.value === tabs.values.inc_fbar_breakdown;
    },
    isSharedTabActive () {
      return this.activeTab?.value === tabs.values.shared;
    },
    isTaxPersonalTabActive () {
      return this.activeTab?.value === tabs.values.tax_personal;
    },
  },
}
</script>

<style scoped>
</style>
