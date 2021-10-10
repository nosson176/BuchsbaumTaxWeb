<template>
  <div class="flex  space-x-5">
    <Tab @click="setTabTaxPersonals">
      Tax Personals
    </Tab>
    <Tab @click="setTabContact">
      Contact
    </Tab>
  </div>
</template>

<script>
import { events, tabs } from '~/shared/constants'
export default {
  name: 'PersonalContactTabs',
  methods: {
    setTabTaxPersonals () {
      this.$emit(events.click, tabs.tax_personals)
    },
    setTabContact () {
      this.$emit(events.click, tabs.contact)
    }
  }
}
</script>

<style scoped>

</style>
