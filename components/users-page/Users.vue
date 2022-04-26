<template>
  <div class="w-full h-full grid grid-cols-2">
    <UsersTable :users="usersCopy" :user-id="selectedUserId" @click="setSelectedUserId" />
    <UserDetails :user="user" />
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
  },
  methods: {
    setSelectedUserId(userId) {
      this.selectedUserId = userId
    },
  },
}
</script>

<style scoped></style>
