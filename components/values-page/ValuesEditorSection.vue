<template>
  <div class="h-full w-full flex flex-col">
    <ValueTabs :active-tab="activeTab" @click="setActiveTab" />
    <div>
      <ValueTable />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { models, valueTabs } from '~/shared/constants';
export default {
  name: "ValuesEditorSection",
  data () {
    return {
      activeTab: valueTabs[0]
    }
  },
  computed: {
    ...mapState([models.valueTypes])
  },
  methods: {
    setActiveTab (tab) {
      this.activeTab = tab;
    }
  }
};
</script>

<style scoped>
</style>
