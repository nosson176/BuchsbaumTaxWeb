<template>
  <div>
    {{ line }}
  </div>
</template>

<script>
export default {
  name: 'SmartviewLine',
  props: {
    line: {
      type: Object,
      required: true
    },
    key: {
      type: Number,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
