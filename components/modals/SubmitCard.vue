<template>
  <div>
    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
      <div class="sm:flex sm:items-start">
        <slot />
      </div>
    </div>
    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
      <button
        :disabled="loading || disabled"
        type="button"
        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:cursor-not-allowed disabled:opacity-50"
        @click="emitSubmit"
      >
        <LoadingIndicator v-if="loading" class="px-4 cursor-not-allowed h-5 w-5 text-white" />
        <span v-else>Submit</span>
      </button>
      <button
        type="button"
        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        @click="emitHide"
      >
        Cancel
      </button>
    </div>
  </div>
</template>

<script>
import { events } from '~/shared/constants'
export default {
  name: 'SubmitCard',
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    emitSubmit() {
      this.$emit(events.submit)
      this.emitHide()
    },
    emitHide() {
      this.$emit(events.hide)
    },
  },
}
</script>

<style scoped></style>
