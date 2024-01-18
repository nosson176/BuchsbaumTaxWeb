<template>
  <div class="container">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'ValuesTableGrid',

  data() {
    return {}
  },

  mounted() {},

  methods: {},
}
</script>

<style scoped>
.container {
  @apply w-full overflow-auto grid grid-cols-3 gap-4 bg-gray-100 border border-indigo-500 p-2;

  height: calc(100vh - 10rem);
}
</style>
