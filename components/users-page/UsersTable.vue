<template>
  <Table class="rounded-md shadow">
    <template #header>
      <TableHeader class="py-6">
        <div class="table-header">
          <AddRowButton v-if="isCurrentUserAdmin" @click="onAddRowClick" /> USERS
        </div>
      </TableHeader>
    </template>
    <template #body>
      <div class="table-body-container">
        <TableRow v-for="(user, index) in users" :key="user.id" class="px-2 py-2" :idx="index" :class="{
          'selected': isUserSelected(user.id),
          'row': !isUserSelected(user.id),
        }">
          <div class="table-col w-4"></div>
          <div class="table-col w-full cursor-pointer text-black font-medium" @click="setSelected(user)">
            {{ user.username }}
            <span class="font-light">&nbsp;({{ user.userType }})</span>
          </div>
          <div class="table-col">
            <DeleteButton v-if="isCurrentUserAdmin" @click="onDeleteClick(user)" />
          </div>
          <Modal :showing="showDelete" @hide="closeDeleteModal">
            <DeleteType :label="currentUserToDelete.username" @hide="closeDeleteModal" @delete="deleteUser" />
          </Modal>
        </TableRow>
      </div>
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
  },
  data() {
    return {
      showDelete: false,
      deleteUserId: null,
      selectedUserId: null, // To store the selected user id
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
    currentUserToDelete() {
      if (this.deleteUserId && this.users) {
        return this.users.find(user => user.id === this.deleteUserId) || null;
      } else {
        return ''
      }
    },
  },
  methods: {
    setSelected(user) {
      this.selectedUserId = user.id // Mark the clicked user as selected
      this.$emit(events.click, user.id)
    },
    isUserSelected(userId) {
      return this.selectedUserId === userId // Check if the user is selected
    },
    onAddRowClick() {
      this.$emit(events.change)
    },
    onDeleteClick(user) {
      this.deleteUserId = user.id
      this.showDelete = true
    },
    async deleteUser() {
      const res = await this.$api.deleteUser(this.headers, { userId: this.deleteUserId })
      if (res.success === 'Success') this.$store.commit('deleteUser', this.deleteUserId)
      this.$toast.success(`${this.currentUserToDelete.username} user delete`)
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
.selected.even .table-col {
  @apply text-gray-100;
}

.row:hover .table-col {
  @apply text-gray-100;
}

.table-body-container {
  max-height: 800px;
  overflow-y: auto;
  display: block;
}

.table-body-container .table-row {
  display: flex;
}
</style>
