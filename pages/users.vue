<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <div v-if="isLoading" class="text-center py-10">Loading users...</div>
    <Users v-else />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { models } from '~/shared/constants'

export default {
  name: 'UsersPage',
  data() {
    return {
      isLoading: false,
    }
  },
  async created() {
    this.isLoading = true
    const headers = this.$api.getHeaders()
    try {
      if (!this.users || !Object.keys(this.users).length) {
        await this.$api.getAllUsers(headers)
      }
      if (!this.currentUser || !Object.keys(this.currentUser).length) {
        await this.$api.getCurrentUser(headers)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      this.isLoading = false
    }
  },
  computed: {
    ...mapState({
      users: (state) => state[models.users],
      currentUser: (state) => state[models.currentUser],
    }),
  },
}
</script>
