<template>
  <div>
    <p class="text-base text-gray-800 cursor-pointer" contenteditable="true" @click="makeEditable">
      Click to edit this text2
    </p>

    <!-- Tooltip for styling options -->
    <div v-if="tooltipVisible" class="absolute z-10 bg-white border border-gray-200 p-4 rounded shadow-md">
      <div class="mb-2">
        <label class="block text-sm font-medium text-gray-700 mb-1">Styling Options</label>
        <div class="flex items-center">
          <input
            v-model="color"
            type="text"
            placeholder="Color"
            class="w-24 px-2 py-1 border border-gray-300 rounded mr-2"
          />
          <input
            v-model="fontSize"
            type="text"
            placeholder="Font size"
            class="w-24 px-2 py-1 border border-gray-300 rounded mr-2"
          />
          <button @click="applyStyling" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Apply
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tooltipVisible: false,
      color: '',
      fontSize: '',
    }
  },
  methods: {
    makeEditable(event) {
      event.target.focus()
      this.tooltipVisible = true // Show tooltip on click
    },
    applyStyling() {
      // Apply styling logic here (e.g., change color and font size of selected text)
      this.tooltipVisible = false // Hide tooltip after applying
    },
  },
}
</script>

<style scoped>
/* Scoped styles for component */
</style>
