<template>
  <div class="w-full h-full">
    <ContactValuesTables v-if="isContactsTabActive" />
  </div>
</template>

<script>
export default {
  name: "ValueTable",
  props: {
    activeTab: {
      type: Object,
      default: () => null
    }
  },
  computed: {
    isContactsTabActive () {
      return this.activeTab.value === "contact";
    }
  }
}
</script>

<style scoped>
</style>
