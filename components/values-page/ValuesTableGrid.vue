<template>
  <div
    class="w-full h-full grid grid-cols-4 grid-rows-2 gap-2 bg-gray-100 border border-indigo-500 p-2"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'ValuesTableGrid',

  data () {
    return {

    };
  },

  mounted () {

  },

  methods: {

  },
};
</script>

<style scoped>
</style>
