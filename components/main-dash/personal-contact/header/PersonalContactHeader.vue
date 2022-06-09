<template>
  <div class="flex flex-col">
    <PersonalContactTabs :active-tab="activeTab" @click="emitTabClick" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { events, models, tabs } from '~/shared/constants'
export default {
  name: 'PersonalContactHeader',
  data() {
    return {
      activeTab: tabs.contact,
    }
  },
  computed: {
    ...mapState([models.selectedClient]),
  },
  watch: {
    selectedClient(newVal, oldVal) {
      if (newVal.id !== oldVal.id) {
        this.emitTabClick(tabs.contact)
      }
    },
  },
  methods: {
    emitTabClick(tab) {
      this.activeTab = tab
      this.$emit(events.click, tab)
    },
  },
}
</script>

<style scoped></style>
