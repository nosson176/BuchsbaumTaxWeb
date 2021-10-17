<template>
  <div class="flex space-x-4">
    <Tab :active="isTaxPersonalsActive" @click="setTabTaxPersonals">
      Tax Personals
    </Tab>
    <Tab :active="isContactsActive" @click="setTabContact">
      Contact
    </Tab>
  </div>
</template>

<script>
import { events, tabs } from '~/shared/constants'
export default {
  name: 'PersonalContactTabs',
  data () {
    return {
      activeTab: tabs.tax_personals
    }
  },
  computed: {
    isTaxPersonalsActive () {
      return this.activeTab === tabs.tax_personals
    },
    isContactsActive () {
      return this.activeTab === tabs.contact
    }
  },
  methods: {
    setTabTaxPersonals () {
      this.$emit(events.click, tabs.tax_personals)
      this.setActiveTab(tabs.tax_personals)
    },
    setTabContact () {
      this.$emit(events.click, tabs.contact)
      this.setActiveTab(tabs.contact)
    },
    setActiveTab (tab) {
      this.activeTab = tab
    }
  }
}
</script>

<style scoped>

</style>
