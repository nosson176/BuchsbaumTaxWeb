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
    <Modal :showing="showChangePasswordModal" @hide="closeChangePasswordModal">
      <ChangePasswordModal :user-id="selectedUserId" @hide="closeChangePasswordModal" />
    </Modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { models, USER_TYPE_ADMIN } from '~/shared/constants'
import { userConstructor } from '~/shared/domain-utilities'

export default {
  name: 'Users',
  data() {
    return {
      selectedUserId: null,
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
      const user = userConstructor()
      this.$api.createUser(this.headers, { user }).then((user) => {
        this.selectedUserId = user.id
        this.openChangePasswordModal()
      })
    },
    openChangePasswordModal() {
      this.showChangePasswordModal = true
    },
    closeChangePasswordModal() {
      this.showChangePasswordModal = false
    },
  },
}
</script>

<style scoped></style>
