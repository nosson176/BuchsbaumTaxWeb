<template>
  <div class="h-full w-7/10 flex flex-col p-8">
    <ValueTabs :active-tab="activeTab" @click="setActiveTab" />
    <ValueTable :active-tab="activeTab" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { models, valueTabs } from '~/shared/constants'
export default {
  name: 'ValuesEditorSection',
  data() {
    return {
      activeTab: valueTabs[0],
    }
  },
  computed: {
    ...mapState([models.valueTypes]),
  },
  methods: {
    setActiveTab(tab) {
      this.activeTab = tab
    },
  },
}
</script>

<style scoped></style>
