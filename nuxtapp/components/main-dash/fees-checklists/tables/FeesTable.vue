<template>
  <div class="px-3 py-1 text-xs tracking-tighter tax-year h-16 cursor-pointer border border-gray-300 border-opacity-0 hover:border-opacity-100" :class="classObj">
    <div class="flex flex-col space-y-3">
      <div class="flex">
        <span class="font-bold mr-2">{{ }}</span>
        <span> {{ }}</span>
        <span class="ml-auto">{{ }}</span>
      </div>
      <div class="flex">
        <span class="mr-2"> {{ }}</span>
        <span>{{ }}</span>
        <span class="ml-auto">{{ }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { models } from '~/shared/constants'
export default {
  name: 'FeesTable',
  props: {
    showArchived: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState([models.allClientFees]),
    classObj () {
      const even = this.idx % 2 === 0
      return { even }
    }
  },
  methods: {

  }
}
</script>

<style scoped>
.even {
  @apply bg-gray-50;
}
</style>
