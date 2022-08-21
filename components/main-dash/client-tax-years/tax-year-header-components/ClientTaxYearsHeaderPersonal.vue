<template>
  <div v-if="personal" class="flex w-full justify-end text-xs">
    <span class="mr-auto">{{ category }}</span
    ><span>{{ firstName }}</span
    >&nbsp;(<span>{{ relationFirstLetter }}</span> <span v-if="showComma">,</span><span>{{ lang }}</span
    >)
  </div>
</template>

<script>
export default {
  name: 'ClientTaxYearsHeaderPersonal',
  props: {
    personal: {
      type: Object,
      default: () => null,
    },
  },
  computed: {
    category() {
      return this.personal.category
    },
    firstName() {
      return this.personal.informal || this.personal.firstName
    },
    relationFirstLetter() {
      return this.personal.relation?.slice(0, 1)
    },
    lang() {
      return this.personal.language
    },
    showComma() {
      return this.relationFirstLetter && this.lang
    },
  },
}
</script>

<style scoped></style>
