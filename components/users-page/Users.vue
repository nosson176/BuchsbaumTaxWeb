<template>
  <div class="w-full h-full grid grid-cols-2">
    <UsersTable
      :key="usersCopy.length"
      :users="usersCopy"
      :user-id="selectedUserId"
      @click="setSelectedUserId"
      @change="addUserRow"
    />
    <UserDetails v-if="user" :key="user.id" :user="user" @click="openChangePasswordModal" />
    <Modal :showing="showCreateUserModal" @hide="closeCreateUserModal">
      <CreateNewUserModal @hide="closeCreateUserModal" />
    </Modal>
    <Modal :showing="showChangePasswordModal" @hide="closeChangePasswordModal">
      <ChangePasswordModal :user-id="selectedUserId" @hide="closeChangePasswordModal" />
    </Modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { models, USER_TYPE_ADMIN } from '~/shared/constants'

export default {
  name: 'Users',
  data() {
    return {
      selectedUserId: null,
      showCreateUserModal: false,
      showChangePasswordModal: false,
    }
  },
  computed: {
    ...mapState([models.users, models.currentUser]),
    usersCopy() {
      return Object.values(JSON.parse(JSON.stringify(this.users)))
    },
    user() {
      return Object.values(this.users).find((user) => user.id === this.selectedUserId)
    },
    headers() {
      return this.$api.getHeaders()
    },
    isCurrentUserAdmin() {
      return this.currentUser.userType === USER_TYPE_ADMIN
    },
  },
  methods: {
    setSelectedUserId(userId) {
      if (this.isCurrentUserAdmin) {
        this.selectedUserId = userId
      }
    },
    addUserRow() {
      this.openCreateUserModal()
    },
    openChangePasswordModal() {
      this.showChangePasswordModal = true
    },
    closeChangePasswordModal() {
      this.showChangePasswordModal = false
    },
    openCreateUserModal() {
      this.showCreateUserModal = true
    },
    closeCreateUserModal(id) {
      this.showCreateUserModal = false
      this.selectedUserId = id
    },
  },
}
</script>

<style scoped></style>
