<template>
  <div class="w-full h-full overflow-hidden">
    <ChecklistValueTables v-if="isChecklistsTabActive" />
    <ClientValueTables v-if="isClientTabActive" />
    <ContactValueTables v-if="isContactsTabActive" />
    <FeeValueTables v-if="isFeesTabActive" />
    <IncFbarValueTables v-if="isIncFbarTabActive" />
    <SharedValueTables v-if="isSharedTabActive" />
    <TaxPersonalValueTables v-if="isTaxPersonalTabActive" />
    <TaxYearValueTables v-if="isTaxYearTabActive" />
  </div>
</template>

<script>
import { tabs } from '~/shared/constants'
export default {
  name: 'ValueTable',
  props: {
    activeTab: {
      type: Object,
      default: () => null,
    },
  },
  computed: {
    isChecklistsTabActive() {
      return this.activeTab?.value === tabs.values.checklist
    },
    isClientTabActive() {
      return this.activeTab?.value === tabs.values.client
    },
    isContactsTabActive() {
      return this.activeTab?.value === tabs.values.contact
    },
    isFeesTabActive() {
      return this.activeTab?.value === tabs.values.fee
    },
    isIncFbarTabActive() {
      return this.activeTab?.value === tabs.values.inc_fbar_breakdown
    },
    isSharedTabActive() {
      return this.activeTab?.value === tabs.values.shared
    },
    isTaxPersonalTabActive() {
      return this.activeTab?.value === tabs.values.tax_personal
    },
    isTaxYearTabActive() {
      return this.activeTab?.value === tabs.values.tax_year
    },
  },
}
</script>

<style scoped></style>
