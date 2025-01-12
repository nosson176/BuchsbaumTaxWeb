<template>
  <div class="flex space-x-2 justify-center">
    <Tab :active="isTaxPersonalsActive" :count="taxPersonalsCount" @click="setTabTaxPersonals"> Tax Personals </Tab>
    <Tab :active="isContactsActive" :count="contactsCount" @click="setTabContact"> Contact </Tab>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { events, models, tabs } from '~/shared/constants'
export default {
  name: 'PersonalContactTabs',
  props: {
    activeTab: {
      type: String,
      default: tabs.contact,
    },
  },
  computed: {
    ...mapState([models.selectedClient]),
    isTaxPersonalsActive() {
      return this.activeTab === tabs.tax_personals
    },
    isContactsActive() {
      return this.activeTab === tabs.contact
    },
    contactsCount() {
      return this.selectedClient?.contacts?.filter((contact) => !contact.archived).length
    },
    taxPersonalsCount() {
      return this.selectedClient?.taxPersonals?.filter((taxPersonal) => !taxPersonal?.archived).length
    },
  },
  methods: {
    setTabTaxPersonals() {
      this.$emit(events.click, tabs.tax_personals)
    },
    setTabContact() {
      this.$emit(events.click, tabs.contact)
    },
  },
}
</script>

<style scoped></style>
