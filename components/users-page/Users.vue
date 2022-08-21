<template>
  <div class="w-full h-full grid grid-cols-2">
    <UsersTable :users="usersCopy" :user-id="selectedUserId" @click="setSelectedUserId" />
    <UserDetails v-if="user" :key="user.id" :user="user" @change="updateUser" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { models } from '~/shared/constants'
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
  },
}
</script>

<style scoped></style>
