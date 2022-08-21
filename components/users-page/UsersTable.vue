<template>
  <Table>
    <template #header>
      <TableHeader>
        <div class="table-header">
          <AddRowButton @click="onAddRowClick" />
        </div>
        <div class="table-header w-full">Name</div>
      </TableHeader>
    </template>
    <template #body>
      <TableRow
        v-for="(user, index) in users"
        :key="user.id"
        class="px-2"
        :idx="index"
        :class="isUserSelected(user.id) ? 'selected' : 'row'"
      >
        <div class="table-col w-full cursor-pointer" @click="setSelected(user)">
          {{ user.username }}
          <span class="font-light">({{ user.userType }})</span>
        </div>
        <div class="table-col">
          <DeleteButton @click="onDeleteClick(user)" />
        </div>
        <Modal :showing="showDelete" @hide="closeDeleteModal">
          <DeleteType :label="user.username" @hide="closeDeleteModal" @delete="deleteUser" />
        </Modal>
      </TableRow>
    </template>
  </Table>
</template>

<script>
import { events } from '~/shared/constants'
export default {
  name: 'UsersTable',
  props: {
    users: {
      type: Array,
      required: true,
    },
    userId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      showDelete: false,
      deleteUserId: null,
    }
  },
  computed: {
    headers() {
      return this.$api.getHeaders()
    },
  },
  methods: {
    setSelected(user) {
      this.$emit(events.click, user.id)
    },
    isUserSelected(userId) {
      return userId === this.userId
    },
    onAddRowClick() {
      this.$emit(events.change)
    },
    onDeleteClick(user) {
      this.deleteUserId = user.id
      this.showDelete = true
    },
    deleteUser() {
      this.$api.deleteUser(this.headers, { userId: this.deleteUserId })
      this.closeDeleteModal()
    },
    closeDeleteModal() {
      this.showDelete = false
    },
  },
}
</script>

<style scoped>
.selected,
.selected.even,
.row:hover {
  @apply bg-gray-700;
}

.selected .table-col,
.row .table-col:hover {
  @apply text-gray-100;
}
</style>
