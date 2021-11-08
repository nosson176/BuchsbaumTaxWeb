<template>
  <div>
    <CustomSelectElement v-if="isEditable" :selected-option="selectedOption" :options="options" @change="emitChange" />
    <span v-else class="cursor-pointer">{{ selectedOption }}</span>
  </div>
</template>

<script>
import { events } from '~/shared/constants'
export default {
  name: 'EditableSelectCell',
  props: {
    selectedOption: {
      type: String,
      default: ''
    },
    isEditable: {
      type: Boolean,
      required: true
    },
    options: {
      type: Array,
      required: true
    }
  },
  methods: {
    emitChange (value) {
      this.$emit(events.change, value)
    }
  }
}
</script>

<style scoped>

</style>
