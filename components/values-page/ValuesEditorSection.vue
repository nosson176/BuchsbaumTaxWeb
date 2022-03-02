<template>
  <div class="h-full w-full flex flex-col">
    <ValueTabs />
    <div>
      <ValueTable />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { models } from '~/shared/constants';
export default {
  name: "ValuesEditorSection",
  data () {
    return {};
  },
  computed: {
    ...mapState([models.valueTypes])
  },
  mounted () {
    console.log(this.valueTypes)
  },
};
</script>

<style scoped>
</style>
