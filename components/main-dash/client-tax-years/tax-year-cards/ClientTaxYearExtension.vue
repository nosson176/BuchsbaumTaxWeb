<template>
  <div class="extension text-xs">
    <span>{{extension.dateFiled}}</span>
    <span class="mx-1">{{extension.statusDate}}</span>
    <span>{{extension.status}}</span>
    <span class="font-bold ml-1">{{extension.taxForm}}</span>
  </div>
</template>

<script>
export default {
  name: 'ClientTaxYearExtension',
  props: {
    extension: {
      type: Object,
      default: ()=>{}
    }
  }
}
</script>

<style scoped>
.extension {
  writing-mode: tb-rl;
  transform: rotate(-180deg);
}
</style>
