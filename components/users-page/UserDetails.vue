<template>
  <div>{{ user }}</div>
</template>

<script>
export default {
  name: 'UserDetails',
  props: {
    user: {
      type: Object,
      default: () => null,
    }
  },
};
</script>

<style scoped>
</style>
