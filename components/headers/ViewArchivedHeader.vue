<template>
  <div class="flex bg-blue-200 items-center p-0.5 rounded-t-sm space-x-1">
    <ToggleButton v-model="computedActive" />
    <span id="view-active" class="ml-1">
      <span class="text-xs tracking-tighter font-medium text-gray-700">{{ viewActive ? 'Active' : 'Archived' }} </span>
    </span>
    <!-- <ExportIcon v-if="showExport" class="ml-6" @export-click="exportToExcel" /> -->

  </div>
</template>

<script>
import { mapState } from 'vuex'
// import * as XLSX from "xlsx";
import { events, models } from '~/shared/constants'
export default {
  name: 'ViewArchivedHeader',
  props: {
    viewActive: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      filteredCustomers: [
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" },
        // שאר הלקוחות
      ],
    };
  },
  computed: {
    ...mapState([models.clients]),
    computedActive: {
      get() {
        return this.viewActive
      },
      set(value) {
        this.$emit(events.change, value)
      },
    },
  },
}
</script>

<style scoped></style>
