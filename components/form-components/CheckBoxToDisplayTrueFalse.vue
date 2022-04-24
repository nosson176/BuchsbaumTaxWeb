<template>
  <div class="flex items-center h-5 mr-1">
    <input
      :id="id"
      :checked="checked"
      :name="name"
      type="checkbox"
      class="h-3 w-3 pointer-events-none focus:ring-indigo-500 text-indigo-600 border-gray-300 rounded"
      :disabled="disabled"
    />
    <label :for="id" class="" />
  </div>
</template>

<script>
export default {
  name: 'CheckBoxToDisplayTrueFalse',
  props: {
    id: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    checked: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped></style>
