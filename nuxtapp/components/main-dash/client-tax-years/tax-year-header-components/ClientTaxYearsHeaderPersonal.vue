<template>
  <div v-if="personal" class="flex w-full justify-end">
    <span class="mr-auto">{{ category }}</span><span>{{ firstName }}</span> (<span>{{ relationFirstLetter }}</span> <span>,{{ lang }}</span>)
  </div>
</template>

<script>
export default {
  name: 'ClientTaxYearsHeaderPersonal',
  props: {
    personal: {
      type: Object,
      default: () => null
    }
  },
  computed: {
    category () {
      return this.personal.category
    },
    firstName () {
      return this.personal.firstName
    },
    relationFirstLetter () {
      return this.personal.relation?.slice(0, 1)
    },
    lang () {
      return this.personal.language
    }
  }
}
</script>

<style scoped>

</style>
