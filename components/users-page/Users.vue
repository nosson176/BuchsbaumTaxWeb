<template>
  <div class="w-full h-full grid grid-cols-2">
    <UsersTable
      :key="usersCopy.length"
      :users="usersCopy"
      :user-id="selectedUserId"
      @click="setSelectedUserId"
      @change="addUserRow"
    />
    <UserDetails v-if="user" :key="user.id" :user="user" @change="updateUser" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { models } from '~/shared/constants'
import { userConstructor } from '~/shared/domain-utilities'
export default {
  name: 'Users',
  data() {
    return {
      selectedUserId: null,
    }
  },
  computed: {
    ...mapState([models.users]),
    usersCopy() {
      return Object.values(JSON.parse(JSON.stringify(this.users)))
    },
    user() {
      return Object.values(this.users).find((user) => user.id === this.selectedUserId)
    },
    headers() {
      return this.$api.getHeaders()
    },
  },
  methods: {
    setSelectedUserId(userId) {
      this.selectedUserId = userId
    },
    updateUser(user) {
      this.$api.updateUser(this.headers, { userId: user.id }, user)
    },
    addUserRow() {
      const user = userConstructor()
      this.usersCopy.push(user)
      this.usersCopy.splice(this.usersCopy.length)
    },
  },
}
</script>

<style scoped></style>
