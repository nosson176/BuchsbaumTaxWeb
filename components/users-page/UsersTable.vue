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
        :class="isUserSelected(user) ? 'selected' : 'row'"
      >
        <div class="table-col w-full cursor-pointer" @click="setSelected(user)">
          {{ user.username }}
          <span class="font-light">({{ user.userType }})</span>
        </div>
        <div class="table-col">
          <DeleteButton @click="deleteUser(user.id)" />
        </div>
      </TableRow>
      <Modal :showing="showDelete" @hide="closeDeleteModal">
        <DeleteType @hide="closeDeleteModal" @delete="completeDelete" />
      </Modal>
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
      deleteId: null,
      showDelete: false,
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
    isUserSelected({ id }) {
      return id === this.userId
    },
    onAddRowClick() {
      const user = {
        username: '',
        firstName: '',
        lastName: '',
        userType: '',
        notifyOfLogins: false,
      }
      this.$api.createUser(this.headers, { user })
    },
    deleteUser(userId) {
      this.deleteId = userId
      this.showDelete = true
    },
    completeDelete() {
      this.$api.deleteUser(this.headers, { userId: this.deleteId })
      this.showDelete = false
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
