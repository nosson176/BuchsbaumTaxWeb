<template>
  <Table class="rounded-md shadow">
    <template #header>
      <TableHeader class="py-6">
        <div class="table-header">
          <AddRowButton v-if="isCurrentUserAdmin" @click="onAddRowClick" />
        </div>
        <div class="table-header w-full">Name</div>
      </TableHeader>
    </template>
    <template #body>
      <TableRow
        v-for="(user, index) in users"
        :key="user.id"
        class="px-2 py-2"
        :idx="index"
        :class="isUserSelected(user.id) ? 'selected' : 'row'"
      >
        <div class="table-col w-4"></div>
        <div class="table-col w-full cursor-pointer text-black font-medium" @click="setSelected(user)">
          {{ user.username }}
          <span class="font-light">&nbsp;({{ user.userType }})</span>
        </div>
        <div class="table-col">
          <DeleteButton v-if="isCurrentUserAdmin" @click="onDeleteClick(user)" />
        </div>
        <Modal :showing="showDelete" @hide="closeDeleteModal">
          <DeleteType :label="user.username" @hide="closeDeleteModal" @delete="deleteUser" />
        </Modal>
      </TableRow>
    </template>
  </Table>
</template>

<script>
import { mapState } from 'vuex'
import { events, models, USER_TYPE_ADMIN } from '~/shared/constants'
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
    ...mapState([models.currentUser]),
    headers() {
      return this.$api.getHeaders()
    },
    isCurrentUserAdmin() {
      return this.currentUser.userType === USER_TYPE_ADMIN
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
.selected.even {
  @apply bg-gray-700;
}

.row:hover {
  @apply bg-gray-400;
}

.selected .table-col,
.row .table-col:hover {
  @apply text-gray-100;
}
</style>
