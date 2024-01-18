<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <Users />
  </div>
</template>

<script>
export default {
  name: 'UsersPage',
  async created() {
    const headers = this.$api.getHeaders()
    await this.$api.getAllUsers(headers)
    await this.$api.getCurrentUser(headers)
  },
}
</script>
