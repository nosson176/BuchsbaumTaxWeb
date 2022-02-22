<template>
  <div class="flex bg-blue-200 items-center p-0.5 rounded-t-sm space-x-1">
    <ToggleButton v-model="viewActive" @click="toggleView" />
    <span id="view-active" class="ml-1">
      <span class="text-xs tracking-tighter font-medium text-gray-700">{{ viewActive ? 'Active' : 'Archived' }} </span>
    </span>
  </div>
</template>

<script>
import { events } from '~/shared/constants'
export default {
  name: 'ViewArchivedHeader',
  data () {
    return {
      viewActive: true
    }
  },
  methods: {
    toggleView () {
      this.viewActive = !this.viewActive
      this.emitChange()
    },
    emitChange () {
      this.$emit(events.change)
    }
  }
}
</script>

<style scoped>

</style>
