<template>
  <div class="w-full h-full">
    <ChecklistValueTables v-if="isChecklistsTabActive" />
    <ContactValueTables v-if="isContactsTabActive" />
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
    isContactsTabActive () {
      return this.activeTab?.value === tabs.values.contact;
    }
  },
}
</script>

<style scoped>
</style>
