<template>
  <div>
    <textarea v-if="isEditable" v-model="computedValue" class="w-full" />
    <span v-else class="cursor-pointer">{{ computedValue }}</span>
  </div>
</template>

<script>
import { events } from '~/shared/constants'

export default {
  name: 'EditableTextAreaCell',
  props: {
    value: {
      type: String,
      required: true
    },
    isEditable: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {

    }
  },
  computed: {
    computedValue: {
      get () {
        return this.value
      },
      set (newVal) {
        this.$emit(events.input, newVal)
      }
    }
  },
  methods: {

  }
}
</script>

<style scoped>
textarea {
  @apply text-xs shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500  border border-gray-300 rounded;

  resize: none;
}
</style>
