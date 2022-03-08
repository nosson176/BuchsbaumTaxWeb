<template>
  <div class="flex space-x-2 justify-center">
    <Tab
      v-for="(tab, index) in tabs"
      :key="index"
      :active="isActive(tab)"
      @click="setActive(tab)"
    >{{ tab.name }}</Tab>
  </div>
</template>

<script>
import { events, valueTabs } from '~/shared/constants'
export default {
  name: 'ValueTabs',
  props: {
    activeTab: {
      type: Object,
      default: () => null
    }
  },
  computed: {
    tabs () {
      return valueTabs
    }
  },
  methods: {
    isActive ({ value }) {
      return this.activeTab.value === value
    },
    setActive (tab) {
      this.$emit(events.click, tab)
    }
  }
};
</script>

<style scoped>
</style>
