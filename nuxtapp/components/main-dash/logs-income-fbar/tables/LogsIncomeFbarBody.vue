<template>
  <div class="flex flex-grow overflow-hidden">
    <LogsTable v-if="showLogs" :show-archived="showArchived" @delete="openDeleteModal" />
    <IncomeTable v-else-if="showIncome" :show-archived="showArchived" />
    <FbarTable v-else-if="showFbar" :show-archived="showArchived" />
    <Modal :showing="showDeleteModal">
      <DeleteCard :id="deleteId" :type="deleteType" @hide="closeDeleteModal" />
    </Modal>
  </div>
</template>

<script>
import { tabs } from '~/shared/constants'
export default {
  name: 'LogsIncomeFbarBody',
  props: {
    showArchived: {
      type: Boolean,
      default: false
    },
    currentTab: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showDeleteModal: false,
      deleteId: '',
      deleteType: ''
    }
  },
  computed: {
    showLogs () {
      return this.currentTab === tabs.logs
    },
    showIncome () {
      return this.currentTab === tabs.income
    },
    showFbar () {
      return this.currentTab === tabs.fbar
    }
  },
  methods: {
    openDeleteModal ({ id, type }) {
      this.showDeleteModal = true
      this.deleteId = id
      this.deleteType = type
    },
    closeDeleteModal () {
      this.showDeleteModal = false
    }
  }
}
</script>

<style scoped>

</style>
