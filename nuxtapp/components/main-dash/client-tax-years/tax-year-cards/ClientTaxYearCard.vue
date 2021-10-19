<template>
  <div>
    <div>{{ yearData.year }}</div>
    {{ yearData }}
  </div>
</template>

<script>
export default {
  name: 'ClientTaxYearCard',
  props: {
    yearData: {
      type: Object,
      default: () => null
    }
  }
}
</script>

<style scoped>

</style>
